/**
 * React Query hooks module exports
 */

// Threat hooks
export {
  useThreats,
  useThreat,
  useThreatStats,
  useCreateThreat,
  useUpdateThreat,
  useDeleteThreat,
  useDeleteMultipleThreats,
} from './useThreats';

// Incident hooks
export {
  useIncidents,
  useIncident,
  useIncidentStats,
  useCreateIncident,
  useUpdateIncident,
  useDeleteIncident,
  useDeleteMultipleIncidents,
} from './useIncidents';

// Feed hooks
export {
  useFeeds,
  useFeed,
  useFeedStats,
  useCreateFeed,
  useUpdateFeed,
  useDeleteFeed,
  useSyncFeed,
  useDeleteMultipleFeeds,
} from './useFeeds';

// Service hooks
export {
  useServices,
  useService,
  useServiceStats,
  useCreateService,
  useUpdateService,
  useUpdateServiceStatus,
  useDeleteService,
  useDeleteMultipleServices,
} from './useServices';

// Announcement hooks
export {
  useAnnouncements,
  useActiveAnnouncements,
  useAnnouncement,
  useAnnouncementStats,
  useCreateAnnouncement,
  useUpdateAnnouncement,
  useDeleteAnnouncement,
  useResolveAnnouncement,
  useDeleteMultipleAnnouncements,
} from './useAnnouncements';

// Auth hooks
export {
  useAuthEvents,
  useAuthStats,
  useSignIn,
  useSignOut,
  useSession,
  useCurrentUser,
} from './useAuth';