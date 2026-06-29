/**
 * Feed-related types
 */

import type { PaginationParams, DateRange } from './common';

export interface Feed {
  id: string;
  name: string;
  url?: string;
  source_type: string;
  is_active: boolean;
  last_sync?: string;
  created_at: string;
  updated_at?: string;
}

export interface FeedStats {
  total_feeds: number;
  active_feeds: number;
  inactive_feeds: number;
  feeds_synced_today: number;
}

export interface FeedFilter {
  source_type?: string;
  is_active?: boolean;
  date_range?: DateRange;
  search?: string;
}

export interface FeedListParams extends PaginationParams {
  filter?: FeedFilter;
}

export interface CreateFeedInput {
  name: string;
  url?: string;
  source_type: string;
  is_active?: boolean;
}

export interface UpdateFeedInput {
  name?: string;
  url?: string;
  source_type?: string;
  is_active?: boolean;
}