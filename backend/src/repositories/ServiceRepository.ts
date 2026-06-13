import { supabase } from '../config/database';
import type { Service } from '../types/service';

const mockServices: Service[] = [
  { id: '1', name: 'AbuseIPDB', provider: 'AbuseIPDB', status: 'Operational', last_sync: new Date().toISOString() },
  { id: '2', name: 'VirusTotal', provider: 'VirusTotal', status: 'Operational', last_sync: new Date(Date.now() - 3600000).toISOString() },
  { id: '3', name: 'OTX AlienVault', provider: 'AlienVault', status: 'Degraded', last_sync: new Date(Date.now() - 7200000).toISOString() },
  { id: '4', name: 'URLhaus', provider: 'Abuse.ch', status: 'Operational', last_sync: new Date().toISOString() }
];

export class ServiceRepository {
  async findAll(): Promise<Service[]> {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      return mockServices;
    }
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name');

      if (error) throw error;
      
      if (!data || data.length === 0) {
        return mockServices;
      }
      
      return data as Service[];
    } catch {
      return mockServices;
    }
  }
}
