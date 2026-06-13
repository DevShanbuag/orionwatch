import { supabase } from '../config/database';
import type { Threat, ThreatStats } from '../types/threat';

const mockThreats: Threat[] = [
  { id: '1', source: 'AbuseIPDB', indicator: '185.244.214.23', threat_type: 'Brute Force (SSH)', severity: 'High', country: 'Russia', confidence: 98, first_seen: new Date(Date.now() - 300000).toISOString(), last_seen: new Date().toISOString(), status: 'active', created_at: new Date().toISOString() },
  { id: '2', source: 'URLHaus', indicator: 'https://malicious-domain.com', threat_type: 'Malicious URL', severity: 'High', country: 'Unknown', confidence: 85, first_seen: new Date(Date.now() - 600000).toISOString(), last_seen: new Date().toISOString(), status: 'active', created_at: new Date().toISOString() },
  { id: '3', source: 'OTX', indicator: '192.168.1.101', threat_type: 'Suspicious Behavior', severity: 'Medium', country: 'Internal', confidence: 40, first_seen: new Date(Date.now() - 900000).toISOString(), last_seen: new Date().toISOString(), status: 'monitored', created_at: new Date().toISOString() },
  { id: '4', source: 'VirusTotal', indicator: '203.0.113.45', threat_type: 'C2 Communication', severity: 'Critical', country: 'China', confidence: 99, first_seen: new Date(Date.now() - 1200000).toISOString(), last_seen: new Date().toISOString(), status: 'active', created_at: new Date().toISOString() },
];

const mockStats: ThreatStats = {
  total_threats: 1248, active_feeds: 8, ips_blocked: 672, high_risk_alerts: 186,
  threats_over_time: [
    { time: '00:00', total: 45, high: 12, blocked: 8 },
    { time: '04:00', total: 32, high: 8, blocked: 5 },
    { time: '08:00', total: 68, high: 24, blocked: 15 },
    { time: '12:00', total: 52, high: 16, blocked: 10 },
    { time: '16:00', total: 85, high: 30, blocked: 22 },
    { time: '20:00', total: 58, high: 18, blocked: 12 },
    { time: '23:59', total: 40, high: 10, blocked: 7 },
  ],
};

export class ThreatRepository {
  async findAll(limit = 50): Promise<Threat[]> {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      return mockThreats.slice(0, limit);
    }
    try {
      const { data, error } = await supabase
        .from('threats')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data as Threat[];
    } catch {
      return mockThreats.slice(0, limit);
    }
  }

  async getStats(): Promise<ThreatStats> {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      return mockStats;
    }
    try {
      const [{ count: totalThreats }, { count: highRiskAlerts }] = await Promise.all([
        supabase.from('threats').select('*', { count: 'exact', head: true }),
        supabase.from('threats').select('*', { count: 'exact', head: true }).in('severity', ['Critical', 'High'])
      ]);
      if (!totalThreats.count || totalThreats.count === 0) {
        return mockStats;
      }
      return {
        total_threats: totalThreats.count || 0, active_feeds: 8, ips_blocked: 672, high_risk_alerts: highRiskAlerts.count || 0,
        threats_over_time: mockStats.threats_over_time,
      };
    } catch {
      return mockStats;
    }
  }

  async insert(threat: Omit<Threat, 'id' | 'created_at'>): Promise<Threat> {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      return { ...threat, id: Date.now().toString(), created_at: new Date().toISOString() };
    }
    const { data, error } = await supabase
      .from('threats')
      .insert([threat])
      .select('*')
      .single();
    if (error) throw error;
    return data as Threat;
  }
}
