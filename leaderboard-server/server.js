
const express = require('express');
const cors = require('cors');
const { Redis } = require('@upstash/redis');
const { randomUUID } = require('node:crypto');

// ==========================================
// SERVER CONFIGURATION
// ==========================================

const app = express();

const PORT = process.env.PORT || 4000;

const LEADERBOARD_KEY = 'cyber-dodge:top5';

const MAX_PLAYERS = 5;

// ==========================================
// UPSTASH REDIS CONNECTION
// ==========================================

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// ==========================================
// CORS CONFIGURATION
// ==========================================

const allowedOrigins = (
  process.env.ALLOWED_ORIGINS ||
  'http://localhost:5173'
)
  .split(',')
  .map((origin) => origin.trim());

app.use(
  cors({
    origin(origin, callback) {
      if (
        !origin ||
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      callback(new Error('Origin not allowed'));
    },
  })
);

app.use(express.json({ limit: '2kb' }));

// ==========================================
// READ GLOBAL TOP 5
// ==========================================

const getLeaderboard = async () => {
  // Read the five highest Redis scores.

  const results = await redis.zrange(
    LEADERBOARD_KEY,
    0,
    MAX_PLAYERS - 1,
    {
      rev: true,
      withScores: true,
    }
  );

  const leaderboard = [];

  // Results:
  // [member, score, member, score, ...]

  for (let i = 0; i < results.length; i += 2) {
    const member = String(results[i]);

    const score = Number(results[i + 1]);

    const separator = member.indexOf('|');

    if (separator === -1) continue;

    const id = member.slice(0, separator);

    const encodedName = member.slice(
      separator + 1
    );

    leaderboard.push({
      id,
      name: decodeURIComponent(encodedName),
      score,
    });
  }

  return leaderboard;
};

// ==========================================
// LIVE UPDATE CLIENTS
// ==========================================

const clients = new Set();

const broadcastLeaderboard = (records) => {
  const message =
    `data: ${JSON.stringify(records)}\n\n`;

  clients.forEach((client) => {
    try {
      client.write(message);
    } catch {
      clients.delete(client);
    }
  });
};

// ==========================================
// HEALTH CHECK
// ==========================================

app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'Cyber Dodge Leaderboard',
    storage: 'Upstash Redis',
  });
});

// ==========================================
// GET GLOBAL LEADERBOARD
// ==========================================

app.get('/api/leaderboard', async (req, res) => {
  try {
    const leaderboard = await getLeaderboard();

    res.setHeader('Cache-Control', 'no-store');

    res.json({
      leaderboard,
    });
  } catch (error) {
    console.error('GET leaderboard:', error);

    res.status(500).json({
      error: 'Failed to load leaderboard',
    });
  }
});

// ==========================================
// REAL-TIME LEADERBOARD STREAM
// ==========================================

app.get(
  '/api/leaderboard/events',
  async (req, res) => {
    try {
      const leaderboard =
        await getLeaderboard();

      res.setHeader(
        'Content-Type',
        'text/event-stream'
      );

      res.setHeader(
        'Cache-Control',
        'no-cache, no-transform'
      );

      res.setHeader(
        'Connection',
        'keep-alive'
      );

      res.setHeader(
        'X-Accel-Buffering',
        'no'
      );

      res.flushHeaders?.();

      clients.add(res);

      // Send initial data

      res.write(
        `data: ${JSON.stringify(
          leaderboard
        )}\n\n`
      );

      // Keep connection alive

      const heartbeat = setInterval(() => {
        res.write(': heartbeat\n\n');
      }, 25000);

      req.on('close', () => {
        clearInterval(heartbeat);

        clients.delete(res);
      });
    } catch (error) {
      console.error('SSE error:', error);

      if (!res.headersSent) {
        res.status(500).json({
          error: 'Leaderboard stream unavailable',
        });
      } else {
        res.end();
      }
    }
  }
);

// ==========================================
// SAVE NEW PLAYER SCORE
// ==========================================

app.post('/api/leaderboard', async (req, res) => {
  try {
    const rawName = req.body?.name;

    const score = req.body?.score;

    // ======================================
    // VALIDATE NAME
    // ======================================

    if (typeof rawName !== 'string') {
      return res.status(400).json({
        error: 'Invalid player name',
      });
    }

    const name = rawName
      .trim()
      .replace(/\s+/g, ' ');

    if (
      name.length < 1 ||
      name.length > 16
    ) {
      return res.status(400).json({
        error: 'Name must contain 1-16 characters',
      });
    }

    // ======================================
    // VALIDATE SCORE
    // ======================================

    if (
      !Number.isSafeInteger(score) ||
      score <= 0 ||
      score > 1000000 ||
      score % 10 !== 0
    ) {
      return res.status(400).json({
        error: 'Invalid score',
      });
    }

    // ======================================
    // CHECK TOP FIVE
    // ======================================

    const current = await getLeaderboard();

    if (
      current.length >= MAX_PLAYERS &&
      score <= current[MAX_PLAYERS - 1].score
    ) {
      return res.status(409).json({
        error: 'Score does not qualify for Top 5',
        leaderboard: current,
      });
    }

    // ======================================
    // CREATE NEW RECORD
    // ======================================

    const id = randomUUID();

    const member =
      `${id}|${encodeURIComponent(name)}`;

    // ======================================
    // SAVE TO UPSTASH REDIS
    // ======================================

    // Sorted sets automatically order
    // scores. Transaction keeps insertion
    // and trimming together.

    const transaction = redis.multi();

    transaction.zadd(LEADERBOARD_KEY, {
      score,
      member,
    });

    // Remove all entries below the top 5.

    transaction.zremrangebyrank(
      LEADERBOARD_KEY,
      0,
      -(MAX_PLAYERS + 1)
    );

    await transaction.exec();

    // ======================================
    // GET UPDATED TOP FIVE
    // ======================================

    const updated = await getLeaderboard();

    const qualified = updated.some(
      (player) => player.id === id
    );

    if (!qualified) {
      return res.status(409).json({
        error: 'Score no longer qualifies',
        leaderboard: updated,
      });
    }

    // ======================================
    // BROADCAST TO VISITORS
    // ======================================

    broadcastLeaderboard(updated);

    res.status(201).json({
      success: true,
      leaderboard: updated,
    });
  } catch (error) {
    console.error('POST leaderboard:', error);

    res.status(500).json({
      error: 'Failed to save score',
    });
  }
});

// ==========================================
// START EXPRESS SERVER
// ==========================================

app.listen(PORT, '0.0.0.0', () => {
  console.log(
    `Cyber Dodge API running on port ${PORT}`
  );
});
