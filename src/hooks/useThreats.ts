/**
 * React Query hooks for threat data
 * 
 * Note: These hooks will not fetch real data until environment variables
 * are configured and Supabase is set up.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { threatService } from '../services/threat.service';
import type { Threat, ThreatFilter, ThreatListParams } from '../types/threat';
import { queryKeys } from '../utils/query-key.factory';

/**
 * Hook to fetch list of threats
 */
export const useThreats = (params?: ThreatListParams) => {
  return useQuery({
    queryKey: queryKeys.threats.list(params?.filter),
    queryFn: () => threatService.getThreats(params),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch a single threat by ID
 */
export const useThreat = (id: string) => {
  return useQuery({
    queryKey: queryKeys.threats.detail(id),
    queryFn: () => threatService.getThreatById(id),
    enabled: !!id,
    staleTime: 60 * 1000, // 1 minute
  });
};

/**
 * Hook to fetch threat statistics
 */
export const useThreatStats = () => {
  return useQuery({
    queryKey: queryKeys.threats.stats(),
    queryFn: () => threatService.getThreatStats(),
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};

/**
 * Hook to create a new threat
 */
export const useCreateThreat = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: threatService.createThreat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.threats.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.threats.stats() });
    },
  });
};

/**
 * Hook to update an existing threat
 */
export const useUpdateThreat = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Threat> }) =>
      threatService.updateThreat(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.threats.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.threats.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.threats.stats() });
    },
  });
};

/**
 * Hook to delete a threat
 */
export const useDeleteThreat = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: threatService.deleteThreat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.threats.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.threats.stats() });
    },
  });
};

/**
 * Hook to bulk delete threats
 */
export const useDeleteMultipleThreats = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: threatService.deleteMultipleThreats,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.threats.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.threats.stats() });
    },
  });
};