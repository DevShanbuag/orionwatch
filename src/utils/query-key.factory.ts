/**
 * React Query key factory
 * 
 * Centralized query key management for cache invalidation and
 * consistent query key generation across the application.
 */

export const queryKeys = {
  threats: {
    all: ['threats'] as const,
    list: (filter?: any) => ['threats', 'list', filter] as const,
    detail: (id: string) => ['threats', 'detail', id] as const,
    stats: () => ['threats', 'stats'] as const,
  },
  incidents: {
    all: ['incidents'] as const,
    list: (filter?: any) => ['incidents', 'list', filter] as const,
    detail: (id: string) => ['incidents', 'detail', id] as const,
    stats: () => ['incidents', 'stats'] as const,
  },
  feeds: {
    all: ['feeds'] as const,
    list: (filter?: any) => ['feeds', 'list', filter] as const,
    detail: (id: string) => ['feeds', 'detail', id] as const,
    stats: () => ['feeds', 'stats'] as const,
  },
  services: {
    all: ['services'] as const,
    list: (filter?: any) => ['services', 'list', filter] as const,
    detail: (id: string) => ['services', 'detail', id] as const,
    stats: () => ['services', 'stats'] as const,
  },
  announcements: {
    all: ['announcements'] as const,
    list: (filter?: any) => ['announcements', 'list', filter] as const,
    detail: (id: string) => ['announcements', 'detail', id] as const,
    stats: () => ['announcements', 'stats'] as const,
    active: () => ['announcements', 'active'] as const,
  },
  auth: {
    session: ['auth', 'session'] as const,
    user: ['auth', 'user'] as const,
    events: (filter?: any) => ['auth', 'events', filter] as const,
    stats: () => ['auth', 'stats'] as const,
  },
};