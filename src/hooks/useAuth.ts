/**
 * React Query hooks for authentication
 * 
 * Note: Authentication is not implemented yet. These hooks are placeholders
 * for future Supabase Auth integration.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import type { AuthListParams } from '../types/auth';
import { queryKeys } from '../utils/query-key.factory';

/**
 * Hook to fetch list of auth events
 */
export const useAuthEvents = (params?: AuthListParams) => {
  return useQuery({
    queryKey: queryKeys.auth.events(params?.filter),
    queryFn: () => authService.getAuthEvents(params),
    enabled: false, // Disabled until auth is implemented
  });
};

/**
 * Hook to fetch auth statistics
 */
export const useAuthStats = () => {
  return useQuery({
    queryKey: queryKeys.auth.stats(),
    queryFn: () => authService.getAuthStats(),
    enabled: false, // Disabled until auth is implemented
  });
};

/**
 * Hook to sign in user
 */
export const useSignIn = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authService.signIn,
    enabled: false, // Disabled until auth is implemented
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.session });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
    },
  });
};

/**
 * Hook to sign out user
 */
export const useSignOut = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authService.signOut,
    enabled: false, // Disabled until auth is implemented
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.session });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
      queryClient.clear();
    },
  });
};

/**
 * Hook to get current session
 */
export const useSession = () => {
  return useQuery({
    queryKey: queryKeys.auth.session,
    queryFn: () => authService.getSession(),
    enabled: false, // Disabled until auth is implemented
  });
};

/**
 * Hook to get current user
 */
export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.auth.user,
    queryFn: () => authService.getCurrentUser(),
    enabled: false, // Disabled until auth is implemented
  });
};