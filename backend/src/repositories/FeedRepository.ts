import { supabase } from '../config/database';
import type { Feed } from '../types/feed';

const mockFeeds: Feed[] = [
  { id: '1', name: 'AbuseIPDB', url: 'https://api.abuseipdb.com', source_type: 'API', is_active: true, last_sync: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: '2', name: 'URLHaus', url: 'https://urlhaus.abuse.ch', source_type: 'API', is_active: true, last_sync: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: '3', name: 'OTX AlienVault', url: 'https://otx.alienvault.com', source_type: 'API', is_active: false, last_sync: new Date(Date.now() - 86400000).toISOString(), created_at: new Date().toISOString() },
  { id: '4', name: 'VirusTotal', url: 'https://www.virustotal.com', source_type: 'API', is_active: true, last_sync: new Date().toISOString(), created_at: new Date().toISOString() },
];

export class FeedRepository {
  async findAll(): Promise<Feed[]> {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      return mockFeeds;
    }
    try {
      const { data, error } = await supabase
        .from('feeds')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Feed[];
    } catch {
      return mockFeeds;
    }
  }

  async insert(feed: Omit<Feed, 'id' | 'created_at'>): Promise<Feed> {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      return { ...feed, id: Date.now().toString(), created_at: new Date().toISOString() };
    }
    const { data, error } = await supabase
      .from('feeds')
      .insert([feed])
      .select('*')
      .single();
    if (error) throw error;
    return data as Feed;
  }
}
