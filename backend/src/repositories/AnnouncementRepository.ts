import { supabase } from '../config/database';
import type { Announcement } from '../types/announcement';

const mockAnnouncements: Announcement[] = [
  { id: '1', title: 'High-volume DDoS activity detected', severity: 'High', description: 'We are observing elevated DDoS traffic targeting our edge locations. Mitigation measures are active.', status: 'Active', created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: '2', title: 'AbuseIPDB API rate limits temporarily exceeded', severity: 'Medium', description: 'Automated retry and backoff logic is handling this issue.', status: 'Resolved', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: '3', title: 'New threat intel feed available', severity: 'Low', description: 'Added support for the new OTX Pulse feed. Updated threat data will start flowing in shortly.', status: 'Active', created_at: new Date(Date.now() - 3600000).toISOString() }
];

export class AnnouncementRepository {
  async findAll(): Promise<Announcement[]> {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      return mockAnnouncements;
    }
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || mockAnnouncements;
    } catch {
      return mockAnnouncements;
    }
  }
}
