/**
 * Threat-related types
 */

import type { Severity, PaginationParams, DateRange } from './common';

export interface Threat {
  id: string;
  source: string;
  indicator: string;
  threat_type: string;
  severity: Severity;
  country: string;
  confidence: number;
  first_seen: string;
  last_seen: string;
  status: string;
  created_at: string;
}

export interface ThreatTimeData {
  time: string;
  total: number;
  high: number;
  blocked: number;
}

export interface ThreatStats {
  total_threats: number;
  active_feeds: number;
  ips_blocked: number;
  high_risk_alerts: number;
  threats_over_time: ThreatTimeData[];
}

export interface ThreatFilter {
  severity?: Severity;
  threat_type?: string;
  source?: string;
  country?: string;
  status?: string;
  date_range?: DateRange;
  search?: string;
}

export interface ThreatListParams extends PaginationParams {
  filter?: ThreatFilter;
}

export interface CreateThreatInput {
  source: string;
  indicator: string;
  threat_type: string;
  severity: Severity;
  country: string;
  confidence: number;
  status?: string;
}

export interface UpdateThreatInput {
  severity?: Severity;
  status?: string;
  confidence?: number;
}