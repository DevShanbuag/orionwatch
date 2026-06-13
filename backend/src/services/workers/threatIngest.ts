import { ThreatRepository } from '../../repositories/ThreatRepository';
import { normalizeAbuseIPDB, type AbuseIPDBResponse } from '../ingestors/abuseipdb';
import { normalizeOTX, type OTXResponse } from '../ingestors/otx';
import { normalizeURLhaus, type URLhausResponse } from '../ingestors/urlhaus';
import axios from 'axios';
import type { Threat } from '../../types/threat';

export class ThreatIngestWorker {
  private threatRepo: ThreatRepository;

  constructor() {
    this.threatRepo = new ThreatRepository();
  }

  async ingestFromAbuseIPDB(ip: string): Promise<Threat> {
    const apiKey = process.env.ABUSEIPDB_API_KEY;
    if (!apiKey) throw new Error('ABUSEIPDB_API_KEY not set');

    const response = await axios.get('https://api.abuseipdb.com/api/v2/check', {
      params: { ipAddress: ip, maxAgeInDays: '90' },
      headers: { 'Key': apiKey, 'Accept': 'application/json' }
    });

    const normalized = normalizeAbuseIPDB((response.data as AbuseIPDBResponse).data);
    return await this.threatRepo.insert(normalized);
  }

  async ingestFromOTX(indicator: string): Promise<Threat> {
    const apiKey = process.env.OTX_API_KEY;
    if (!apiKey) throw new Error('OTX_API_KEY not set');

    const response = await axios.get(`https://otx.alienvault.com/api/v1/indicators/IPv4/${indicator}/general`, {
      headers: { 'X-OTX-API-KEY': apiKey }
    });

    const normalized = normalizeOTX(indicator, response.data as OTXResponse);
    return await this.threatRepo.insert(normalized);
  }

  async ingestFromURLhaus(url: string): Promise<Threat> {
    const response = await axios.post('https://urlhaus-api.abuse.ch/v1/url/',
      new URLSearchParams({ url }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const normalized = normalizeURLhaus(response.data as URLhausResponse, url);
    return await this.threatRepo.insert(normalized);
  }
}
