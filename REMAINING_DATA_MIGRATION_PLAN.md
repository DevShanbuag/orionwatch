# OrionWatch Remaining Data Migration Plan

**Audit Date**: June 16, 2026  
**Phase 1 Status**: Completed (Overview Dashboard KPIs, Threat Feed, Threat Table, Service Health Summary)  
**Remaining Mock Data Sources**: 12 locations identified

## Executive Summary

Phase 1 successfully migrated the highest-priority user-visible components to React Query hooks with Supabase integration. However, significant mock data remains across the application. This document ranks remaining mock data sources by user impact, cybersecurity portfolio value, and migration difficulty to guide Phase 2 and Phase 3 implementation.

## Remaining Mock Data Sources - Ranked by Priority

### 🔴 CRITICAL PRIORITY (Immediate Impact)

#### 1. Incidents Page - Full Mock Data Store
**Location**: `src/pages/Incidents.tsx` + `src/store/useIncidentStore.ts`

| Aspect | Rating | Justification |
|--------|--------|---------------|
| **User Impact** | HIGH | Core incident management functionality completely mocked |
| **Cybersecurity Value** | HIGH | Incident tracking is fundamental to security operations |
| **Difficulty** | MEDIUM | React Query hooks already exist, just need component migration |
| **Lines of Code** | 167 lines (store) + component usage |
| **Database Dependencies** | incidents table |

**Mock Data Details**:
- `mockIncidents` array (4 hardcoded incident objects)
- `defaultStats` (hardcoded incident statistics)
- Hardcoded sparkline data arrays `[10, 15, 12, 18, 14, 20, 17]` etc.

**Migration Path**: 
1. Replace `useIncidentStore` with `useIncidents` and `useIncidentStats` hooks
2. Remove sparkline hardcoding or use Supabase RPC for historical data
3. Update metric cards to use real stats

---

#### 2. ThreatMap Component - Hardcoded Attack Visualization
**Location**: `src/components/dashboard/ThreatMap.tsx`

| Aspect | Rating | Justification |
|--------|--------|---------------|
| **User Impact** | HIGH | Prominent visual component with fake data |
| **Cybersecurity Value** | HIGH | Geospatial threat intelligence is key portfolio feature |
| **Difficulty** | HARD | Requires geolocation data, map integration, and real-time updates |
| **Lines of Code** | 288 lines |
| **Database Dependencies** | threats table with country/indicator fields |

**Mock Data Details**:
- `attackRoutes` array (10 hardcoded attack routes with coordinates)
- Hardcoded floating stats: 247 active attacks, 812 blocked, 19 critical
- Hardcoded country pulse dots and map animations

**Migration Path**:
1. Extract geolocation data from threats table country field
2. Implement Supabase geospatial queries or post-processing
3. Create aggregated stats from threat data
4. Replace hardcoded coordinates with real geolocation mapping
5. Consider real-time subscription for map updates

---

#### 3. AuthMonitoring Page - Complete Mock Authentication Data
**Location**: `src/pages/AuthMonitoring.tsx` + `src/store/useAuthStore.ts`

| Aspect | Rating | Justification |
|--------|--------|---------------|
| **User Impact** | HIGH | Authentication monitoring page completely fake |
| **Cybersecurity Value** | HIGH | Auth monitoring is critical for security operations |
| **Difficulty** | MEDIUM | Hooks exist but disabled, requires auth implementation |
| **Lines of Code** | 107 lines (page) + 21 lines (store) |
| **Database Dependencies** | auth_events table + Supabase Auth |

**Mock Data Details**:
- `loginAttempts` hardcoded array (6 time-based data points)
- Hardcoded passkey statistics: "72%"
- Hardcoded device activity: 65% desktop, 30% mobile, 5% tablet
- `mockAuthEvents` from mockData.ts (4 auth event objects)

**Migration Path**:
1. Enable authentication hooks (currently disabled)
2. Implement Supabase Auth integration
3. Replace hardcoded stats with auth analytics
4. Create auth_events table structure
5. Implement real-time auth event logging

