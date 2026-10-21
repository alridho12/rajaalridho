
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

import {
  createHash,
  randomUUID,
} from 'node:crypto';

// ==========================================
// CONFIGURATION
// ==========================================

const VISITOR_KEY =
  'portfolio:visitors:country:list:v1';

const COUNT_KEY =
  'portfolio:visitors:country:count:v1';

const MAX_VISIBLE = 150;

const MAX_COUNTRY_LENGTH = 60;

// ==========================================
// UPSTASH REDIS CONNECTION
// ==========================================

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// ==========================================
// RATE LIMIT
// ==========================================

// Maximum 3 check-ins per hour per network.

const ratelimit = new Ratelimit({
  redis,

  limiter: Ratelimit.slidingWindow(
    3,
    '1 h'
  ),

  prefix: 'portfolio:visitors:country:rate',
});

// ==========================================
// READ GLOBAL VISITORS
// ==========================================

const getVisitors = async () => {
  const [rawRecords, rawCount] =
    await Promise.all([
      redis.lrange(
        VISITOR_KEY,
        0,
        MAX_VISIBLE - 1
      ),

      redis.get(COUNT_KEY),
    ]);

  const visitors = rawRecords
    .map((record) => {
      try {
        const data =
          typeof record === 'string'
            ? JSON.parse(record)
            : record;

        // Ignore invalid records.

        if (
          !data ||
          typeof data !== 'object' ||
          typeof data.country !== 'string' ||
          !Number.isFinite(data.lat) ||
          !Number.isFinite(data.lng)
        ) {
          return null;
        }

        return {
          id: data.id,
          country: data.country,
          lat: data.lat,
          lng: data.lng,
          createdAt: data.createdAt,
        };
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  return {
    visitors,
    total: Number(rawCount) || 0,
  };
};

// ==========================================
// VALIDATE COUNTRY
// ==========================================

const validateCountry = (rawCountry) => {
  if (typeof rawCountry !== 'string') {
    return null;
  }

  const country = rawCountry
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[\u0000-\u001F\u007F]/g, '');

  if (
    country.length < 2 ||
    country.length > MAX_COUNTRY_LENGTH
  ) {
    return null;
  }

  return country;
};

// ==========================================
// VALIDATE COORDINATES
// ==========================================

const validateCoordinates = (lat, lng) => {
  if (
    typeof lat !== 'number' ||
    typeof lng !== 'number'
  ) {
    return false;
  }

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng)
  ) {
    return false;
  }

  if (
    lat < -90 ||
    lat > 90 ||
    lng < -180 ||
    lng > 180
  ) {
    return false;
  }

  return true;
};

// ==========================================
// CREATE RATE LIMIT IDENTIFIER
// ==========================================

const getVisitorIdentifier = (req) => {
  const ip = String(
    req.headers['x-forwarded-for'] ||
    req.headers['x-real-ip'] ||
    'unknown'
  )
    .split(',')[0]
    .trim();

  // Hash the network address.
  // Raw IP is not stored in Redis.

  return createHash('sha256')
    .update(
      `${ip}:${process.env.UPSTASH_REDIS_REST_TOKEN}`
    )
    .digest('hex');
};

// ==========================================
// VERCEL API HANDLER
// ==========================================

export default async function handler(req, res) {
  // Disable response caching.

  res.setHeader(
    'Cache-Control',
    'no-store, max-age=0'
  );

  // ========================================
  // GET: READ VISITOR DATA
  // ========================================

  if (req.method === 'GET') {
    try {
      const data = await getVisitors();

      return res.status(200).json({
        success: true,
        ...data,
      });
    } catch (error) {
      console.error(
        'GET visitors error:',
        error
      );

      return res.status(500).json({
        success: false,
        error: 'Failed to load visitors',
      });
    }
  }

  // ========================================
  // POST: VISITOR CHECK-IN
  // ========================================

  if (req.method === 'POST') {
    try {
      // ====================================
      // READ REQUEST BODY
      // ====================================

      const {
        country: rawCountry,
        lat,
        lng,
      } = req.body || {};

      // ====================================
      // VALIDATE COUNTRY
      // ====================================

      const country = validateCountry(
        rawCountry
      );

      if (!country) {
        return res.status(400).json({
          success: false,
          error:
            'Country must contain 2-60 characters',
        });
      }

      // ====================================
      // VALIDATE GLOBE LOCATION
      // ====================================

      if (
        !validateCoordinates(lat, lng)
      ) {
        return res.status(400).json({
          success: false,
          error:
            'Invalid globe coordinates',
        });
      }

      // ====================================
      // RATE LIMIT
      // ====================================

      const identifier =
        getVisitorIdentifier(req);

      const rateResult =
        await ratelimit.limit(identifier);

      if (!rateResult.success) {
        res.setHeader(
          'Retry-After',
          String(
            Math.max(
              1,
              Math.ceil(
                (rateResult.reset - Date.now()) /
                1000
              )
            )
          )
        );

        return res.status(429).json({
          success: false,
          error:
            'Too many check-ins. Please try again later.',
        });
      }

      // ====================================
      // CREATE VISITOR RECORD
      // ====================================

      const visitor = {
        id: randomUUID(),

        country,

        // Approximate location only.

        lat: Number(
          lat.toFixed(1)
        ),

        lng: Number(
          lng.toFixed(1)
        ),

        createdAt:
          new Date().toISOString(),
      };

      // ====================================
      // SAVE TO UPSTASH
      // ====================================

      const transaction = redis.multi();

      // Increase total check-ins.

      transaction.incr(COUNT_KEY);

      // Add newest visitor first.

      transaction.lpush(
        VISITOR_KEY,
        JSON.stringify(visitor)
      );

      // Store only the latest 150 records.

      transaction.ltrim(
        VISITOR_KEY,
        0,
        MAX_VISIBLE - 1
      );

      // Execute storage operations.

      await transaction.exec();

      // ====================================
      // RETURN UPDATED DATA
      // ====================================

      const data = await getVisitors();

      return res.status(201).json({
        success: true,
        message:
          'Visitor check-in saved successfully',
        ...data,
      });
    } catch (error) {
      console.error(
        'POST visitors error:',
        error
      );

      return res.status(500).json({
        success: false,
        error: 'Failed to save check-in',
      });
    }
  }

  // ========================================
  // METHOD NOT ALLOWED
  // ========================================

  res.setHeader(
    'Allow',
    ['GET', 'POST']
  );

  return res.status(405).json({
    success: false,
    error: 'Method not allowed',
  });
}
