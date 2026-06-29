/**
 * React Query hooks for feed data
 * 
 * Note: These hooks will not fetch real data until environment variables
 * are configured and Supabase is set up.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { feedService } from '../services/feed.service';
import type { Feed, FeedListParams } from '../types/feed';
import { queryKeys } from '../utils/query-key.factory';

/**
 * Hook to fetch list of feeds
 */
export const useFeeds = (params?: FeedListParams) => {
  return useQuery({
    queryKey: queryKeys.feeds.list(params?.filter),
    queryFn: () => feedService.getFeeds(params),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch a single feed by ID
 */
export const useFeed = (id: string) => {
  return useQuery({
    queryKey: queryKeys.feeds.detail(id),
    queryFn: () => feedService.getFeedById(id),
    enabled: !!id,
    staleTime: 60 * 1000, // 1 minute
  });
};

/**
 * Hook to fetch feed statistics
 */
export const useFeedStats = () => {
  return useQuery({
    queryKey: queryKeys.feeds.stats(),
    queryFn: () => feedService.getFeedStats(),
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};

/**
 * Hook to create a new feed
 */
export const useCreateFeed = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: feedService.createFeed,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.feeds.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.feeds.stats() });
    },
  });
};

/**
 * Hook to update an existing feed
 */
export const useUpdateFeed = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Feed> }) =>
      feedService.updateFeed(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.feeds.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.feeds.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.feeds.stats() });
    },
  });
};

/**
 * Hook to delete a feed
 */
export const useDeleteFeed = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: feedService.deleteFeed,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.feeds.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.feeds.stats() });
    },
  });
};

/**
 * Hook to sync a feed
 */
export const useSyncFeed = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: feedService.syncFeed,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.feeds.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.feeds.detail(variables) });
    },
  });
};

/**
 * Hook to bulk delete feeds
 */
export const useDeleteMultipleFeeds = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: feedService.deleteMultipleFeeds,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.feeds.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.feeds.stats() });
    },
  });
};