---

### 🟡 HIGH PRIORITY (Significant Impact)

#### 4. ThreatChart Component - Historical Chart Data
**Location**: `src/components/dashboard/ThreatChart.tsx`

| Aspect | Rating | Justification |
|--------|--------|---------------|
| **User Impact** | MEDIUM | Secondary chart component, but prominently displayed |
| **Cybersecurity Value** | MEDIUM | Historical threat analysis is valuable but not critical |
| **Difficulty** | EASY | Already using threat data, just needs historical aggregation |
| **Lines of Code** | 178 lines |
| **Database Dependencies** | threats table + time-based aggregation |

**Mock Data Details**:
- `chartData` array (12 hardcoded data points showing 24-hour threat activity)
- Hardcoded time series data with totals, high severity, and blocked counts

**Migration Path**:
1. Create Supabase RPC function for time-based threat aggregation
2. Replace hardcoded chart data with RPC results
3. Implement time range filtering functionality
4. Add proper date handling for different time ranges

---

#### 5. IncidentPanel Component - Placeholder Status
**Location**: `src/components/dashboard/IncidentPanel.tsx`

| Aspect | Rating | Justification |
|--------|--------|---------------|
| **User Impact** | MEDIUM | Sidebar panel with placeholder message |
| **Cybersecurity Value** | MEDIUM | Incident panel is useful but currently non-functional |
| **Difficulty** | EASY | Component structure exists, just needs data connection |
| **Lines of Code** | 45 lines |
| **Database Dependencies** | incidents table |

**Mock Data Details**:
- "Awaiting Data Integration" placeholder message
- Hardcoded "STANDBY" status indicator
- No actual incident data displayed

**Migration Path**:
1. Connect to `useIncidents` hook for incident list
2. Implement incident filtering and sorting
3. Add real-time status updates
4. Replace placeholder with actual incident data

---

#### 6. OverviewDashboard - Live Feed Placeholder
**Location**: `src/pages/OverviewDashboard.tsx`

| Aspect | Rating | Justification |
|--------|--------|---------------|
| **User Impact** | MEDIUM | Main dashboard component with placeholder feed |
| **Cybersecurity Value** | MEDIUM | Real-time threat feed is valuable but charts are primary |
| **Difficulty** | HARD | Requires real-time subscriptions and feed infrastructure |
| **Lines of Code** | Component already updated, needs live feed data |
| **Database Dependencies** | threats table + real-time subscriptions |

**Mock Data Details**:
- `mockLiveFeed` array with placeholder "Awaiting Data Integration" message
- No real-time threat feed implementation

**Migration Path**:
1. Implement Supabase realtime subscription to threats table
2. Create feed item transformation logic
3. Add real-time UI updates with new threat events
4. Implement feed filtering and rate limiting

---

### 🟢 MEDIUM PRIORITY (Limited Impact)

#### 7. Legacy Zustand Stores - Complete Removal Required
**Location**: `src/store/useThreatStore.ts`, `src/store/useIncidentStore.ts`, `src/store/useServiceStore.ts`, `src/store/useAuthStore.ts`

| Aspect | Rating | Justification |
|--------|--------|---------------|
| **User Impact** | LOW | Stores are being replaced by React Query hooks |
| **Cybersecurity Value** | LOW | Infrastructure cleanup, no direct security value |
| **Difficulty** | EASY | Component-by-component migration already in progress |
| **Lines of Code** | ~360 lines total across 4 store files |
| **Database Dependencies** | None (infrastructure only) |

**Mock Data Details**:
- `useThreatStore`: mockThreats array + defaultStats (still used by some components)
- `useIncidentStore`: mockIncidents array + defaultStats (still used by Incidents page)
- `useServiceStore`: imports mockServices from mockData.ts (partially migrated)
- `useAuthStore`: imports mockAuthEvents from mockData.ts (still used by AuthMonitoring)

**Migration Path**:
1. Complete component migrations to React Query hooks
2. Remove store imports from remaining components
3. Delete store files after full migration
4. Update store index exports

