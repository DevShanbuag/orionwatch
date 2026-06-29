# OrionWatch Data Replacement Map

This document identifies all locations in the dashboard currently using mock data, hardcoded metrics, fake threat entries, placeholder charts, and demo statistics, along with their planned Supabase replacements.

## Dashboard Components

### 1. OverviewDashboard.tsx
**Location**: `src/pages/OverviewDashboard.tsx`

| Component | Current Mock Source | Future Supabase Source | Priority |
|-----------|-------------------|---------------------|----------|
| Metric Cards (Total Threats, Active Feeds, IPs Blocked, High Risk Alerts) | Hardcoded values `"--"` | `useThreatStats()` hook → `threatService.getThreatStats()` | HIGH |
| Threat Activity Chart | `chartData` array with single "Awaiting Data Integration" entry | `useThreatStats()` hook → `threatService.getThreatStats()` | HIGH |
| Live Feed | `mockLiveFeed` array with placeholder message | Real-time Supabase subscription via `subscribeToThreats()` | HIGH |
| Incident Panel | "Awaiting Data Integration" placeholder message | `useIncidents()` hook → `incidentService.getIncidents()` | MEDIUM |
| Timestamp Display | Hardcoded `"--:--:-- UTC"` | Real-time clock or server timestamp | LOW |

### 2. ThreatIntelligence.tsx
**Location**: `src/pages/ThreatIntelligence.tsx`

| Component | Current Mock Source | Future Supabase Source | Priority |
|-----------|-------------------|---------------------|----------|
| Threats List | `useThreatStore` → `mockThreats` array | `useThreats()` hook → `threatService.getThreats()` | HIGH |
| Threat Details Panel | `useThreatStore` selected threat | `useThreat()` hook → `threatService.getThreatById()` | HIGH |

### 3. Incidents.tsx
**Location**: `src/pages/Incidents.tsx`

| Component | Current Mock Source | Future Supabase Source | Priority |
|-----------|-------------------|---------------------|----------|
| Incident Stats (Total, Open, Resolved, Critical) | `useIncidentStore` → `defaultStats` | `useIncidentStats()` hook → `incidentService.getIncidentStats()` | HIGH |
| Incident List | `useIncidentStore` → `mockIncidents` array | `useIncidents()` hook → `incidentService.getIncidents()` | HIGH |
| Metric Card Sparklines | Hardcoded arrays `[10, 15, 12, 18, 14, 20, 17]` | Supabase RPC function for historical data | MEDIUM |
| Incident CRUD Operations | Mock fetch/create/update/delete functions | `useCreateIncident()`, `useUpdateIncident()`, `useDeleteIncident()` hooks | HIGH |

### 4. ServiceHealth.tsx
**Location**: `src/pages/ServiceHealth.tsx`

| Component | Current Mock Source | Future Supabase Source | Priority |
|-----------|-------------------|---------------------|----------|
| Service List | `useServiceStore` → `mockServices` from `mockData.ts` | `useServices()` hook → `serviceService.getServices()` | HIGH |
| Service Status Indicators | Mock status/uptime/latency values | Real-time Supabase subscription via `subscribeToServices()` | HIGH |
| Dependency Graph | Placeholder text "Dependency graph visualization placeholder" | Supabase relations or external visualization | LOW |

### 5. IPIntelligence.tsx
**Location**: `src/pages/IPIntelligence.tsx`

| Component | Current Mock Source | Future Supabase Source | Priority |
|-----------|-------------------|---------------------|----------|
| IP Search Results | Backend API call to `localhost:3000/api/ip/search` | Backend API with Supabase integration | HIGH |
| AbuseIPDB/OTX/Local Results | Backend API responses | Backend API with Supabase + external APIs | HIGH |
| Cache Status Badge | Backend API response | Backend API with cache layer | MEDIUM |

### 6. URLIntelligence.tsx
**Location**: `src/pages/URLIntelligence.tsx`

