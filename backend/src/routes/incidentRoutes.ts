import { Hono } from 'hono';
import { IncidentService } from '../services/IncidentService';

const incidentRoutes = new Hono();
const incidentService = new IncidentService();

// GET /api/incidents
incidentRoutes.get('/', async (c) => {
  try {
    const limit = c.req.query('limit') ? parseInt(c.req.query('limit')!) : undefined;
    const incidents = await incidentService.getAllIncidents(limit);
    return c.json({
      success: true,
      data: incidents
    });
  } catch (error) {
    console.error('Error fetching incidents:', error);
    return c.json({
      success: false,
      message: 'Failed to fetch incidents'
    }, 500);
  }
});

// GET /api/incidents/stats
incidentRoutes.get('/stats', async (c) => {
  try {
    const stats = await incidentService.getIncidentStats();
    return c.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching incident stats:', error);
    return c.json({
      success: false,
      message: 'Failed to fetch incident stats'
    }, 500);
  }
});

// POST /api/incidents
incidentRoutes.post('/', async (c) => {
  try {
    const incident = await c.req.json();
    if (!incident.title || !incident.severity || !incident.description || !incident.status) {
      return c.json({ success: false, message: 'Missing required fields' }, 400);
    }
    const newIncident = await incidentService.createIncident(incident);
    return c.json({
      success: true,
      data: newIncident
    });
  } catch (error: any) {
    console.error('Error creating incident:', error);
    return c.json({
      success: false,
      message: error.message || 'Failed to create incident'
    }, 500);
  }
});

// PUT /api/incidents/:id
incidentRoutes.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const incident = await c.req.json();
    const updatedIncident = await incidentService.updateIncident(id, incident);
    return c.json({
      success: true,
      data: updatedIncident
    });
  } catch (error: any) {
    console.error('Error updating incident:', error);
    return c.json({
      success: false,
      message: error.message || 'Failed to update incident'
    }, 500);
  }
});

// DELETE /api/incidents/:id
incidentRoutes.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await incidentService.deleteIncident(id);
    return c.json({
      success: true,
      message: 'Incident deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting incident:', error);
    return c.json({
      success: false,
      message: error.message || 'Failed to delete incident'
    }, 500);
  }
});

// POST /api/incidents/correlate
incidentRoutes.post('/correlate', async (c) => {
  try {
    const generatedIncidents = await incidentService.runCorrelation();
    return c.json({
      success: true,
      data: generatedIncidents,
      count: generatedIncidents.length
    });
  } catch (error: any) {
    console.error('Error running correlation:', error);
    return c.json({
      success: false,
      message: error.message || 'Failed to run correlation'
    }, 500);
  }
});

export default incidentRoutes;
