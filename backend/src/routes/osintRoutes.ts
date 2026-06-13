import { Hono } from 'hono';
import { OsintService } from '../services/OsintService';

const osintRoutes = new Hono();
const osintService = new OsintService();

// POST /api/osint/lookup
osintRoutes.post('/lookup', async (c) => {
  try {
    const body = await c.req.json();
    const { query, type } = body;

    if (!query || !type) {
      return c.json({
        success: false,
        message: 'Query and type are required'
      }, 400);
    }

    const result = await osintService.performLookup({ query, type });
    return c.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error performing OSINT lookup:', error);
    return c.json({
      success: false,
      message: 'Failed to perform OSINT lookup'
    }, 500);
  }
});

export default osintRoutes;
