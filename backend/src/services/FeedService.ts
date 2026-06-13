import { FeedRepository } from '../repositories/FeedRepository';
import type { Feed } from '../types/feed';

export class FeedService {
  private feedRepo: FeedRepository;

  constructor() {
    this.feedRepo = new FeedRepository();
  }

  async getAllFeeds(): Promise<Feed[]> {
    return await this.feedRepo.findAll();
  }

  async createFeed(feed: Omit<Feed, 'id' | 'created_at'>): Promise<Feed> {
    return await this.feedRepo.insert(feed);
  }
}
