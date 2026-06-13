import type { Threat } from '../../types/threat';

export interface URLhausResponse {
  query_status?: string;
  results?: Array<{
    url: string;
    url_status: string;
    threat: string;
    tags: string[];
    last_online: string;
  }>;
}

export function normalizeURLhaus(data: URLhausResponse, url: string): Omit<Threat, 'id' | 'created_at'> {
  const threat = data.results?.[0];
  const severity = threat?.url_status === 'online' ? 'High' : 'Medium';
  return {
    source: 'URLhaus',
    indicator: url,
    threat_type: threat?.threat || 'Malicious URL',
    severity: severity,
    country: 'Unknown',
    confidence: 80,
    first_seen: threat?.last_online || new Date().toISOString(),
    last_seen: threat?.last_online || new Date().toISOString(),
    status: 'active'
  };
}
