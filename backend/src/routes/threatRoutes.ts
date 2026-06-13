import { Hono } from 'hono';
import { ThreatService } from '../services/ThreatService';
import { ipSearchSchema } from '../validators/ip';

const threatRoutes = new Hono();
const threatService = new ThreatService();

// GET /api/threats
threatRoutes.get('/', async (c) => {
  try {
    const limit = c.req.query('limit') ? parseInt(c.req.query('limit')!) : undefined;
    const threats = await threatService.getAllThreats(limit);
    return c.json({
      success: true,
      data: threats
    });
  } catch (error) {
    console.error('Error fetching threats:', error);
    return c.json({
      success: false,
      message: 'Failed to fetch threats'
    }, 500);
  }
});

// GET /api/threats/stats
threatRoutes.get('/stats', async (c) => {
  try {
    const stats = await threatService.getThreatStats();
    return c.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching threat stats:', error);
    return c.json({
      success: false,
      message: 'Failed to fetch threat stats'
    }, 500);
  }
});

// POST /api/threats/analyze
threatRoutes.post('/analyze', async (c) => {
  try {
    const data = await c.req.json();
    const validationResult = ipSearchSchema.safeParse(data);
    if (!validationResult.success) {
      const error = validationResult.error.issues[0]?.message || 'Invalid request';
      return c.json({ success: false, message: error }, 400);
    }

    const threat = await threatService.analyzeIp(validationResult.data.ip);
    return c.json({
      success: true,
      data: threat
    });
  } catch (error: any) {
    console.error('Error analyzing IP:', error);
    return c.json({
      success: false,
      message: error.message || 'Failed to analyze IP address'
    }, 500);
  }
});

export default threatRoutes;
