# OrionWatch Frontend Data Architecture

## Overview

This document outlines the frontend data architecture for OrionWatch's Supabase integration. The architecture follows a layered approach that separates concerns and provides a clear path for data flow from the database to the UI components.

## Architecture Principles

1. **Separation of Concerns**: Each layer has a specific responsibility
2. **Single Source of Truth**: React Query manages server state, Zustand manages UI state
3. **Type Safety**: Full TypeScript coverage with shared types between backend and frontend
4. **Testability**: Each layer can be tested independently
5. **Performance**: Optimistic updates, caching, and efficient data fetching

## Directory Structure

```
src/
├── types/                    # TypeScript type definitions
│   ├── index.ts             # Central type exports
│   ├── threat.ts            # Threat-related types
│   ├── incident.ts          # Incident-related types
│   ├── feed.ts              # Feed-related types
│   ├── service.ts           # Service-related types
│   ├── announcement.ts      # Announcement-related types
│   ├── auth.ts              # Authentication-related types
│   └── common.ts            # Shared/common types
├── lib/
│   ├── supabase/            # Supabase client configuration
│   │   ├── client.ts        # Supabase client initialization
│   │   ├── auth.ts          # Supabase auth utilities
│   │   ├── realtime.ts      # Realtime subscription utilities
│   │   └── index.ts         # Supabase exports
│   └── react-query.ts       # React Query client configuration
├── services/                # Data service layer
│   ├── threat.service.ts    # Threat data operations
│   ├── incident.service.ts # Incident data operations
│   ├── feed.service.ts      # Feed data operations
│   ├── service.service.ts   # Service health operations
│   ├── announcement.service.ts # Announcement operations
│   ├── auth.service.ts      # Authentication operations
│   └── index.ts             # Service exports
├── hooks/                   # React Query hooks
│   ├── useThreats.ts        # Threat data hooks
│   ├── useIncidents.ts      # Incident data hooks
│   ├── useFeeds.ts          # Feed data hooks
│   ├── useServices.ts       # Service health hooks
│   ├── useAnnouncements.ts  # Announcement hooks
│   ├── useAuth.ts           # Authentication hooks
│   └── index.ts             # Hook exports
├── store/                   # Zustand stores (UI state only)
│   ├── useThemeStore.ts     # Theme management
│   ├── useUIStore.ts        # UI component state
│   ├── useFilterStore.ts    # Filter/query state
│   └── index.ts             # Store exports
└── utils/                   # Utility functions
    ├── query-key.factory.ts # React Query key factory
    ├── error-handler.ts     # Error handling utilities
    └── transformers.ts     # Data transformation utilities
```

## Layer Responsibilities

### 1. Types Layer (`src/types/`)

**Purpose**: Define TypeScript interfaces for all data structures

**Responsibilities**:
- Define interfaces matching Supabase table schemas
- Export shared types used across the application
- Provide type safety for all data operations

**Example Structure**:
```typescript
// src/types/threat.ts
export interface Threat {
  id: string;
  source: string;
  indicator: string;
  threat_type: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  country: string;
  confidence: number;
  first_seen: string;
  last_seen: string;
  status: string;
  created_at: string;
}

export interface ThreatStats {
  total_threats: number;
  active_feeds: number;
  ips_blocked: number;
  high_risk_alerts: number;
  threats_over_time: ThreatTimeData[];
}

export interface ThreatFilter {
  severity?: string;
  threat_type?: string;
  source?: string;
  date_range?: { start: string; end: string };
}
```

### 2. Supabase Client Layer (`src/lib/supabase/`)

**Purpose**: Configure and provide Supabase client and utilities

**Responsibilities**:
- Initialize Supabase client with environment variables
- Provide auth helpers (sign in, sign out, session management)
- Provide realtime subscription utilities
- Handle connection errors and retry logic

**Example Structure**:
```typescript
// src/lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// src/lib/supabase/realtime.ts
import { supabase } from './client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export const subscribeToThreats = (
  callback: (payload: any) => void
): RealtimeChannel => {
  return supabase
    .channel('threats-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'threats',
      },
      callback
    )
    .subscribe();
};
```

### 3. Service Layer (`src/services/`)

**Purpose**: Abstract all data operations from Supabase/Backend API

**Responsibilities**:
- Implement CRUD operations for each entity
- Handle data transformation between API and application
- Provide pagination and filtering logic
- Handle error responses consistently

**Design Pattern**: Repository Pattern

