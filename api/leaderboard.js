
import { Redis } from '@upstash/redis';
import { randomUUID } from 'node:crypto';

// ==========================================
// GLOBAL LEADERBOARD CONFIG
// ==========================================

const LEADERBOARD_KEY = 'cyber-dodge:top5';
const MAX_PLAYERS = 5;

// ==========================================
// UPSTASH CONNECTION
// ==========================================

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// ==========================================
// GET TOP 5 FROM DATABASE
// ==========================================

const getLeaderboard = async () => {
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

  for (let i = 0; i < results.length; i += 2) {
    const member = String(results[i]);
    const score = Number(results[i + 1]);

    const separator = member.indexOf('|');

    if (separator === -1) continue;

    const id = member.slice(0, separator);

    const name = decodeURIComponent(
      member.slice(separator + 1)
    );

    leaderboard.push({
      id,
      name,
      score,
    });
  }

  return leaderboard;
};

// ==========================================
// VERCEL API FUNCTION
// ==========================================

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  // ========================================
  // GET: READ GLOBAL LEADERBOARD
  // ========================================

  if (req.method === 'GET') {
    try {
      const leaderboard = await getLeaderboard();

      return res.status(200).json({
        success: true,
        leaderboard,
      });
    } catch (error) {
      console.error('GET leaderboard error:', error);

      return res.status(500).json({
        success: false,
        error: 'Failed to load leaderboard',
      });
    }
  }

  // ========================================
  // POST: SAVE PLAYER SCORE
  // ========================================

  if (req.method === 'POST') {
    try {
      const rawName = req.body?.name;
      const score = req.body?.score;

      // Validate name

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

      // ====================================
      // CHECK IF SCORE QUALIFIES
      // ====================================

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

      // ====================================
      // CREATE NEW RECORD
      // ====================================

      const id = randomUUID();

      const member =
        `${id}|${encodeURIComponent(name)}`;

      // ====================================
      // SAVE TO REDIS
      // ====================================

      const transaction = redis.multi();

      transaction.zadd(LEADERBOARD_KEY, {
        score,
        member,
      });

      // Keep only the five highest scores

      transaction.zremrangebyrank(
        LEADERBOARD_KEY,
        0,
        -(MAX_PLAYERS + 1)
      );

      await transaction.exec();

      // ====================================
      // GET LATEST TOP 5
      // ====================================

      const leaderboard = await getLeaderboard();

      const qualified = leaderboard.some(
        (player) => player.id === id
      );

      if (!qualified) {
        return res.status(409).json({
          error: 'Score no longer qualifies',
          leaderboard,
        });
      }

      return res.status(201).json({
        success: true,
        message: 'Score saved successfully',
        leaderboard,
      });
    } catch (error) {
      console.error('POST leaderboard error:', error);

      return res.status(500).json({
        success: false,
        error: 'Failed to save score',
      });
    }
  }

  // ========================================
  // UNSUPPORTED METHOD
  // ========================================

  res.setHeader('Allow', ['GET', 'POST']);

  return res.status(405).json({
    error: 'Method not allowed',
  });
}
