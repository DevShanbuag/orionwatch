import { create } from 'zustand';

type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

// Updated Threat interface to match new backend schema
export interface Threat {
  id: string;
  source: string;
  indicator: string;
  threat_type: string;
  severity: Severity;
  country: string;
  confidence: number;
  first_seen: string;
  last_seen: string;
  status: string;
  created_at: string;
}

interface ThreatStats {
  total_threats: number;
  active_feeds: number;
  ips_blocked: number;
  high_risk_alerts: number;
  threats_over_time: Array<{
    time: string;
    total: number;
    high: number;
    blocked: number;
  }>;
}

interface ThreatStore {
  threats: Threat[];
  stats: ThreatStats;
  isLoading: boolean;
  error: string | null;
  selectedThreat: Threat | null;
  initRealtime: () => () => void;
  fetchThreats: () => Promise<void>;
  fetchStats: () => Promise<void>;
  setSelectedThreat: (threat: Threat | null) => void;
}

// Mock data in case backend not configured
const mockThreats: Threat[] = [
  {
    id: '1',
    source: 'AbuseIPDB',
    indicator: '185.244.214.23',
    threat_type: 'Brute Force (SSH)',
    severity: 'High',
    country: 'Russia',
    confidence: 98,
    first_seen: new Date(Date.now() - 300000).toISOString(),
    last_seen: new Date().toISOString(),
    status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    source: 'URLHaus',
    indicator: 'https://malicious-domain.com',
    threat_type: 'Malicious URL',
    severity: 'High',
    country: 'Unknown',
    confidence: 85,
    first_seen: new Date(Date.now() - 600000).toISOString(),
    last_seen: new Date().toISOString(),
    status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    source: 'OTX',
    indicator: '192.168.1.101',
    threat_type: 'Suspicious Behavior',
    severity: 'Medium',
    country: 'Internal',
    confidence: 40,
    first_seen: new Date(Date.now() - 900000).toISOString(),
    last_seen: new Date().toISOString(),
    status: 'monitored',
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    source: 'VirusTotal',
    indicator: '203.0.113.45',
    threat_type: 'C2 Communication',
    severity: 'Critical',
    country: 'China',
    confidence: 99,
    first_seen: new Date(Date.now() - 1200000).toISOString(),
    last_seen: new Date().toISOString(),
    status: 'active',
    created_at: new Date().toISOString()
  }
];

const defaultStats: ThreatStats = {
  total_threats: 1248,
  active_feeds: 8,
  ips_blocked: 672,
  high_risk_alerts: 186,
  threats_over_time: [
    { time: '00:00', total: 45, high: 12, blocked: 8 },
    { time: '04:00', total: 32, high: 8, blocked: 5 },
    { time: '08:00', total: 68, high: 24, blocked: 15 },
    { time: '12:00', total: 52, high: 16, blocked: 10 },
    { time: '16:00', total: 85, high: 30, blocked: 22 },
    { time: '20:00', total: 58, high: 18, blocked: 12 },
    { time: '23:59', total: 40, high: 10, blocked: 7 }
  ]
};

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const useThreatStore = create<ThreatStore>((set, _get) => ({
  threats: mockThreats,
  stats: defaultStats,
  isLoading: false,
  error: null,
  selectedThreat: mockThreats[mockThreats.length - 1],

  fetchThreats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/threats`);
      if (response.ok) {
        const { data } = await response.json();
        set({ threats: data || mockThreats, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  fetchStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/threats/stats`);
      if (response.ok) {
        const { data } = await response.json();
        set({ stats: data || defaultStats });
      }
    } catch {
      // fall back to mock data
    }
  },

  setSelectedThreat: (threat) => set({ selectedThreat: threat }),

  initRealtime: () => {
    // For now, just return a dummy unsubscribe function
    return () => {};
  }
}));