**Example Structure**:
```typescript
// src/services/threat.service.ts
import { supabase } from '../lib/supabase/client';
import type { Threat, ThreatFilter, ThreatStats } from '../types/threat';

export const threatService = {
  // Query operations
  async getThreats(filter?: ThreatFilter): Promise<Threat[]> {
    let query = supabase.from('threats').select('*');
    
    if (filter?.severity) {
      query = query.eq('severity', filter.severity);
    }
    if (filter?.threat_type) {
      query = query.eq('threat_type', filter.threat_type);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw new Error(error.message);
    return data || [];
  },

  async getThreatById(id: string): Promise<Threat> {
    const { data, error } = await supabase
      .from('threats')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  },

  async getThreatStats(): Promise<ThreatStats> {
    // Implementation for aggregated statistics
    const { data, error } = await supabase
      .rpc('get_threat_stats');
    
    if (error) throw new Error(error.message);
    return data;
  },

  // Mutation operations
  async createThreat(threat: Partial<Threat>): Promise<Threat> {
    const { data, error } = await supabase
      .from('threats')
      .insert(threat)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  },

  async updateThreat(id: string, updates: Partial<Threat>): Promise<Threat> {
    const { data, error } = await supabase
      .from('threats')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  },

  async deleteThreat(id: string): Promise<void> {
    const { error } = await supabase
      .from('threats')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(error.message);
  },
};
```

### 4. React Query Hooks Layer (`src/hooks/`)

**Purpose**: Provide React Query hooks for data fetching and mutations

**Responsibilities**:
- Wrap service layer calls in React Query hooks
- Manage caching, stale time, and refetch strategies
- Provide optimistic updates for mutations
- Handle loading and error states

**Example Structure**:
```typescript
// src/hooks/useThreats.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { threatService } from '../services/threat.service';
import type { Threat, ThreatFilter } from '../types/threat';
import { queryKeys } from '../utils/query-key.factory';

export const useThreats = (filter?: ThreatFilter) => {
  return useQuery({
    queryKey: queryKeys.threats.list(filter),
    queryFn: () => threatService.getThreats(filter),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useThreat = (id: string) => {
  return useQuery({
    queryKey: queryKeys.threats.detail(id),
    queryFn: () => threatService.getThreatById(id),
    enabled: !!id,
  });
};

export const useThreatStats = () => {
  return useQuery({
    queryKey: queryKeys.threats.stats(),
    queryFn: () => threatService.getThreatStats(),
    staleTime: 60 * 1000, // 1 minute
  });
};

export const useCreateThreat = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: threatService.createThreat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.threats.all });
    },
  });
};

export const useUpdateThreat = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Threat> }) =>
      threatService.updateThreat(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.threats.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.threats.detail(variables.id) });
    },
  });
};

export const useDeleteThreat = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: threatService.deleteThreat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.threats.all });
    },
  });
};
```

### 5. Query Key Factory (`src/utils/query-key.factory.ts`)

**Purpose**: Centralize React Query key management for cache invalidation

**Example Structure**:
```typescript
// src/utils/query-key.factory.ts
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
    list: () => ['feeds', 'list'] as const,
    detail: (id: string) => ['feeds', 'detail', id] as const,
  },
  services: {
    all: ['services'] as const,
    list: () => ['services', 'list'] as const,
  },
  announcements: {
    all: ['announcements'] as const,
    list: () => ['announcements', 'list'] as const,
    active: () => ['announcements', 'active'] as const,
  },
  auth: {
    session: ['auth', 'session'] as const,
    user: ['auth', 'user'] as const,
  },
};
```

### 6. State Management (`src/store/`)

**Purpose**: Manage UI-only state (not server state)

**Responsibilities**:
- Manage UI component state (modals, drawers, panels)
- Manage client-side filters and selections
- Manage theme and user preferences
- **NOT** for server state (use React Query for that)

**Example Structure**:
```typescript
// src/store/useUIStore.ts
import { create } from 'zustand';

interface UIStore {
  sidebarOpen: boolean;
  incidentPanelOpen: boolean;
  selectedThreatId: string | null;
  setSidebarOpen: (open: boolean) => void;
  setIncidentPanelOpen: (open: boolean) => void;
  setSelectedThreatId: (id: string | null) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  incidentPanelOpen: true,
  selectedThreatId: null,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setIncidentPanelOpen: (open) => set({ incidentPanelOpen: open }),
  setSelectedThreatId: (id) => set({ selectedThreatId: id }),
}));
```

## Data Flow

### Read Operations

```
Component → React Query Hook → Service Layer → Supabase Client → Database
              ↓ (cached data)
           Component renders
```

### Write Operations

```
Component → Mutation Hook → Service Layer → Supabase Client → Database
              ↓ (optimistic update)
           Component updates UI
              ↓ (invalidate queries)
           React Query refetches fresh data
```

### Real-time Updates

```
Supabase Realtime → Subscription Handler → Query Cache Invalidation → Component Re-render
```

