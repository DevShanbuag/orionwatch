import { supabase } from '../config/database';
import type { BlockedIp } from '../types/blockedIp';

const mockBlockedIps: BlockedIp[] = [
  { id: '1', ip_address: '192.168.1.100', reason: 'Brute force attack', blocked_at: new Date(Date.now() - 3600000).toISOString(), created_at: new Date().toISOString() },
  { id: '2', ip_address: '10.0.0.5', reason: 'Malicious traffic detected', blocked_at: new Date(Date.now() - 7200000).toISOString(), expires_at: new Date(Date.now() + 2592000000).toISOString(), created_at: new Date().toISOString() },
  { id: '3', ip_address: '172.16.0.20', reason: 'Port scanning', blocked_at: new Date(Date.now() - 10800000).toISOString(), created_at: new Date().toISOString() },
  { id: '4', ip_address: '2001:db8::1', reason: 'IPv6 brute force attempt', blocked_at: new Date(Date.now() - 1800000).toISOString(), created_at: new Date().toISOString() },
  { id: '5', ip_address: 'fe80::1ff:fe23:4567:890a', reason: 'IPv6 port scanning', blocked_at: new Date(Date.now() - 5400000).toISOString(), expires_at: new Date(Date.now() + 604800000).toISOString(), created_at: new Date().toISOString() },
];

export class BlockedIpRepository {
  async findAll(): Promise<BlockedIp[]> {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      return mockBlockedIps;
    }
    try {
      const { data, error } = await supabase
        .from('blocked_ips')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as BlockedIp[];
    } catch {
      return mockBlockedIps;
    }
  }

  async insert(blockedIp: Omit<BlockedIp, 'id' | 'created_at'>): Promise<BlockedIp> {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      return { ...blockedIp, id: Date.now().toString(), created_at: new Date().toISOString() };
    }
    const { data, error } = await supabase
      .from('blocked_ips')
      .insert([blockedIp])
      .select('*')
      .single();
    if (error) throw error;
    return data as BlockedIp;
  }
}
