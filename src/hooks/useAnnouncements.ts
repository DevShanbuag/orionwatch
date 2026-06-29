/**
 * React Query hooks for announcement data
 * 
 * Note: These hooks will not fetch real data until environment variables
 * are configured and Supabase is set up.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { announcementService } from '../services/announcement.service';
import type { Announcement, AnnouncementListParams } from '../types/announcement';
import { queryKeys } from '../utils/query-key.factory';

/**
 * Hook to fetch list of announcements
 */
export const useAnnouncements = (params?: AnnouncementListParams) => {
  return useQuery({
    queryKey: queryKeys.announcements.list(params?.filter),
    queryFn: () => announcementService.getAnnouncements(params),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch active announcements only
 */
export const useActiveAnnouncements = () => {
  return useQuery({
    queryKey: queryKeys.announcements.active(),
    queryFn: () => announcementService.getActiveAnnouncements(),
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};

/**
 * Hook to fetch a single announcement by ID
 */
export const useAnnouncement = (id: string) => {
  return useQuery({
    queryKey: queryKeys.announcements.detail(id),
    queryFn: () => announcementService.getAnnouncementById(id),
    enabled: !!id,
    staleTime: 60 * 1000, // 1 minute
  });
};

/**
 * Hook to fetch announcement statistics
 */
export const useAnnouncementStats = () => {
  return useQuery({
    queryKey: queryKeys.announcements.stats(),
    queryFn: () => announcementService.getAnnouncementStats(),
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};

/**
 * Hook to create a new announcement
 */
export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: announcementService.createAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.announcements.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.announcements.active() });
      queryClient.invalidateQueries({ queryKey: queryKeys.announcements.stats() });
    },
  });
};

/**
 * Hook to update an existing announcement
 */
export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Announcement> }) =>
      announcementService.updateAnnouncement(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.announcements.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.announcements.active() });
      queryClient.invalidateQueries({ queryKey: queryKeys.announcements.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.announcements.stats() });
    },
  });
};

/**
 * Hook to delete an announcement
 */
export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: announcementService.deleteAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.announcements.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.announcements.active() });
      queryClient.invalidateQueries({ queryKey: queryKeys.announcements.stats() });
    },
  });
};

/**
 * Hook to resolve an announcement
 */
export const useResolveAnnouncement = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: announcementService.resolveAnnouncement,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.announcements.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.announcements.active() });
      queryClient.invalidateQueries({ queryKey: queryKeys.announcements.detail(variables) });
      queryClient.invalidateQueries({ queryKey: queryKeys.announcements.stats() });
    },
  });
};

/**
 * Hook to bulk delete announcements
 */
export const useDeleteMultipleAnnouncements = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: announcementService.deleteMultipleAnnouncements,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.announcements.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.announcements.active() });
      queryClient.invalidateQueries({ queryKey: queryKeys.announcements.stats() });
    },
  });
};