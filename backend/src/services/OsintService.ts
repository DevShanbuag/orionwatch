import { OsintRepository } from '../repositories/OsintRepository';
import type { OsintLookupRequest, OsintLookupResult } from '../types/osint';

export class OsintService {
  private osintRepo: OsintRepository;

  constructor() {
    this.osintRepo = new OsintRepository();
  }

  async performLookup(request: OsintLookupRequest): Promise<OsintLookupResult> {
    return await this.osintRepo.lookup(request);
  }
}
