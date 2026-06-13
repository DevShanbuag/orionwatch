import axios from 'axios';
import { ThreatRepository } from '../repositories/ThreatRepository';
import type { Threat, ThreatStats } from '../types/threat';

export class ThreatService {
  private threatRepo: ThreatRepository;

  constructor() {
    this.threatRepo = new ThreatRepository();
  }

  async getAllThreats(limit?: number): Promise<Threat[]> {
    return await this.threatRepo.findAll(limit);
  }

  async getThreatStats(): Promise<ThreatStats> {
    return await this.threatRepo.getStats();
  }

  async analyzeIp(ip: string): Promise<Threat> {
    const apiKey = process.env.ABUSEIPDB_API_KEY;
    if (!apiKey) {
      throw new Error('ABUSEIPDB_API_KEY not set');
    }

    // Fetch from AbuseIPDB
    const response = await axios.get('https://api.abuseipdb.com/api/v2/check', {
      params: { ipAddress: ip, maxAgeInDays: 90, verbose: '' },
      headers: { 'Key': apiKey, 'Accept': 'application/json' }
    });
    const data = response.data.data;

    // Determine severity
    let severity: Threat['severity'] = 'Low';
    if (data.abuseConfidenceScore > 85) severity = 'Critical';
    else if (data.abuseConfidenceScore > 60) severity = 'High';
    else if (data.abuseConfidenceScore > 30) severity = 'Medium';

    // Get current time
    const now = new Date();
    const timeStr = now.toTimeString().slice(0, 8);

    // Create threat object
    const threatData: Omit<Threat, 'id' | 'created_at'> = {
      threat_type: data.reports.length > 0 
        ? `${data.reports[0].categories.join(', ')} (IP)` 
        : 'Malicious IP',
      indicator: ip,
      source: 'AbuseIPDB',
      severity: severity,
      country: `${data.city}, ${data.countryName || 'Unknown'}`,
      confidence: data.abuseConfidenceScore,
      first_seen: data.firstSeenAt ? new Date(data.firstSeenAt).toUTCString().slice(0, 25) : 'N/A',
      last_seen: data.lastReportedAt ? new Date(data.lastReportedAt).toUTCString().slice(0, 25) : 'N/A',
      status: 'Active'
    };

    // Insert into database and return
    return await this.threatRepo.insert(threatData);
  }
}
