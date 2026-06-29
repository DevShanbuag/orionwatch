/**
 * React Query hooks for incident data
 * 
 * Note: These hooks will not fetch real data until environment variables
 * are configured and Supabase is set up.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { incidentService } from '../services/incident.service';
import type { Incident, IncidentListParams } from '../types/incident';
import { queryKeys } from '../utils/query-key.factory';

/**
 * Hook to fetch list of incidents
 */
export const useIncidents = (params?: IncidentListParams) => {
  return useQuery({
    queryKey: queryKeys.incidents.list(params?.filter),
    queryFn: () => incidentService.getIncidents(params),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch a single incident by ID
 */
export const useIncident = (id: string) => {
  return useQuery({
    queryKey: queryKeys.incidents.detail(id),
    queryFn: () => incidentService.getIncidentById(id),
    enabled: !!id,
    staleTime: 60 * 1000, // 1 minute
  });
};

/**
 * Hook to fetch incident statistics
 */
export const useIncidentStats = () => {
  return useQuery({
    queryKey: queryKeys.incidents.stats(),
    queryFn: () => incidentService.getIncidentStats(),
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};

/**
 * Hook to create a new incident
 */
export const useCreateIncident = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: incidentService.createIncident,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.incidents.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.incidents.stats() });
    },
  });
};

/**
 * Hook to update an existing incident
 */
export const useUpdateIncident = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Incident> }) =>
      incidentService.updateIncident(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.incidents.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.incidents.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.incidents.stats() });
    },
  });
};

/**
 * Hook to delete an incident
 */
export const useDeleteIncident = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: incidentService.deleteIncident,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.incidents.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.incidents.stats() });
    },
  });
};

/**
 * Hook to bulk delete incidents
 */
export const useDeleteMultipleIncidents = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: incidentService.deleteMultipleIncidents,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.incidents.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.incidents.stats() });
    },
  });
};