/**
 * Feed service layer
 * 
 * Note: Service layer skeleton. Will not connect to database until
 * environment variables are configured and Supabase is set up.
 */

import { supabase } from '../lib/supabase';
import type {
  Feed,
  FeedFilter,
  FeedStats,
  FeedListParams,
  CreateFeedInput,
  UpdateFeedInput,
} from '../types/feed';

export const feedService = {
  /**
   * Get list of feeds with optional filtering
   */
  async getFeeds(params?: FeedListParams): Promise<Feed[]> {
    let query = supabase.from('feeds').select('*');

    // Apply filters
    if (params?.filter) {
      const filter = params.filter;
      if (filter.source_type) {
        query = query.eq('source_type', filter.source_type);
      }
      if (filter.is_active !== undefined) {
        query = query.eq('is_active', filter.is_active);
      }
      if (filter.search) {
        query = query.or(`name.ilike.%${filter.search}%`);
      }
      if (filter.date_range) {
        query = query.gte('created_at', filter.date_range.start).lte('created_at', filter.date_range.end);
      }
    }

    // Apply pagination
    if (params?.limit) {
      query = query.limit(params.limit);
    }
    if (params?.offset) {
      query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  /**
   * Get a single feed by ID
   */
  async getFeedById(id: string): Promise<Feed> {
    const { data, error } = await supabase
      .from('feeds')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Get feed statistics
   */
  async getFeedStats(): Promise<FeedStats> {
    // This would typically call a Supabase RPC function
    const { data, error } = await supabase.rpc('get_feed_stats');

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Create a new feed
   */
  async createFeed(input: CreateFeedInput): Promise<Feed> {
    const { data, error } = await supabase
      .from('feeds')
      .insert(input)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Update an existing feed
   */
  async updateFeed(id: string, updates: UpdateFeedInput): Promise<Feed> {
    const { data, error } = await supabase
      .from('feeds')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Delete a feed
   */
  async deleteFeed(id: string): Promise<void> {
    const { error } = await supabase
      .from('feeds')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  /**
   * Sync a feed (trigger feed synchronization)
   */
  async syncFeed(id: string): Promise<Feed> {
    const { data, error } = await supabase
      .from('feeds')
      .update({ last_sync: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Bulk delete feeds
   */
  async deleteMultipleFeeds(ids: string[]): Promise<void> {
    const { error } = await supabase
      .from('feeds')
      .delete()
      .in('id', ids);

    if (error) throw new Error(error.message);
  },
};