---

#### 8. LiveFeed Component - Mock Data Generator
**Location**: `src/components/dashboard/LiveFeed.tsx`

| Aspect | Rating | Justification |
|--------|--------|---------------|
| **User Impact** | LOW | Testing utility, not used in production UI |
| **Cybersecurity Value** | LOW | Development/testing infrastructure only |
| **Difficulty** | EASY | Keep for testing, no migration needed |
| **Lines of Code** | 133 lines |
| **Database Dependencies** | None |

**Mock Data Details**:
- `generateMockLiveFeed()` function for testing (generates 10,000 random items)
- Random data generation for development/testing

**Migration Path**:
- **NO MIGRATION NEEDED** - Keep for testing purposes only
- Consider renaming to `generateMockLiveFeedForTesting.ts`
- Document as testing utility

---

### 🔵 LOW PRIORITY (Cosmetic)

#### 9. mockData.ts - Legacy Mock Data File
**Location**: `src/data/mockData.ts`

| Aspect | Rating | Justification |
|--------|--------|---------------|
| **User Impact** | LOW | Centralized mock file, components already migrated |
| **Cybersecurity Value** | LOW | No direct security value |
| **Difficulty** | EASY | Delete file after full store migration |
| **Lines of Code** | 56 lines |
| **Database Dependencies** | None |

**Mock Data Details**:
- `mockThreats` array (7 threat objects - old schema)
- `mockServices` array (5 service objects)
- `mockAuthEvents` array (4 auth event objects)

**Migration Path**:
- **NO MIGRATION NEEDED** - Delete after full store migration
- Safe to remove once all components use React Query hooks

---

#### 10. OverviewDashboard - Chart Placeholder
**Location**: `src/pages/OverviewDashboard.tsx`

| Aspect | Rating | Justification |
|--------|--------|---------------|
| **User Impact** | LOW | Single placeholder chart entry |
| **Cybersecurity Value** | LOW | Fallback when no data available |
| **Difficulty** | EASY | Already connected to useThreatStats hook |
| **Lines of Code** | 4 lines |
| **Database Dependencies** | threats table |

**Mock Data Details**:
- `chartData` array with single "Awaiting Data Integration" entry
- Serves as fallback when threatStatsData.threats_over_time is empty

**Migration Path**:
- **NO IMMEDIATE ACTION** - Serves as valid fallback
- Consider improving empty state message
- Already connected to real data via useThreatStats hook

---

## Migration Priority Ranking Summary

### By User Impact (Critical to Address First)

1. **Incidents Page** - Core functionality completely mocked
2. **ThreatMap Component** - Prominent visualization with fake data
3. **AuthMonitoring Page** - Authentication monitoring completely fake
4. **ThreatChart Component** - Historical data visualization
5. **IncidentPanel Component** - Sidebar placeholder
6. **OverviewDashboard Live Feed** - Main dashboard placeholder

### By Cybersecurity Portfolio Value

1. **ThreatMap Component** - Geospatial threat intelligence (key portfolio feature)
2. **Incidents Page** - Incident tracking (fundamental security operations)
3. **AuthMonitoring Page** - Authentication monitoring (critical for security)
4. **ThreatChart Component** - Historical threat analysis (valuable analytics)
5. **IncidentPanel Component** - Incident management (useful operational tool)

### By Implementation Difficulty

**EASY** (Quick wins):
- mockData.ts removal (delete file)
- IncidentPanel data connection
- Legacy Zustand store removal
- ThreatChart historical data

**MEDIUM** (Standard effort):
- Incidents page migration
- AuthMonitoring page migration
- OverviewDashboard live feed

**HARD** (Complex implementation):
- ThreatMap geospatial integration
- Real-time subscriptions for live feed
- Authentication implementation

## Recommended Phase 2 Implementation

### Sprint 1: Core Functionality (Week 1-2)
1. **Migrate Incidents Page** to useIncidents/useIncidentStats hooks
2. **Connect IncidentPanel** to real incident data
3. **Remove useIncidentStore** after migration

