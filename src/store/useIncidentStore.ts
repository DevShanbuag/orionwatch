import { create } from 'zustand';

type Severity = 'Critical' | 'High' | 'Medium' | 'Low';
type Status = 'Open' | 'Investigating' | 'Resolved' | 'Closed';

export interface Incident {
  id: string;
  title: string;
  severity: Severity;
  description: string;
  status: Status;
  created_at: string;
}

interface IncidentStats {
  total_incidents: number;
  open_incidents: number;
  resolved_today: number;
  critical_incidents: number;
}

interface IncidentStore {
  incidents: Incident[];
  stats: IncidentStats;
  isLoading: boolean;
  error: string | null;
  selectedIncident: Incident | null;
  fetchIncidents: () => Promise<void>;
  fetchStats: () => Promise<void>;
  createIncident: (incident: Omit<Incident, 'id' | 'created_at'>) => Promise<void>;
  updateIncident: (id: string, incident: Partial<Omit<Incident, 'id' | 'created_at'>>) => Promise<void>;
  deleteIncident: (id: string) => Promise<void>;
  setSelectedIncident: (incident: Incident | null) => void;
}

// Mock data in case backend not configured
const mockIncidents: Incident[] = [
  {
    id: '1',
    title: 'Unauthorized access attempt detected',
    severity: 'High',
    description: 'Multiple failed login attempts from IP 192.168.1.45',
    status: 'Investigating',
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: '2',
    title: 'Database connection timeout',
    severity: 'Medium',
    description: 'Intermittent timeouts connecting to primary database',
    status: 'Resolved',
    created_at: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: '3',
    title: 'Critical security patch required',
    severity: 'Critical',
    description: 'CVE-2024-XXXX affects our web servers',
    status: 'Open',
    created_at: new Date(Date.now() - 10800000).toISOString()
  },
  {
    id: '4',
    title: 'API rate limit exceeded',
    severity: 'Low',
    description: 'External API reached rate limit for the hour',
    status: 'Closed',
    created_at: new Date(Date.now() - 14400000).toISOString()
  }
];

const defaultStats: IncidentStats = {
  total_incidents: 42,
  open_incidents: 12,
  resolved_today: 8,
  critical_incidents: 3
};

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const useIncidentStore = create<IncidentStore>((set, _get) => ({
  incidents: mockIncidents,
  stats: defaultStats,
  isLoading: false,
  error: null,
  selectedIncident: null,

  fetchIncidents: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/incidents`);
      if (response.ok) {
        const { data } = await response.json();
        set({ incidents: data || mockIncidents, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  fetchStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/incidents/stats`);
      if (response.ok) {
        const { data } = await response.json();
        set({ stats: data || defaultStats });
      }
    } catch {
      // fall back to mock data
    }
  },

  createIncident: async (incident) => {
    try {
      const response = await fetch(`${API_BASE_URL}/incidents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incident)
      });
      if (response.ok) {
        const { data } = await response.json();
        set((state) => ({ incidents: [data, ...state.incidents] }));
      }
    } catch (error) {
      console.error('Failed to create incident:', error);
    }
  },

  updateIncident: async (id, incident) => {
    try {
      const response = await fetch(`${API_BASE_URL}/incidents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incident)
      });
      if (response.ok) {
        const { data } = await response.json();
        set((state) => ({
          incidents: state.incidents.map((i) => i.id === id ? data : i),
          selectedIncident: state.selectedIncident?.id === id ? data : state.selectedIncident
        }));
      }
    } catch (error) {
      console.error('Failed to update incident:', error);
    }
  },

  deleteIncident: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/incidents/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        set((state) => ({
          incidents: state.incidents.filter((i) => i.id !== id),
          selectedIncident: state.selectedIncident?.id === id ? null : state.selectedIncident
        }));
      }
    } catch (error) {
      console.error('Failed to delete incident:', error);
    }
  },

  setSelectedIncident: (incident) => set({ selectedIncident: incident })
}));
