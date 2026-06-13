import { Hono } from 'hono';
import { FeedService } from '../services/FeedService';

const feedRoutes = new Hono();
const feedService = new FeedService();

// GET /api/feeds
feedRoutes.get('/', async (c) => {
  try {
    const feeds = await feedService.getAllFeeds();
    return c.json({
      success: true,
      data: feeds
    });
  } catch (error) {
    console.error('Error fetching feeds:', error);
    return c.json({
      success: false,
      message: 'Failed to fetch feeds'
    }, 500);
  }
});

// POST /api/feeds
feedRoutes.post('/', async (c) => {
  try {
    const feed = await c.req.json();
    if (!feed.name || !feed.source_type) {
      return c.json({ success: false, message: 'Name and source type are required' }, 400);
    }
    const newFeed = await feedService.createFeed(feed);
    return c.json({
      success: true,
      data: newFeed
    });
  } catch (error: any) {
    console.error('Error creating feed:', error);
    return c.json({
      success: false,
      message: error.message || 'Failed to create feed'
    }, 500);
  }
});

export default feedRoutes;
