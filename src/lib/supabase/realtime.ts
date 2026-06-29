/**
 * Supabase realtime subscription utilities
 * 
 * Note: Realtime subscriptions will not work until database is connected
 * and environment variables are configured.
 */

import { supabase } from './client';
import type { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Subscribe to threats table changes
 */
export const subscribeToThreats = (
  callback: (payload: any) => void
): RealtimeChannel => {
  return supabase
    .channel('threats-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'threats',
      },
      callback
    )
    .subscribe();
};

/**
 * Subscribe to incidents table changes
 */
export const subscribeToIncidents = (
  callback: (payload: any) => void
): RealtimeChannel => {
  return supabase
    .channel('incidents-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'incidents',
      },
      callback
    )
    .subscribe();
};

/**
 * Subscribe to feeds table changes
 */
export const subscribeToFeeds = (
  callback: (payload: any) => void
): RealtimeChannel => {
  return supabase
    .channel('feeds-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'feeds',
      },
      callback
    )
    .subscribe();
};

/**
 * Subscribe to services table changes
 */
export const subscribeToServices = (
  callback: (payload: any) => void
): RealtimeChannel => {
  return supabase
    .channel('services-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'services',
      },
      callback
    )
    .subscribe();
};

/**
 * Subscribe to announcements table changes
 */
export const subscribeToAnnouncements = (
  callback: (payload: any) => void
): RealtimeChannel => {
  return supabase
    .channel('announcements-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'announcements',
      },
      callback
    )
    .subscribe();
};

/**
 * Unsubscribe from a channel
 */
export const unsubscribe = (channel: RealtimeChannel) => {
  supabase.removeChannel(channel);
};