### Sprint 2: Authentication Foundation (Week 3-4)
1. **Enable authentication hooks** and implement Supabase Auth
2. **Migrate AuthMonitoring page** to use auth hooks
3. **Replace hardcoded auth statistics** with real analytics
4. **Remove useAuthStore** after migration

### Sprint 3: Advanced Visualizations (Week 5-6)
1. **Implement ThreatChart historical data** with Supabase RPC
2. **Begin ThreatMap geospatial integration** (Phase 2a)
3. **Implement OverviewDashboard live feed** (Phase 2b)

## Recommended Phase 3 Implementation

### Sprint 1: Real-time Features (Week 1-2)
1. **Complete ThreatMap integration** with real geolocation data
2. **Implement real-time subscriptions** for live feed
3. **Add real-time status updates** for incident panel

### Sprint 2: Cleanup & Optimization (Week 3-4)
1. **Remove all legacy Zustand stores** (useThreatStore, useServiceStore)
2. **Delete mockData.ts file**
3. **Clean up placeholder data** in components
4. **Add loading states** and error handling improvements

## Database Dependencies Summary

### Required Tables for Phase 2
- **incidents** (already defined in types, needs creation)
- **auth_events** (needs table creation and schema definition)
- **Supabase Auth integration** (requires auth configuration)

### Required Supabase RPC Functions
- **get_incident_stats** (for incident statistics)
- **get_threats_by_time_range** (for ThreatChart historical data)
- **get_auth_analytics** (for AuthMonitoring statistics)

### Required Geospatial Data
- **Country-to-coordinates mapping** (for ThreatMap integration)
- **IP geolocation service** (optional, can use country field from threats)

## Blockers and Dependencies

### Current Blockers
1. **Supabase Database Setup** - Tables not yet created in Supabase
2. **Authentication Configuration** - Supabase Auth not configured
3. **Geolocation Data** - No country-coordinate mapping available
4. **Real-time Permissions** - Supabase realtime not enabled

### Dependencies
1. **Database Schema Finalization** - Complete table definitions
2. **Supabase Project Setup** - Configure project and get credentials
3. **RPC Function Development** - Create required stored procedures
4. **Authentication Flow Design** - Define auth requirements and flows

## Risk Assessment

### High Risk Items
- **ThreatMap Integration**: Complex geospatial logic, requires external dependencies
- **Authentication Implementation**: Security-critical, requires careful testing
- **Real-time Subscriptions**: Performance implications, need proper error handling

### Medium Risk Items
- **Incidents Page Migration**: Component complexity, multiple interconnected features
- **AuthStatistics Generation**: Requires proper data modeling and aggregation

### Low Risk Items
- **Store Removal**: Straightforward cleanup, already prepared
- **File Cleanup**: mockData.ts removal is safe once migrations complete
- **Chart Data**: Non-critical fallback data, low impact if delayed

## Success Metrics for Phase 2

### Completion Criteria
- [ ] All user-facing components use React Query hooks
- [ ] No mock data visible in production UI
- [ ] Authentication functional for at least basic operations
- [ ] Real-time features working for live feed
- [ ] All legacy Zustand stores removed
- [ ] mockData.ts file deleted
- [ ] Build and test suite passing
- [ ] Performance metrics within acceptable ranges

### Quality Metrics
- **Data Freshness**: Real-time data < 5 seconds latency
- **Error Handling**: Graceful degradation when database unavailable
- **Type Safety**: 100% TypeScript coverage maintained
- **Code Quality**: No warnings, maintainable structure

## Conclusion

Phase 1 successfully established the foundation for Supabase integration by migrating the most critical user-facing components. Phase 2 should focus on completing the remaining high-impact components (Incidents, Auth, ThreatMap) while laying groundwork for authentication and real-time features. Phase 3 will complete the cleanup and optimization.

The ranking system prioritizes components based on user impact, cybersecurity portfolio value, and implementation complexity, ensuring the most valuable features are delivered first while managing technical risk effectively.