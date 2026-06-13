import { FeedRepository } from '../../repositories/FeedRepository';

export class FeedSyncWorker {
  private feedRepo: FeedRepository;

  constructor() {
    this.feedRepo = new FeedRepository();
  }

  async syncAllFeeds(): Promise<void> {
    const feeds = await this.feedRepo.findAll();
    for (const feed of feeds) {
      if (feed.is_active) {
        await this.syncFeed(feed.id);
      }
    }
  }

  async syncFeed(feedId: string): Promise<void> {
    // Stub for actual feed syncing
    console.log(`Syncing feed ${feedId}`);
  }
}
