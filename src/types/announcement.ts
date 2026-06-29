/**
 * Announcement-related types
 */

import type { Severity, PaginationParams, DateRange } from './common';

export type AnnouncementStatus = 'Active' | 'Resolved';

export interface Announcement {
  id: string;
  title: string;
  severity: Severity;
  description: string;
  status: AnnouncementStatus;
  created_at: string;
  updated_at?: string;
}

export interface AnnouncementStats {
  total_announcements: number;
  active_announcements: number;
  resolved_announcements: number;
  critical_announcements: number;
}

export interface AnnouncementFilter {
  severity?: Severity;
  status?: AnnouncementStatus;
  date_range?: DateRange;
  search?: string;
}

export interface AnnouncementListParams extends PaginationParams {
  filter?: AnnouncementFilter;
}

export interface CreateAnnouncementInput {
  title: string;
  severity: Severity;
  description: string;
  status?: AnnouncementStatus;
}

export interface UpdateAnnouncementInput {
  title?: string;
  severity?: Severity;
  description?: string;
  status?: AnnouncementStatus;
}