| Component | Current Mock Source | Future Supabase Source | Priority |
|-----------|-------------------|---------------------|----------|
| URL Search Results | Backend API call to `localhost:3000/api/url/search` | Backend API with Supabase integration | HIGH |
| URLhaus/VirusTotal Cards | Placeholder text "URL data will appear here" | Backend API with external integrations | HIGH |
| Cache Status Badge | Backend API response | Backend API with cache layer | MEDIUM |

### 7. AuthMonitoring.tsx
**Location**: `src/pages/AuthMonitoring.tsx`

| Component | Current Mock Source | Future Supabase Source | Priority |
|-----------|-------------------|---------------------|----------|
| Login Attempts Chart | `loginAttempts` hardcoded array | `useAuthStats()` hook → auth service aggregation | MEDIUM |
| Passkey Statistics | Hardcoded `"72%"` value | Supabase Auth analytics or RPC function | MEDIUM |
| Device Activity Stats | Hardcoded percentages (65%, 30%, 5%) | Supabase Auth device tracking | MEDIUM |
| Auth Events Table | `useAuthStore` → `mockAuthEvents` from `mockData.ts` | `useAuthEvents()` hook → `authService.getAuthEvents()` | HIGH |

## Dashboard Subcomponents

### 8. ThreatChart.tsx
**Location**: `src/components/dashboard/ThreatChart.tsx`

| Component | Current Mock Source | Future Supabase Source | Priority |
|-----------|-------------------|---------------------|----------|
| Threat Activity Chart | `chartData` hardcoded array (12 data points) | `useThreatStats()` hook → `threatService.getThreatStats()` | HIGH |
| Time Range Selector | Non-functional dropdown | Supabase date range filtering | MEDIUM |

### 9. ThreatFeedRow.tsx
**Location**: `src/components/dashboard/ThreatFeedRow.tsx`

| Component | Current Mock Source | Future Supabase Source | Priority |
|-----------|-------------------|---------------------|----------|
| Feed Row Display | Component receives data from parent | Real-time data via parent component | N/A |
| Severity Styling | Hardcoded color mapping | Same (configuration, not data) | N/A |

### 10. LiveFeed.tsx
**Location**: `src/components/dashboard/LiveFeed.tsx`

| Component | Current Mock Source | Future Supabase Source | Priority |
|-----------|-------------------|---------------------|----------|
| Virtualized Feed List | `generateMockLiveFeed()` function for testing | Real-time Supabase subscription via `subscribeToThreats()` | HIGH |
| Feed Items Generation | Random data generation (10,000 items) | Real threat events from database | HIGH |

### 11. IncidentPanel.tsx
**Location**: `src/components/dashboard/IncidentPanel.tsx`

| Component | Current Mock Source | Future Supabase Source | Priority |
|-----------|-------------------|---------------------|----------|
| Incident Panel Content | "Awaiting Data Integration" placeholder | `useIncidents()` hook → `incidentService.getIncidents()` | HIGH |
| Status Indicator | Hardcoded "STANDBY" status | Real-time status from Supabase | MEDIUM |

### 12. ThreatMap.tsx
**Location**: `src/components/dashboard/ThreatMap.tsx`

| Component | Current Mock Source | Future Supabase Source | Priority |
|-----------|-------------------|---------------------|----------|
| Attack Routes | `attackRoutes` hardcoded array (10 routes) | Real-time threat geolocation data from Supabase | HIGH |
| Floating Stats Cards | Hardcoded values (247 active, 812 blocked, 19 critical) | Aggregated stats from `threatService.getThreatStats()` | HIGH |
| Country Pulse Dots | Hardcoded country locations | Threat geolocation from Supabase `country` field | HIGH |
| Map Animation | SVG-based animation with hardcoded paths | Same visualization with real data | MEDIUM |

## Data Stores

### 13. useThreatStore.ts
**Location**: `src/store/useThreatStore.ts`

