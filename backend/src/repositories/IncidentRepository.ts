import { supabase } from '../config/database';
import type { Incident, IncidentStats } from '../types/incident';

const mockIncidents: Incident[] = [
  { id: '1', title: 'Unauthorized access attempt detected', severity: 'High', description: 'Multiple failed login attempts from IP 192.168.1.45', status: 'Investigating', created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: '2', title: 'Database connection timeout', severity: 'Medium', description: 'Intermittent timeouts connecting to primary database', status: 'Resolved', created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: '3', title: 'Critical security patch required', severity: 'Critical', description: 'CVE-2024-XXXX affects our web servers', status: 'Open', created_at: new Date(Date.now() - 10800000).toISOString() },
  { id: '4', title: 'API rate limit exceeded', severity: 'Low', description: 'External API reached rate limit for the hour', status: 'Closed', created_at: new Date(Date.now() - 14400000).toISOString() },
];

const mockStats: IncidentStats = {
  total_incidents: 42,
  open_incidents: 12,
  resolved_today: 8,
  critical_incidents: 3,
};

export class IncidentRepository {
  async findAll(limit = 50): Promise<Incident[]> {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      return mockIncidents.slice(0, limit);
    }
    try {
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data as Incident[];
    } catch {
      return mockIncidents.slice(0, limit);
    }
  }

  async getStats(): Promise<IncidentStats> {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      return mockStats;
    }
    try {
      const [{ count: totalIncidents }, { count: openIncidents }, { count: criticalIncidents }] = await Promise.all([
        supabase.from('incidents').select('*', { count: 'exact', head: true }),
        supabase.from('incidents').select('*', { count: 'exact', head: true }).eq('status', 'Open'),
        supabase.from('incidents').select('*', { count: 'exact', head: true }).eq('severity', 'Critical')
      ]);
      if (!totalIncidents.count || totalIncidents.count === 0) {
        return mockStats;
      }
      return {
        total_incidents: totalIncidents.count || 0,
        open_incidents: openIncidents.count || 0,
        resolved_today: 8,
        critical_incidents: criticalIncidents.count || 0,
      };
    } catch {
      return mockStats;
    }
  }

  async insert(incident: Omit<Incident, 'id' | 'created_at'>): Promise<Incident> {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      return { ...incident, id: Date.now().toString(), created_at: new Date().toISOString() };
    }
    const { data, error } = await supabase
      .from('incidents')
      .insert([incident])
      .select('*')
      .single();
    if (error) throw error;
    return data as Incident;
  }

  async update(id: string, incident: Partial<Omit<Incident, 'id' | 'created_at'>>): Promise<Incident> {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      const index = mockIncidents.findIndex(i => i.id === id);
      if (index !== -1) {
        mockIncidents[index] = { ...mockIncidents[index], ...incident };
        return mockIncidents[index];
      }
      throw new Error('Incident not found');
    }
    const { data, error } = await supabase
      .from('incidents')
      .update(incident)
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return data as Incident;
  }

  async delete(id: string): Promise<void> {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      const index = mockIncidents.findIndex(i => i.id === id);
      if (index !== -1) {
        mockIncidents.splice(index, 1);
      }
      return;
    }
    const { error } = await supabase
      .from('incidents')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
}
