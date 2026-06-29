/**
 * React Query hooks for service health data
 * 
 * Note: These hooks will not fetch real data until environment variables
 * are configured and Supabase is set up.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceService } from '../services/service.service';
import type { Service, ServiceListParams } from '../types/service';
import { queryKeys } from '../utils/query-key.factory';

/**
 * Hook to fetch list of services
 */
export const useServices = (params?: ServiceListParams) => {
  return useQuery({
    queryKey: queryKeys.services.list(params?.filter),
    queryFn: () => serviceService.getServices(params),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for real-time status
  });
};

/**
 * Hook to fetch a single service by ID
 */
export const useService = (id: string) => {
  return useQuery({
    queryKey: queryKeys.services.detail(id),
    queryFn: () => serviceService.getServiceById(id),
    enabled: !!id,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for real-time status
  });
};

/**
 * Hook to fetch service statistics
 */
export const useServiceStats = () => {
  return useQuery({
    queryKey: queryKeys.services.stats(),
    queryFn: () => serviceService.getServiceStats(),
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};

/**
 * Hook to create a new service
 */
export const useCreateService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: serviceService.createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.services.stats() });
    },
  });
};

/**
 * Hook to update an existing service
 */
export const useUpdateService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Service> }) =>
      serviceService.updateService(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.services.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.services.stats() });
    },
  });
};

/**
 * Hook to update service status
 */
export const useUpdateServiceStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'Operational' | 'Degraded' | 'Down' }) =>
      serviceService.updateServiceStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.services.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.services.stats() });
    },
  });
};

/**
 * Hook to delete a service
 */
export const useDeleteService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: serviceService.deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.services.stats() });
    },
  });
};

/**
 * Hook to bulk delete services
 */
export const useDeleteMultipleServices = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: serviceService.deleteMultipleServices,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.services.stats() });
    },
  });
};