| Component | Current Mock Source | Future Supabase Source | Priority |
|-----------|-------------------|---------------------|----------|
| Threats Array | `mockThreats` (4 hardcoded threat objects) | Remove store, use `useThreats()` hook exclusively | HIGH |
| Threat Stats | `defaultStats` (hardcoded totals) | Remove store, use `useThreatStats()` hook exclusively | HIGH |
| Fetch Functions | Mock fetch with fallback to hardcoded data | Remove store, use React Query hooks | HIGH |
| Real-time Initialization | Empty function returning dummy unsubscribe | Supabase realtime subscription setup | HIGH |

### 14. useIncidentStore.ts
**Location**: `src/store/useIncidentStore.ts`

| Component | Current Mock Source | Future Supabase Source | Priority |
|-----------|-------------------|---------------------|----------|
| Incidents Array | `mockIncidents` (4 hardcoded incident objects) | Remove store, use `useIncidents()` hook exclusively | HIGH |
| Incident Stats | `defaultStats` (hardcoded totals) | Remove store, use `useIncidentStats()` hook exclusively | HIGH |
| CRUD Operations | Mock functions with backend API calls | Remove store, use React Query mutation hooks | HIGH |

### 15. useServiceStore.ts
**Location**: `src/store/useServiceStore.ts`

| Component | Current Mock Source | Future Supabase Source | Priority |
|-----------|-------------------|---------------------|----------|
| Services Array | `mockServices` from `mockData.ts` (5 services) | Remove store, use `useServices()` hook exclusively | HIGH |

### 16. useAuthStore.ts
**Location**: `src/store/useAuthStore.ts`

| Component | Current Mock Source | Future Supabase Source | Priority |
|-----------|-------------------|---------------------|----------|
| Auth Events Array | `mockAuthEvents` from `mockData.ts` (4 events) | Remove store, use `useAuthEvents()` hook exclusively | HIGH |

## Mock Data Files

### 17. mockData.ts
**Location**: `src/data/mockData.ts`

| Component | Current Mock Source | Future Supabase Source | Priority |
|-----------|-------------------|---------------------|----------|
| mockThreats | Array of 7 hardcoded threat objects | Remove entire file after migration | HIGH |
| mockServices | Array of 5 hardcoded service objects | Remove entire file after migration | HIGH |
| mockAuthEvents | Array of 4 hardcoded auth event objects | Remove entire file after migration | HIGH |

## Migration Priority Summary

### HIGH Priority (Core Dashboard Functionality)
- Remove all Zustand stores for server state (useThreatStore, useIncidentStore, useServiceStore, useAuthStore)
- Replace with React Query hooks throughout the application
- Connect OverviewDashboard metric cards to real data
- Implement real-time threat feed with Supabase subscriptions
- Connect ThreatIntelligence page to Supabase data
- Connect Incidents page to Supabase data
- Connect ServiceHealth page to Supabase data
- Implement ThreatMap with real geolocation data
- Remove mockData.ts file

### MEDIUM Priority (Enhanced Features)
- Implement historical data for sparklines and charts
- Add time range filtering functionality
- Connect AuthMonitoring statistics to real data
- Implement dependency graph visualization
- Enhance IP/URL intelligence with better cache status

### LOW Priority (Cosmetic/Optional)
- Real-time clock display
- Advanced map visualizations
- Enhanced analytics and reporting

## Implementation Notes

1. **Store Migration Strategy**: Phase out Zustand stores gradually. Start with useThreatStore, then useIncidentStore, then others.

2. **Real-time Subscriptions**: Implement Supabase realtime subscriptions for:
   - Threats table
   - Incidents table
   - Services table
   - Announcements table

3. **Error Handling**: Ensure graceful fallback to loading states when Supabase is not configured.

4. **Type Safety**: Maintain TypeScript type consistency between mock data and Supabase schemas.

5. **Performance**: Use React Query's caching and staleTime settings to optimize data fetching.

6. **Testing**: Keep mock data generation functions (like `generateMockLiveFeed`) for testing purposes only.

## Next Steps

1. Configure Supabase environment variables
2. Set up Supabase database tables matching the type definitions
3. Begin migration starting with threat-related components
4. Test real-time subscriptions
5. Remove mock data files after successful migration
6. Update documentation