import type { Threat } from '../../types/threat';

export interface OTXResponse {
  pulse_info?: {
    count: number;
    pulses?: Array<{ id: string; name: string; created: string; description: string }>;
  };
  passive_dns?: Array<{ hostname: string; address: string; first: string; last: string }>;
  reputation?: any;
}

export function normalizeOTX(indicator: string, data: OTXResponse): Omit<Threat, 'id' | 'created_at'> {
  const pulseCount = data.pulse_info?.count || 0;
  const severity = pulseCount > 10 ? 'Critical' :
    pulseCount > 5 ? 'High' :
    pulseCount > 1 ? 'Medium' : 'Low';

  return {
    source: 'OTX',
    indicator: indicator,
    threat_type: 'IOC from OTX',
    severity: severity,
    country: 'Unknown',
    confidence: pulseCount * 10,
    first_seen: new Date().toISOString(),
    last_seen: new Date().toISOString(),
    status: 'active'
  };
}
