
const express = require('express');
const cors = require('cors');

const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

const app = express();

const PORT = process.env.PORT || 4000;

const DATA_DIR =
  process.env.DATA_DIR ||
  path.join(__dirname, 'data');

const FILE_PATH = path.join(
  DATA_DIR,
  'leaderboard.json'
);

const MAX_PLAYERS = 5;

// ==========================================
// ALLOWED FRONTEND DOMAINS
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
// PREPARE STORAGE
// ==========================================

fs.mkdirSync(DATA_DIR, {
  recursive: true,
});

if (!fs.existsSync(FILE_PATH)) {
  fs.writeFileSync(
    FILE_PATH,
    JSON.stringify([], null, 2)
  );
}

// ==========================================
// READ AND WRITE JSON
// ==========================================

const readLeaderboard = () => {
  const data = JSON.parse(
    fs.readFileSync(FILE_PATH, 'utf8')
  );

  return Array.isArray(data) ? data : [];
};

const writeLeaderboard = (records) => {
  const tempPath = `${FILE_PATH}.tmp`;

  fs.writeFileSync(
    tempPath,
    JSON.stringify(records, null, 2)
  );

  fs.renameSync(tempPath, FILE_PATH);
};

// ==========================================
// REAL-TIME CONNECTIONS
// ==========================================

const clients = new Set();

const broadcastLeaderboard = (records) => {
  const message = `data: ${JSON.stringify(records)}\n\n`;

  clients.forEach((client) => {
    client.write(message);
  });
};

// ==========================================
// HEALTH CHECK
// ==========================================

app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'Cyber Dodge Leaderboard',
  });
});

// ==========================================
// GET GLOBAL TOP 5
// ==========================================

app.get('/api/leaderboard', (req, res) => {
  try {
    const leaderboard = readLeaderboard();

    res.json({
      leaderboard,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Failed to load leaderboard',
    });
  }
});

// ==========================================
// REAL-TIME LEADERBOARD EVENTS
// ==========================================

app.get(
  '/api/leaderboard/events',
  (req, res) => {
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

    // Send current leaderboard immediately

    res.write(
      `data: ${JSON.stringify(
        readLeaderboard()
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
  }
);

// ==========================================
// SUBMIT NEW SCORE
// ==========================================

app.post('/api/leaderboard', (req, res) => {
  try {
    const rawName = req.body?.name;
    const score = req.body?.score;

    // Validate player name

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
        error: 'Name must contain 1–16 characters',
      });
    }

    // Validate score

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

    const current = readLeaderboard()
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_PLAYERS);

    // Check Top 5 qualification

    if (
      current.length >= MAX_PLAYERS &&
      score <= current[MAX_PLAYERS - 1].score
    ) {
      return res.status(409).json({
        error: 'Score does not qualify for Top 5',
        leaderboard: current,
      });
    }

    // Add new player

    const newPlayer = {
      id: randomUUID(),
      name,
      score,
    };

    // Sort and keep only five players

    const updated = [
      ...current,
      newPlayer,
    ]
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_PLAYERS);

    // Persist to JSON file

    writeLeaderboard(updated);

    // Notify all connected visitors

    broadcastLeaderboard(updated);

    res.status(201).json({
      success: true,
      leaderboard: updated,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'Failed to save score',
    });
  }
});

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, '0.0.0.0', () => {
  console.log(
    `Leaderboard API running on port ${PORT}`
  );
});
