import { IncidentRepository } from '../repositories/IncidentRepository';
import { ThreatRepository } from '../repositories/ThreatRepository';
import { IncidentGenerator } from './correlation/incidentGenerator';
import type { Incident, IncidentStats } from '../types/incident';

export class IncidentService {
  private incidentRepo: IncidentRepository;
  private threatRepo: ThreatRepository;
  private incidentGenerator: IncidentGenerator;

  constructor() {
    this.incidentRepo = new IncidentRepository();
    this.threatRepo = new ThreatRepository();
    this.incidentGenerator = new IncidentGenerator();
  }

  async getAllIncidents(limit?: number): Promise<Incident[]> {
    return await this.incidentRepo.findAll(limit);
  }

  async getIncidentStats(): Promise<IncidentStats> {
    return await this.incidentRepo.getStats();
  }

  async createIncident(incident: Omit<Incident, 'id' | 'created_at'>): Promise<Incident> {
    return await this.incidentRepo.insert(incident);
  }

  async updateIncident(id: string, incident: Partial<Omit<Incident, 'id' | 'created_at'>>): Promise<Incident> {
    return await this.incidentRepo.update(id, incident);
  }

  async deleteIncident(id: string): Promise<void> {
    return await this.incidentRepo.delete(id);
  }

  async runCorrelation(): Promise<Incident[]> {
    const threats = await this.threatRepo.findAll(100);
    const generatedIncidents = this.incidentGenerator.processThreats(threats);
    const createdIncidents: Incident[] = [];
    for (const incident of generatedIncidents) {
      const created = await this.createIncident(incident);
      createdIncidents.push(created);
    }
    return createdIncidents;
  }
}
