
import axios from 'axios';
import { threatCache } from './cache';
import { getIpVersion } from '../validators/ip';

export class OTXService {
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.OTX_API_KEY;
  }

  async getGeneral(ip: string): Promise<unknown> {
    const cacheKey = `otx:${ip}`;
    
    // Check cache first
    const cached = await threatCache.getCachedResponse(cacheKey);
    if (cached) {
      return cached;
    }

    // If no API key, return null
    if (!this.apiKey) {
      return null;
    }

    const ipVersion = getIpVersion(ip);
    if (!ipVersion) {
      return null;
    }

    // Call OTX API
    const response = await axios.get(
      `https://otx.alienvault.com/api/v1/indicators/${ipVersion}/${ip}/general`,
      { headers: { 'X-OTX-API-KEY': this.apiKey } }
    );

    // Cache response
    await threatCache.setCachedResponse(cacheKey, 'OTX', response.data);
    
    return response.data;
  }

  async getPulseList(ip: string): Promise<unknown> {
    const cacheKey = `otx:pulses:${ip}`;
    
    // Check cache first
    const cached = await threatCache.getCachedResponse(cacheKey);
    if (cached) {
      return cached;
    }

    // If no API key, return null
    if (!this.apiKey) {
      return null;
    }

    const ipVersion = getIpVersion(ip);
    if (!ipVersion) {
      return null;
    }

    // Call OTX API
    const response = await axios.get(
      `https://otx.alienvault.com/api/v1/indicators/${ipVersion}/${ip}/general`,
      { headers: { 'X-OTX-API-KEY': this.apiKey } }
    );

    // Cache response
    await threatCache.setCachedResponse(cacheKey, 'OTX', response.data);
    
    return response.data;
  }
}

export const otxService = new OTXService();
