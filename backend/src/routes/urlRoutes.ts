
import { Hono } from 'hono';
import { urlSearchSchema } from '../validators/url';
import { threatCache } from '../services/cache';
import { virusTotalService } from '../services/virustotal';

const urlRoutes = new Hono();

urlRoutes.post('/search', async (c) => {
  try {
    const data = await c.req.json();
    const validationResult = urlSearchSchema.safeParse(data);
    if (!validationResult.success) {
      const error = validationResult.error.issues[0]?.message || 'Invalid request';
      return c.json({ success: false, message: error }, 400);
    }
    const { url } = validationResult.data;

    // Check cache first
    const cacheKey = `url-search:${url}`;
    const cachedResults = await threatCache.getCachedResponse(cacheKey);
    if (cachedResults) {
      return c.json({ success: true, data: cachedResults, cache_hit: true });
    }

    const results = {
      virustotal: null as unknown,
      urlhaus: null as unknown
    };

    // Search VirusTotal
    try {
      results.virustotal = await virusTotalService.checkURL(url);
    } catch (e) {
      console.error('VirusTotal search failed:', e);
    }

    // Cache the results
    await threatCache.setCachedResponse(cacheKey, 'URL Search', results);

    return c.json({ success: true, data: results, cache_hit: false });
  } catch (error: unknown) {
    console.error('URL search error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to search URL';
    return c.json({
      success: false,
      message: errorMessage
    }, 500);
  }
});

export default urlRoutes;
