
import axios from 'axios';
import { threatCache } from './cache';

export class AbuseIPDBService {
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.ABUSEIPDB_API_KEY;
  }

  async checkIP(ip: string): Promise<unknown> {
    const cacheKey = `abuseipdb:${ip}`;
    
    // Check cache first
    const cached = await threatCache.getCachedResponse(cacheKey);
    if (cached) {
      return cached;
    }

    // If no API key, return null
    if (!this.apiKey) {
      return null;
    }

    // Call AbuseIPDB API
    const response = await axios.get('https://api.abuseipdb.com/api/v2/check', {
      params: { ipAddress: ip, maxAgeInDays: '90' },
      headers: { 'Key': this.apiKey, 'Accept': 'application/json' }
    });

    // Cache response
    await threatCache.setCachedResponse(cacheKey, 'AbuseIPDB', response.data);
    
    return response.data;
  }
}

export const abuseIPDBService = new AbuseIPDBService();
