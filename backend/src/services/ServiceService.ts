import { ServiceRepository } from '../repositories/ServiceRepository';
import type { Service } from '../types/service';

export class ServiceService {
  private serviceRepo: ServiceRepository;

  constructor() {
    this.serviceRepo = new ServiceRepository();
  }

  async getAllServices(): Promise<Service[]> {
    return await this.serviceRepo.findAll();
  }
}
