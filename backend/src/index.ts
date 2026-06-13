import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { securityHeaders } from './middleware/security-headers';
import { rateLimit } from './middleware/rateLimit';
import threatRoutes from './routes/threatRoutes';
import serviceRoutes from './routes/serviceRoutes';
import osintRoutes from './routes/osintRoutes';
import { announcementRoutes } from './routes/announcementRoutes';
import incidentRoutes from './routes/incidentRoutes';
import feedRoutes from './routes/feedRoutes';
import blockedIpRoutes from './routes/blockedIpRoutes';
import intelRoutes from './routes/intelRoutes';
import authRoutes from './routes/authRoutes';
import ipRoutes from './routes/ipRoutes';
import urlRoutes from './routes/urlRoutes';

const app = new Hono();

// Middleware
app.use('*', cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));
app.use('*', securityHeaders);

// Health and ready endpoints (exclude from rate limit)
app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.get('/ready', (c) => {
  return c.json({
    status: 'ready',
    timestamp: new Date().toISOString()
  });
});

// Rate limit middleware (applied after health/ready checks)
app.use('*', rateLimit);

// API health check endpoint
app.get('/api/health', (c) => {
  return c.json({
    success: true,
    message: 'OrionWatch API is running',
    timestamp: new Date().toISOString()
  });
});

// Mount routes
app.route('/api/threats', threatRoutes);
app.route('/api/services', serviceRoutes);
app.route('/api/osint', osintRoutes);
app.route('/api/announcements', announcementRoutes);
app.route('/api/incidents', incidentRoutes);
app.route('/api/feeds', feedRoutes);
app.route('/api/blocked-ips', blockedIpRoutes);
app.route('/api/intel', intelRoutes);
app.route('/api/auth', authRoutes);
app.route('/api/ip', ipRoutes);
app.route('/api/url', urlRoutes);

const PORT = parseInt(process.env.PORT || '3000');
console.log(`Server is running on http://localhost:${PORT}`);

export default {
  port: PORT,
  fetch: app.fetch,
};
