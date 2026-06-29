/**
 * Service health-related types
 */

import type { PaginationParams, DateRange } from './common';

export type ServiceStatus = 'Operational' | 'Degraded' | 'Down';

export interface Service {
  id: string;
  name: string;
  provider: string;
  status: ServiceStatus;
  last_sync: string;
  created_at: string;
  updated_at?: string;
}

export interface ServiceStats {
  total_services: number;
  operational_services: number;
  degraded_services: number;
  down_services: number;
}

export interface ServiceFilter {
  provider?: string;
  status?: ServiceStatus;
  date_range?: DateRange;
  search?: string;
}

export interface ServiceListParams extends PaginationParams {
  filter?: ServiceFilter;
}

export interface CreateServiceInput {
  name: string;
  provider: string;
  status?: ServiceStatus;
}

export interface UpdateServiceInput {
  name?: string;
  provider?: string;
  status?: ServiceStatus;
}