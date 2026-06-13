import { Hono } from 'hono';
import { ThreatRepository } from '../repositories/ThreatRepository';
import { ipSearchSchema, ipAddressSchema, getIpVersion } from '../validators/ip';
import { abuseIPDBService } from '../services/abuseipdb';
import { otxService } from '../services/otx';
import { threatCache } from '../services/cache';

const ipRoutes = new Hono();
const threatRepo = new ThreatRepository();

ipRoutes.post('/search', async (c) => {
  try {
    const data = await c.req.json();
    const validationResult = ipSearchSchema.safeParse(data);
    if (!validationResult.success) {
      const error = validationResult.error.issues[0]?.message || 'Invalid request';
      return c.json({ success: false, message: error }, 400);
    }
    const { ip } = validationResult.data;
    const ipVersion = getIpVersion(ip);

    // Check cache first
    const cacheKey = `ip-search:${ip}`;
    const cachedResults = await threatCache.getCachedResponse(cacheKey);
    if (cachedResults) {
      return c.json({ success: true, data: cachedResults, cache_hit: true });
    }

    const results = {
      supabase: [] as unknown[],
      abuseipdb: null as unknown,
      otx: null as unknown
    };

    // Search Supabase
    const allThreats = await threatRepo.findAll();
    results.supabase = allThreats.filter(t => t.indicator === ip);

    // Search AbuseIPDB
    try {
      results.abuseipdb = await abuseIPDBService.checkIP(ip);
    } catch (e) {
      console.error('AbuseIPDB search failed:', e);
    }

    // Search OTX
    if (ipVersion) {
      try {
        results.otx = await otxService.getGeneral(ip);
      } catch (e) {
        console.error('OTX search failed:', e);
      }
    }

    // Cache the results
    await threatCache.setCachedResponse(cacheKey, 'IP Search', results);

    return c.json({ success: true, data: results, cache_hit: false });
  } catch (error: unknown) {
    console.error('IP search error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to search IP';
    return c.json({
      success: false,
      message: errorMessage
    }, 500);
  }
});

ipRoutes.get('/:ip', async (c) => {
  const ip = c.req.param('ip');
  const validationResult = ipAddressSchema.safeParse(ip);
  if (!validationResult.success) {
    const error = validationResult.error.issues[0]?.message || 'Invalid request';
    return c.json({ success: false, message: error }, 400);
  }
  const ipVersion = getIpVersion(ip);

  // Check cache first
  const cacheKey = `ip:${ip}`;
  const cachedResults = await threatCache.getCachedResponse(cacheKey);
  if (cachedResults) {
    return c.json({ success: true, data: cachedResults, cache_hit: true });
  }

  const results = {
    supabase: [] as unknown[],
    abuseipdb: null as unknown,
    otx: null as unknown
  };

  // Search Supabase
  const allThreats = await threatRepo.findAll();
  results.supabase = allThreats.filter(t => t.indicator === ip);

  // Search AbuseIPDB
  try {
    results.abuseipdb = await abuseIPDBService.checkIP(ip);
  } catch (e) {
    console.error('AbuseIPDB search failed:', e);
  }

  // Search OTX
  if (ipVersion) {
    try {
      results.otx = await otxService.getGeneral(ip);
    } catch (e) {
      console.error('OTX search failed:', e);
    }
  }

  // Cache the results
  await threatCache.setCachedResponse(cacheKey, 'IP Lookup', results);

  return c.json({ success: true, data: results, cache_hit: false });
});

export default ipRoutes;
