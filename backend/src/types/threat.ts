export interface Threat {
  id: string;
  source: string;
  indicator: string;
  threat_type: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  country: string;
  confidence: number;
  first_seen: string;
  last_seen: string;
  status: string;
  created_at: string;
}

export interface ThreatStats {
  total_threats: number;
  active_feeds: number;
  ips_blocked: number;
  high_risk_alerts: number;
  threats_over_time: Array<{
    time: string;
    total: number;
    high: number;
    blocked: number;
  }>;
}
