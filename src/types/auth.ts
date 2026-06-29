/**
 * Authentication-related types
 * 
 * Note: Authentication is not implemented yet. These types are placeholders
 * for future Supabase Auth integration.
 */

import type { PaginationParams, DateRange } from './common';

export type AuthMethod = 'Password' | 'Passkey' | '2FA';

export type AuthStatus = 'Success' | 'Failed' | 'Blocked';

export interface AuthEvent {
  id: string;
  username: string;
  device: string;
  ip: string;
  location: string;
  status: AuthStatus;
  timestamp: string;
  method: AuthMethod;
}

export interface AuthStats {
  total_events: number;
  successful_logins: number;
  failed_attempts: number;
  blocked_attempts: number;
}

export interface AuthFilter {
  username?: string;
  status?: AuthStatus;
  method?: AuthMethod;
  date_range?: DateRange;
  search?: string;
}

export interface AuthListParams extends PaginationParams {
  filter?: AuthFilter;
}

// Placeholder for future authentication types
export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  created_at: string;
}

export interface Session {
  user: UserProfile;
  access_token: string;
  refresh_token: string;
  expires_at: number;
}