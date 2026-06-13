import { Hono } from 'hono';
import { ThreatRepository } from '../repositories/ThreatRepository';
import { ThreatIngestWorker } from '../services/workers/threatIngest';
import axios from 'axios';

const intelRoutes = new Hono();
const threatRepo = new ThreatRepository();
const ingestWorker = new ThreatIngestWorker();

// POST /api/intel/search
intelRoutes.post('/search', async (c) => {
  try {
    const { query, type = 'ip' } = await c.req.json();

    if (!query) {
      return c.json({ success: false, message: 'Query is required' }, 400);
    }

    const results = {
      supabase: [] as any[],
      abuseipdb: null as any,
      otx: null as any
    };

    // Search Supabase
    const allThreats = await threatRepo.findAll();
    results.supabase = allThreats.filter(t =>
      t.indicator.toLowerCase().includes(query.toLowerCase())
    );

    // Search AbuseIPDB if it's an IP
    if (type === 'ip' && process.env.ABUSEIPDB_API_KEY) {
      try {
        const response = await axios.get('https://api.abuseipdb.com/api/v2/check', {
          params: { ipAddress: query, maxAgeInDays: '90' },
          headers: { 'Key': process.env.ABUSEIPDB_API_KEY, 'Accept': 'application/json' }
        });
        results.abuseipdb = response.data;
      } catch (e) {
        console.error('AbuseIPDB search failed:', e);
      }
    }

    // Search OTX
    if (process.env.OTX_API_KEY) {
      try {
        const indicatorType = type === 'ip' ? 'IPv4' : type === 'domain' ? 'domain' : 'url';
        const response = await axios.get(
          `https://otx.alienvault.com/api/v1/indicators/${indicatorType}/${query}/general`,
          { headers: { 'X-OTX-API-KEY': process.env.OTX_API_KEY } }
        );
        results.otx = response.data;
      } catch (e) {
        console.error('OTX search failed:', e);
      }
    }

    return c.json({ success: true, data: results });
  } catch (error: any) {
    console.error('Intel search error:', error);
    return c.json({
      success: false,
      message: error.message || 'Failed to search intel'
    }, 500);
  }
});

export default intelRoutes;
