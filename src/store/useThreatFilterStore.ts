import { create } from 'zustand';
import type { ThreatFilter } from '../types/threat';
import type { Severity } from '../types/common';

interface ThreatFilterState {
  filter: ThreatFilter;
  setFilter: (filter: Partial<ThreatFilter>) => void;
  resetFilter: () => void;
  setSeverity: (severity: Severity | undefined) => void;
  setStatus: (status: string | undefined) => void;
  setThreatType: (threatType: string | undefined) => void;
  setCountry: (country: string | undefined) => void;
  setSearch: (search: string | undefined) => void;
  setDateRange: (dateRange: { start: string; end: string } | undefined) => void;
}

const defaultFilter: ThreatFilter = {};

export const useThreatFilterStore = create<ThreatFilterState>((set) => ({
  filter: defaultFilter,
  setFilter: (newFilter) => set((state) => ({ 
    filter: { ...state.filter, ...newFilter } 
  })),
  resetFilter: () => set({ filter: defaultFilter }),
  setSeverity: (severity) => set((state) => ({ 
    filter: { ...state.filter, severity } 
  })),
  setStatus: (status) => set((state) => ({ 
    filter: { ...state.filter, status } 
  })),
  setThreatType: (threatType) => set((state) => ({ 
    filter: { ...state.filter, threat_type: threatType } 
  })),
  setCountry: (country) => set((state) => ({ 
    filter: { ...state.filter, country } 
  })),
  setSearch: (search) => set((state) => ({ 
    filter: { ...state.filter, search } 
  })),
  setDateRange: (dateRange) => set((state) => ({ 
    filter: { ...state.filter, date_range: dateRange } 
  })),
}));
