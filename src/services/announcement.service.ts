/**
 * Announcement service layer
 * 
 * Note: Service layer skeleton. Will not connect to database until
 * environment variables are configured and Supabase is set up.
 */

import { supabase } from '../lib/supabase';
import type {
  Announcement,
  AnnouncementFilter,
  AnnouncementStats,
  AnnouncementListParams,
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
} from '../types/announcement';

export const announcementService = {
  /**
   * Get list of announcements with optional filtering
   */
  async getAnnouncements(params?: AnnouncementListParams): Promise<Announcement[]> {
    let query = supabase.from('announcements').select('*');

    // Apply filters
    if (params?.filter) {
      const filter = params.filter;
      if (filter.severity) {
        query = query.eq('severity', filter.severity);
      }
      if (filter.status) {
        query = query.eq('status', filter.status);
      }
      if (filter.search) {
        query = query.or(`title.ilike.%${filter.search}%,description.ilike.%${filter.search}%`);
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
   * Get a single announcement by ID
   */
  async getAnnouncementById(id: string): Promise<Announcement> {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Get active announcements only
   */
  async getActiveAnnouncements(): Promise<Announcement[]> {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('status', 'Active')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  /**
   * Get announcement statistics
   */
  async getAnnouncementStats(): Promise<AnnouncementStats> {
    // This would typically call a Supabase RPC function
    const { data, error } = await supabase.rpc('get_announcement_stats');

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Create a new announcement
   */
  async createAnnouncement(input: CreateAnnouncementInput): Promise<Announcement> {
    const { data, error } = await supabase
      .from('announcements')
      .insert(input)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Update an existing announcement
   */
  async updateAnnouncement(id: string, updates: UpdateAnnouncementInput): Promise<Announcement> {
    const { data, error } = await supabase
      .from('announcements')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Delete an announcement
   */
  async deleteAnnouncement(id: string): Promise<void> {
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  /**
   * Resolve an announcement
   */
  async resolveAnnouncement(id: string): Promise<Announcement> {
    const { data, error } = await supabase
      .from('announcements')
      .update({ status: 'Resolved', updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Bulk delete announcements
   */
  async deleteMultipleAnnouncements(ids: string[]): Promise<void> {
    const { error } = await supabase
      .from('announcements')
      .delete()
      .in('id', ids);

    if (error) throw new Error(error.message);
  },
};