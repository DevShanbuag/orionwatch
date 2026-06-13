
import axios from 'axios';
import { threatCache } from './cache';

export class VirusTotalService {
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.VIRUSTOTAL_API_KEY;
  }

  async checkIP(ip: string): Promise<unknown> {
    const cacheKey = `virustotal:${ip}`;
    
    // Check cache first
    const cached = await threatCache.getCachedResponse(cacheKey);
    if (cached) {
      return cached;
    }

    // If no API key, return null
    if (!this.apiKey) {
      return null;
    }

    // Call VirusTotal API
    const response = await axios.get(`https://www.virustotal.com/api/v3/ip_addresses/${ip}`, {
      headers: { 'x-apikey': this.apiKey }
    });

    // Cache response
    await threatCache.setCachedResponse(cacheKey, 'VirusTotal', response.data);
    
    return response.data;
  }

  async checkURL(url: string): Promise<unknown> {
    const cacheKey = `virustotal:url:${url}`;
    
    // Check cache first
    const cached = await threatCache.getCachedResponse(cacheKey);
    if (cached) {
      return cached;
    }

    // If no API key, return null
    if (!this.apiKey) {
      return null;
    }

    // Call VirusTotal API to submit URL first
    const submitResponse = await axios.post('https://www.virustotal.com/api/v3/urls', {
      url: url
    }, {
      headers: { 'x-apikey': this.apiKey }
    });

    const analysisId = submitResponse.data.data.id;
    
    // Wait a bit and then get the report
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const reportResponse = await axios.get(`https://www.virustotal.com/api/v3/analyses/${analysisId}`, {
      headers: { 'x-apikey': this.apiKey }
    });

    // Cache response
    await threatCache.setCachedResponse(cacheKey, 'VirusTotal', reportResponse.data);
    
    return reportResponse.data;
  }
}

export const virusTotalService = new VirusTotalService();