## React Query Configuration

### Client Setup

```typescript
// src/lib/react-query.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 seconds
      gcTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});
```

### Provider Setup

```typescript
// src/main.tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/react-query';

// In App component or main.tsx
<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```

## Error Handling Strategy

### Service Layer Error Handling

```typescript
// src/utils/error-handler.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleSupabaseError = (error: any): ApiError => {
  if (error.code === 'PGRST116') {
    return new ApiError('Resource not found', 404);
  }
  if (error.code === '23505') {
    return new ApiError('Duplicate entry', 409);
  }
  return new ApiError(error.message || 'An error occurred', 500);
};
```

### React Query Error Callbacks

```typescript
// In hooks
export const useThreats = () => {
  return useQuery({
    queryKey: queryKeys.threats.list(),
    queryFn: threatService.getThreats,
    onError: (error) => {
      // Global error handling
      console.error('Failed to fetch threats:', error);
    },
  });
};
```

## Type Synchronization

### Backend-Frontend Type Sharing

**Option 1: Manual Synchronization**
- Maintain identical type definitions in both backend and frontend
- Use TypeScript interfaces that match database schemas

**Option 2: Generated Types**
- Use Supabase TypeScript generation
- Run: `supabase gen types typescript --linked > src/types/supabase.ts`

**Recommended Approach**: Start with manual synchronization, migrate to generated types once Supabase schema is stable.

## Migration Strategy

### Phase 1: Setup Architecture
1. Create directory structure
2. Define TypeScript types
3. Set up Supabase client utilities
4. Configure React Query

### Phase 2: Implement Services
1. Implement threat service
2. Implement incident service
3. Implement other services
4. Add comprehensive error handling

### Phase 3: Create Hooks
1. Replace existing fetch calls with React Query hooks
2. Implement mutation hooks
3. Add optimistic updates
4. Set up query invalidation strategies

### Phase 4: Refactor Stores
1. Move server state from Zustand to React Query
2. Keep only UI state in Zustand
3. Update components to use new hooks
4. Remove old API calls from stores

### Phase 5: Add Real-time
1. Implement Supabase realtime subscriptions
2. Set up automatic cache invalidation
3. Add real-time UI updates
4. Handle connection states

## Environment Variables

```env
# .env.example
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Best Practices

### Service Layer
- Always return typed data
- Throw errors for failures (don't swallow them)
- Keep functions pure and testable
- Use async/await consistently

### React Query
- Use descriptive query keys
- Set appropriate stale time for each query
- Implement optimistic updates for mutations
- Invalidate related queries after mutations

### Types
- Use strict typing (no `any`)
- Share types between backend and frontend
- Use discriminated unions for complex states
- Document complex types with JSDoc

### State Management
- Use React Query for server state
- Use Zustand for UI state only
- Avoid duplicating state between layers
- Keep state as close to where it's used as possible

## Testing Strategy

### Service Layer Tests
- Mock Supabase client
- Test success and error cases
- Test data transformation logic
- Test pagination and filtering

### Hook Tests
- Test with React Query testing utilities
- Test loading and error states
- Test cache invalidation
- Test optimistic updates

### Integration Tests
- Test real data flow from database to UI
- Test real-time subscriptions
- Test error boundaries
- Test retry logic

## Performance Optimization

### Query Optimization
- Use `select` to fetch only needed fields
- Implement pagination for large datasets
- Use React Query's `enabled` option for conditional queries
- Set appropriate stale time based on data volatility

### Bundle Size
- Code split hooks and services
- Use dynamic imports for large features
- Leverage React Query's tree-shaking support
- Minimize Supabase client imports

## Security Considerations

1. **Row Level Security (RLS)**: Enable RLS on all Supabase tables
2. **API Keys**: Never expose service role keys in frontend
3. **Authentication**: Use Supabase Auth for user management
4. **Data Validation**: Validate data on both client and server
5. **Error Messages**: Don't expose sensitive information in errors

## Next Steps

1. **Create Directory Structure**: Set up the folder structure outlined above
2. **Define Types**: Create TypeScript type definitions matching the database schema
3. **Implement Supabase Client**: Set up Supabase client with proper configuration
4. **Create Services**: Implement service layer for each entity
5. **Build Hooks**: Create React Query hooks wrapping the services
6. **Refactor Components**: Update components to use the new architecture
7. **Add Real-time**: Implement Supabase realtime subscriptions
8. **Testing**: Add comprehensive tests for each layer

## Conclusion

This architecture provides a solid foundation for Supabase integration in OrionWatch. By separating concerns and following React Query best practices, the application will be maintainable, performant, and scalable. The layered approach allows for easy testing and future enhancements while maintaining type safety throughout the application.