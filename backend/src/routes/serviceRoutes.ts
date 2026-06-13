import { Hono } from 'hono';
import { ServiceService } from '../services/ServiceService';

const serviceRoutes = new Hono();
const serviceService = new ServiceService();

// GET /api/services
serviceRoutes.get('/', async (c) => {
  try {
    const services = await serviceService.getAllServices();
    return c.json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return c.json({
      success: false,
      message: 'Failed to fetch services'
    }, 500);
  }
});

export default serviceRoutes;
