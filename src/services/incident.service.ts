/**
 * Incident service layer
 * 
 * Note: Service layer skeleton. Will not connect to database until
 * environment variables are configured and Supabase is set up.
 */

import { supabase } from '../lib/supabase';
import type {
  Incident,
  IncidentFilter,
  IncidentStats,
  IncidentListParams,
  CreateIncidentInput,
  UpdateIncidentInput,
} from '../types/incident';

export const incidentService = {
  /**
   * Get list of incidents with optional filtering
   */
  async getIncidents(params?: IncidentListParams): Promise<Incident[]> {
    try {
      let query = supabase.from('incidents').select('*');

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
    } catch (error) {
      console.warn('Incidents table not accessible, returning empty array');
      return [];
    }
  },

  /**
   * Get a single incident by ID
   */
  async getIncidentById(id: string): Promise<Incident> {
    try {
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      console.warn('Incident not accessible, returning empty object');
      return {} as Incident;
    }
  },

  /**
   * Get incident statistics
   */
  async getIncidentStats(): Promise<IncidentStats> {
    try {
      // This would typically call a Supabase RPC function
      const { data, error } = await supabase.rpc('get_incident_stats');

      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      console.warn('Incident stats not accessible, returning empty stats');
      return {
        total_incidents: 0,
        open_incidents: 0,
        resolved_today: 0,
        critical_incidents: 0,
      };
    }
  },

  /**
   * Create a new incident
   */
  async createIncident(input: CreateIncidentInput): Promise<Incident> {
    try {
      const { data, error } = await supabase
        .from('incidents')
        .insert(input)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      console.warn('Incident creation failed, returning empty object');
      return {} as Incident;
    }
  },

  /**
   * Update an existing incident
   */
  async updateIncident(id: string, updates: UpdateIncidentInput): Promise<Incident> {
    try {
      const { data, error } = await supabase
        .from('incidents')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      console.warn('Incident update failed, returning empty object');
      return {} as Incident;
    }
  },

  /**
   * Delete an incident
   */
  async deleteIncident(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('incidents')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);
    } catch (error) {
      console.warn('Incident deletion failed, continuing silently');
    }
  },

  /**
   * Bulk delete incidents
   */
  async deleteMultipleIncidents(ids: string[]): Promise<void> {
    try {
      const { error } = await supabase
        .from('incidents')
        .delete()
        .in('id', ids);

      if (error) throw new Error(error.message);
    } catch (error) {
      console.warn('Bulk incident deletion failed, continuing silently');
    }
  },
};