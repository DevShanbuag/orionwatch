import { AnnouncementRepository } from '../repositories/AnnouncementRepository';
import type { Announcement } from '../types/announcement';

export class AnnouncementService {
  private announcementRepo: AnnouncementRepository;

  constructor() {
    this.announcementRepo = new AnnouncementRepository();
  }

  async getAllAnnouncements(): Promise<Announcement[]> {
    return await this.announcementRepo.findAll();
  }
}
