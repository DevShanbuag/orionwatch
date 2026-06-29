/**
 * Incident-related types
 */

import type { Severity, Status, PaginationParams, DateRange } from './common';

export type IncidentStatus = 'New' | 'Investigating' | 'Contained' | 'Resolved' | 'Closed';

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  status: IncidentStatus;
  source?: string;
  assigned_to?: string;
  created_at: string;
  updated_at?: string;
  resolved_at?: string;
  tags?: string[];
  affected_assets?: string[];
}

export interface IncidentStats {
  total_incidents: number;
  open_incidents: number;
  resolved_today: number;
  critical_incidents: number;
}

export interface IncidentFilter {
  severity?: Severity;
  status?: IncidentStatus;
  date_range?: DateRange;
  search?: string;
}

export interface IncidentListParams extends PaginationParams {
  filter?: IncidentFilter;
}

export interface CreateIncidentInput {
  title: string;
  description: string;
  severity: Severity;
  status?: IncidentStatus;
  source?: string;
  assigned_to?: string;
  tags?: string[];
  affected_assets?: string[];
}

export interface UpdateIncidentInput {
  title?: string;
  description?: string;
  severity?: Severity;
  status?: IncidentStatus;
  source?: string;
  assigned_to?: string;
  resolved_at?: string;
  tags?: string[];
  affected_assets?: string[];
}