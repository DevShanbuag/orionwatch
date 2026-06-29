/**
 * Threat service layer
 * 
 * Note: Service layer skeleton. Will not connect to database until
 * environment variables are configured and Supabase is set up.
 */

import { supabase } from '../lib/supabase';
import type {
  Threat,
  ThreatFilter,
  ThreatStats,
  ThreatListParams,
  CreateThreatInput,
  UpdateThreatInput,
} from '../types/threat';

export const threatService = {
  /**
   * Get list of threats with optional filtering
   */
  async getThreats(params?: ThreatListParams): Promise<Threat[]> {
    try {
      let query = supabase.from('threats').select('*');

      // Apply filters
      if (params?.filter) {
        const filter = params.filter;
        if (filter.severity) {
          query = query.eq('severity', filter.severity);
        }
        if (filter.threat_type) {
          query = query.eq('threat_type', filter.threat_type);
        }
        if (filter.source) {
          query = query.eq('source', filter.source);
        }
        if (filter.country) {
          query = query.eq('country', filter.country);
        }
        if (filter.status) {
          query = query.eq('status', filter.status);
        }
        if (filter.search) {
          query = query.or(`indicator.ilike.%${filter.search}%,threat_type.ilike.%${filter.search}%`);
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
    } catch (error) {
      // Return empty array if table doesn't exist or Supabase not configured
      console.warn('Threats table not accessible, returning empty array');
      return [];
    }
  },

  /**
   * Get a single threat by ID
   */
  async getThreatById(id: string): Promise<Threat> {
    const { data, error } = await supabase
      .from('threats')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Get threat statistics
   */
  async getThreatStats(): Promise<ThreatStats> {
    try {
      // This would typically call a Supabase RPC function
      // For now, use a basic count query as fallback
      const { count: total_threats } = await supabase
        .from('threats')
        .select('*', { count: 'exact', head: true });

      const { count: high_severity } = await supabase
        .from('threats')
        .select('*', { count: 'exact', head: true })
        .in('severity', ['Critical', 'High']);

      return {
        total_threats: total_threats || 0,
        active_feeds: 0,
        ips_blocked: 0,
        high_risk_alerts: high_severity || 0,
        threats_over_time: [],
      };
    } catch (error) {
      // Return empty stats if table doesn't exist or Supabase not configured
      console.warn('Threats table not accessible, returning empty stats');
      return {
        total_threats: 0,
        active_feeds: 0,
        ips_blocked: 0,
        high_risk_alerts: 0,
        threats_over_time: [],
      };
    }
  },

  /**
   * Create a new threat
   */
  async createThreat(input: CreateThreatInput): Promise<Threat> {
    const { data, error } = await supabase
      .from('threats')
      .insert(input)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Update an existing threat
   */
  async updateThreat(id: string, updates: UpdateThreatInput): Promise<Threat> {
    const { data, error } = await supabase
      .from('threats')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Delete a threat
   */
  async deleteThreat(id: string): Promise<void> {
    const { error } = await supabase
      .from('threats')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  /**
   * Bulk delete threats
   */
  async deleteMultipleThreats(ids: string[]): Promise<void> {
    const { error } = await supabase
      .from('threats')
      .delete()
      .in('id', ids);

    if (error) throw new Error(error.message);
  },
};