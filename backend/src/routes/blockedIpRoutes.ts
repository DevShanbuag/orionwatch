import { Hono } from 'hono';
import { BlockedIpService } from '../services/BlockedIpService';
import { ipAddressSchema } from '../validators/ip';

const blockedIpRoutes = new Hono();
const blockedIpService = new BlockedIpService();

// GET /api/blocked-ips
blockedIpRoutes.get('/', async (c) => {
  try {
    const blockedIps = await blockedIpService.getAllBlockedIps();
    return c.json({
      success: true,
      data: blockedIps
    });
  } catch (error) {
    console.error('Error fetching blocked IPs:', error);
    return c.json({
      success: false,
      message: 'Failed to fetch blocked IPs'
    }, 500);
  }
});

// POST /api/blocked-ips
blockedIpRoutes.post('/', async (c) => {
  try {
    const blockedIp = await c.req.json();
    if (!blockedIp.ip_address) {
      return c.json({ success: false, message: 'IP address is required' }, 400);
    }

    // Validate IP address format (IPv4 or IPv6)
    const validationResult = ipAddressSchema.safeParse(blockedIp.ip_address);
    if (!validationResult.success) {
      const error = validationResult.error.issues[0]?.message || 'Invalid IP address format';
      return c.json({ success: false, message: error }, 400);
    }

    const newBlockedIp = await blockedIpService.createBlockedIp(blockedIp);
    return c.json({
      success: true,
      data: newBlockedIp
    });
  } catch (error: any) {
    console.error('Error creating blocked IP:', error);
    return c.json({
      success: false,
      message: error.message || 'Failed to create blocked IP'
    }, 500);
  }
});

export default blockedIpRoutes;
