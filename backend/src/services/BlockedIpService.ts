import { BlockedIpRepository } from '../repositories/BlockedIpRepository';
import type { BlockedIp } from '../types/blockedIp';

export class BlockedIpService {
  private blockedIpRepo: BlockedIpRepository;

  constructor() {
    this.blockedIpRepo = new BlockedIpRepository();
  }

  async getAllBlockedIps(): Promise<BlockedIp[]> {
    return await this.blockedIpRepo.findAll();
  }

  async createBlockedIp(blockedIp: Omit<BlockedIp, 'id' | 'created_at'>): Promise<BlockedIp> {
    return await this.blockedIpRepo.insert(blockedIp);
  }
}
