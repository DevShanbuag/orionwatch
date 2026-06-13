import { Hono } from 'hono';
import { AnnouncementService } from '../services/AnnouncementService';

const announcementRoutes = new Hono();
const announcementService = new AnnouncementService();

announcementRoutes.get('/', async (c) => {
  try {
    const announcements = await announcementService.getAllAnnouncements();
    return c.json({ success: true, data: announcements });
  } catch (error) {
    return c.json({ success: false, error: 'Failed to fetch announcements' }, 500);
  }
});

export { announcementRoutes };
