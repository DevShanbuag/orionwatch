/**
 * Service health service layer
 * 
 * Note: Service layer skeleton. Will not connect to database until
 * environment variables are configured and Supabase is set up.
 */

import { supabase } from '../lib/supabase';
import type {
  Service,
  ServiceFilter,
  ServiceStats,
  ServiceListParams,
  CreateServiceInput,
  UpdateServiceInput,
} from '../types/service';

export const serviceService = {
  /**
   * Get list of services with optional filtering
   */
  async getServices(params?: ServiceListParams): Promise<Service[]> {
    try {
      let query = supabase.from('services').select('*');

      // Apply filters
      if (params?.filter) {
        const filter = params.filter;
        if (filter.provider) {
          query = query.eq('provider', filter.provider);
        }
        if (filter.status) {
          query = query.eq('status', filter.status);
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
    } catch (error) {
      // Return empty array if table doesn't exist or Supabase not configured
      console.warn('Services table not accessible, returning empty array');
      return [];
    }
  },

  /**
   * Get a single service by ID
   */
  async getServiceById(id: string): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Get service statistics
   */
  async getServiceStats(): Promise<ServiceStats> {
    try {
      const { data: services } = await supabase.from('services').select('*');

      if (!services) {
        return {
          total_services: 0,
          operational_services: 0,
          degraded_services: 0,
          down_services: 0,
        };
      }

      return {
        total_services: services.length,
        operational_services: services.filter((s) => s.status === 'Operational').length,
        degraded_services: services.filter((s) => s.status === 'Degraded').length,
        down_services: services.filter((s) => s.status === 'Down').length,
      };
    } catch (error) {
      // Return empty stats if table doesn't exist or Supabase not configured
      console.warn('Services table not accessible, returning empty stats');
      return {
        total_services: 0,
        operational_services: 0,
        degraded_services: 0,
        down_services: 0,
      };
    }
  },

  /**
   * Create a new service
   */
  async createService(input: CreateServiceInput): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .insert(input)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Update an existing service
   */
  async updateService(id: string, updates: UpdateServiceInput): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Delete a service
   */
  async deleteService(id: string): Promise<void> {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  /**
   * Update service status
   */
  async updateServiceStatus(id: string, status: 'Operational' | 'Degraded' | 'Down'): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .update({ status, last_sync: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Bulk delete services
   */
  async deleteMultipleServices(ids: string[]): Promise<void> {
    const { error } = await supabase
      .from('services')
      .delete()
      .in('id', ids);

    if (error) throw new Error(error.message);
  },
};