import { Context, Next } from 'hono';
import { Redis } from '@upstash/redis';

const WINDOW_SIZE_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_IP = 5; // 5 requests per window for IP
const MAX_REQUESTS_USER = 10; // 10 requests per window for authenticated users

// Initialize Redis if credentials are available
let redis: Redis | null = null;
if (process.env.UPSTASH_REDIS_URL && process.env.UPSTASH_REDIS_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_URL,
    token: process.env.UPSTASH_REDIS_TOKEN,
  });
}

// Fallback to in-memory store if Redis isn't configured
const inMemoryStore = new Map<string, { count: number; resetTime: number }>();

export const rateLimit = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');
  let clientKey: string;
  let maxRequests: number;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // Use user ID or token as key for authenticated users
    clientKey = `rate_limit:user:${authHeader.slice(7)}`;
    maxRequests = MAX_REQUESTS_USER;
  } else {
    // Fall back to IP for unauthenticated
    const clientIp = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
    clientKey = `rate_limit:ip:${clientIp}`;
    maxRequests = MAX_REQUESTS_IP;
  }
  
  const now = Date.now();
  let count: number;
  let resetTime: number;
  
  if (redis) {
    // Use Redis for distributed rate limiting
    const current = await redis.get<{ count: number; resetTime: number }>(clientKey);
    
    if (!current || now > current.resetTime) {
      resetTime = now + WINDOW_SIZE_MS;
      count = 1;
      await redis.setex(clientKey, Math.ceil(WINDOW_SIZE_MS / 1000), { count, resetTime });
    } else {
      count = current.count + 1;
      resetTime = current.resetTime;
      await redis.setex(clientKey, Math.ceil(WINDOW_SIZE_MS / 1000), { count, resetTime });
    }
  } else {
    // Use in-memory store as fallback
    let entry = inMemoryStore.get(clientKey);
    
    if (!entry || now > entry.resetTime) {
      entry = {
        count: 1,
        resetTime: now + WINDOW_SIZE_MS
      };
      inMemoryStore.set(clientKey, entry);
    } else {
      entry.count += 1;
      inMemoryStore.set(clientKey, entry);
    }
    
    count = entry.count;
    resetTime = entry.resetTime;
  }
  
  const requestsLeft = Math.max(0, maxRequests - count);
  c.res.headers.set('X-RateLimit-Limit', maxRequests.toString());
  c.res.headers.set('X-RateLimit-Remaining', requestsLeft.toString());
  c.res.headers.set('X-RateLimit-Reset', resetTime.toString());
  
  if (count > maxRequests) {
    c.res.headers.set('Retry-After', '60');
    return c.json({
      error: 'Rate limit exceeded',
      retryAfter: 60
    }, 429);
  }
  
  await next();
};
