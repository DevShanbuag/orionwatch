import React, { useState, useMemo, useCallback } from 'react';
import { Target, Shield, Globe, AlertTriangle, Search, Clock, Bell, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useThreatStats, useThreats } from '../hooks/useThreats';
import { useSelectedThreatStore } from '../store/useSelectedThreatStore';
import { useThreatFilterStore } from '../store/useThreatFilterStore';

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  change?: { value: string; positive: boolean };
  sparklineData?: number[];
  color: string;
}

const chartData = [
  { time: 'Awaiting Data Integration', total: null, high: null, blocked: null }
];

const mockLiveFeed = [
  {
    time: '--:--:--',
    ip: 'Awaiting Data Integration',
    type: 'Threat Feed',
    source: 'Data Source',
    severity: 'Info',
    details: {
      message: 'Connect threat intelligence APIs to populate live feed'
    }
  }
];

// Transform threat data for live feed display
const transformThreatToFeedItem = (threat: any) => ({
  time: new Date(threat.first_seen).toLocaleTimeString(),
  ip: threat.indicator,
  type: threat.threat_type,
  source: threat.source,
  severity: threat.severity,
  details: {
    message: `${threat.threat_type} from ${threat.source} in ${threat.country}`
  }
});

const MetricCard = React.memo<MetricCardProps>(({ icon, title, value, change, sparklineData, color }) => {
  const transformedSparklineData = useMemo(() => {
    if (!sparklineData) return null;
    return sparklineData.map((v: number, i: number) => ({ x: i, y: v }));
  }, [sparklineData]);

  return (
    <div className="enterprise-card p-4 flex flex-col justify-between" style={{ height: '120px' }}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="metric-icon-circle"
            style={{
              backgroundColor: `${color}10`,
              border: `1px solid ${color}30`,
            }}
          >
            {icon}
          </div>
          <div>
            <p className="text-label">{title}</p>
            <p className="text-[24px] font-bold leading-none tracking-tight mt-1 text-[var(--text-primary)]">{value}</p>
          </div>
        </div>
      </div>
      <div className="flex items-end justify-between gap-2">
        {change && (
          <div className={`text-[12px] font-semibold ${change.positive ? 'text-[var(--color-success)]' : 'text-[var(--color-critical)]'}`}>
            {change.value}
          </div>
        )}
        {transformedSparklineData && (
          <div className="flex-1" style={{ height: '24px', color, maxWidth: '120px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={transformedSparklineData}>
                <Line
                  type="monotone"
                  dataKey="y"
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
});

interface CustomTooltipProps {
  active?: boolean;
  payload?: unknown[];
  label?: string;
}

const CustomTooltip = React.memo(({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && Array.isArray(payload) && payload.length > 0) {
    return (
      <div className="enterprise-card p-3 border border-[var(--border-primary)]">
        <p className="text-[var(--text-secondary)] text-[12px] mb-2">{label}</p>
        {payload.map((entry: unknown, index: number) => {
          const typedEntry = entry as { color?: string; name?: string; value?: unknown };
          return (
            <div key={index} className="flex items-center gap-2 text-[12px]">
              <div
                className="w-2 h-2 rounded-none"
                style={{ backgroundColor: typedEntry.color }}
              />
              <span className="text-[var(--text-tertiary)]">{typedEntry.name}:</span>
              <span className="text-[var(--text-primary)] font-semibold">{typedEntry.value as string | number}</span>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
});

const IncidentPanel = () => (
  <div style={{ width: '320px', height: '100vh' }} className="incident-panel overflow-y-auto">
    <div className="p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-none bg-[var(--color-critical-bg)] border border-[var(--color-critical-border)]">
            <AlertTriangle className="w-4 h-4 text-[var(--color-critical)]" />
          </div>
          <div>
            <h2 className="text-[14px] font-bold text-[var(--text-primary)]">Incident Panel</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-none status-dot status-offline" />
              <span className="text-[11px] font-semibold text-[var(--color-tertiary)] uppercase tracking-[0.05em]">STANDBY</span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-[var(--border-primary)] mb-4" />

      {/* Message */}
      <div className="enterprise-card p-4">
        <p className="text-[13px] text-[var(--text-secondary)] text-center">
          Awaiting Data Integration
        </p>
        <p className="text-[11px] text-[var(--text-tertiary)] text-center mt-2">
          Connect threat intelligence sources to populate incident panel
        </p>
      </div>
    </div>
  </div>
);

const OverviewDashboard = () => {
  const [showBlocked, setShowBlocked] = useState(true);
  const [showHighSeverity, setShowHighSeverity] = useState(true);
  const [timeRange, setTimeRange] = useState('Last 24 Hours');
  const [currentTime, setCurrentTime] = useState('');
  const selectedThreatRef = React.useRef<HTMLDivElement>(null);
  const { data: threatStatsData, isLoading: statsLoading } = useThreatStats();
  const { data: threats = [], isLoading: threatsLoading } = useThreats({ limit: 10 });
  const { selectedThreat, setSelectedThreat } = useSelectedThreatStore();
  const { filter, setSeverity, setStatus, setThreatType, setCountry, setSearch, resetFilter } = useThreatFilterStore();

  // Update current time
  React.useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toISOString().slice(11, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Scroll selected threat into view
  React.useEffect(() => {
    if (selectedThreat && selectedThreatRef.current) {
      selectedThreatRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedThreat]);

  const handleThreatClick = useCallback((threat: any) => {
    setSelectedThreat(threat);
  }, [setSelectedThreat]);

  const handleSeverityChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSeverity(value === 'all' ? undefined : value as any);
  }, [setSeverity]);

  const handleStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setStatus(value === 'all' ? undefined : value);
  }, [setStatus]);

  const handleThreatTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setThreatType(value === 'all' ? undefined : value);
  }, [setThreatType]);

  const handleCountryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCountry(value === 'all' ? undefined : value);
  }, [setCountry]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value || undefined);
  }, [setSearch]);

  const handleResetFilters = useCallback(() => {
    resetFilter();
  }, [resetFilter]);

  const handleShowBlockedToggle = useCallback(() => {
    setShowBlocked(prev => !prev);
  }, []);

  const handleShowHighSeverityToggle = useCallback(() => {
    setShowHighSeverity(prev => !prev);
  }, []);

  const handleTimeRangeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeRange(e.target.value);
  }, []);

  // Helper functions for threat context
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return '#dc2626';
      case 'High': return '#f97316';
      case 'Medium': return '#eab308';
      case 'Low': return '#22c55e';
      default: return '#2563eb';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return '#22c55e';
    if (confidence >= 60) return '#eab308';
    if (confidence >= 40) return '#f97316';
    return '#dc2626';
  };

  // Filter threats based on active filters
  const filteredThreats = useMemo(() => {
    return threats.filter((threat) => {
      if (filter.severity && threat.severity !== filter.severity) return false;
      if (filter.status && threat.status !== filter.status) return false;
      if (filter.threat_type && threat.threat_type !== filter.threat_type) return false;
      if (filter.country && threat.country !== filter.country) return false;
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        const indicator = threat.indicator?.toLowerCase() || '';
        const source = threat.source?.toLowerCase() || '';
        const threatType = threat.threat_type?.toLowerCase() || '';
        if (!indicator.includes(searchLower) && !source.includes(searchLower) && !threatType.includes(searchLower)) {
          return false;
        }
      }
      if (filter.date_range) {
        const threatDate = new Date(threat.first_seen);
        const startDate = new Date(filter.date_range.start);
        const endDate = new Date(filter.date_range.end);
        if (threatDate < startDate || threatDate > endDate) return false;
      }
      return true;
    });
  }, [threats, filter]);

  const transformedChartData = useMemo(() => {
    if (threatStatsData?.threats_over_time) {
      return threatStatsData.threats_over_time;
    }
    return chartData;
  }, [threatStatsData]);

  const filteredChartData = useMemo(() => {
    return transformedChartData.map((item: unknown) => {
      const typedItem = item as { time?: string; total?: number; high?: number; blocked?: number };
      return {
        time: typedItem.time,
        total: typedItem.total,
        high: showHighSeverity ? typedItem.high : undefined,
        blocked: showBlocked ? typedItem.blocked : undefined
      };
    });
  }, [transformedChartData, showHighSeverity, showBlocked]);

  const finalChartData = useMemo(() => {
    return filteredChartData;
  }, [filteredChartData]);

  return (
    <div className="p-5 space-y-5 bg-transparent">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] text-[var(--text-tertiary)] mb-0.5 uppercase tracking-[0.05em] font-semibold">Security Operations Center</p>
          <h1 className="text-[28px] font-bold mb-1 tracking-tight text-[var(--text-primary)]">Threat Overview</h1>
          <p className="text-[12px] text-[var(--text-secondary)]">
            {statsLoading ? 'Loading data...' : threatStatsData ? 'Live' : 'Awaiting Data Integration'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-none enterprise-card">
            <Clock className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
            <span className="text-[12px] font-mono text-[var(--text-secondary)]">{currentTime || '--:--:-- UTC'}</span>
          </div>
          <button className="p-2 rounded-none enterprise-card hover:bg-[var(--bg-card-hover)] transition-colors">
            <Bell className="w-4 h-4 text-[var(--text-secondary)]" />
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-3">
        <MetricCard
          icon={<Target className="w-4 h-4" style={{ color: '#2563eb' }} />}
          title={selectedThreat ? "Selected Threat Severity" : "Total Threats"}
          value={selectedThreat ? selectedThreat.severity : (threatStatsData?.total_threats ?? '--')}
          color={selectedThreat ? getSeverityColor(selectedThreat.severity) : "#2563eb"}
        />
        <MetricCard
          icon={<Shield className="w-4 h-4" style={{ color: '#059669' }} />}
          title={selectedThreat ? "Threat Confidence" : "Active Feeds"}
          value={selectedThreat ? `${selectedThreat.confidence}%` : (threatStatsData?.active_feeds ?? '--')}
          color={selectedThreat ? getConfidenceColor(selectedThreat.confidence) : "#059669"}
        />
        <MetricCard
          icon={<Globe className="w-4 h-4" style={{ color: '#2563eb' }} />}
          title={selectedThreat ? "Threat Country" : "IPs Blocked"}
          value={selectedThreat ? selectedThreat.country : (threatStatsData?.ips_blocked ?? '--')}
          color="#2563eb"
        />
        <MetricCard
          icon={<AlertTriangle className="w-4 h-4" style={{ color: '#dc2626' }} />}
          title={selectedThreat ? "Threat Status" : "High Risk Alerts"}
          value={selectedThreat ? selectedThreat.status : (threatStatsData?.high_risk_alerts ?? '--')}
          color="#dc2626"
        />
      </div>

      {/* Chart */}
      <div className="enterprise-card p-4" style={{ height: '320px' }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[14px] font-bold text-[var(--text-primary)]">Threat Activity Over Time</h2>
          <select
            value={timeRange}
            onChange={handleTimeRangeChange}
            className="enterprise-input px-3 py-1.5 text-[11px]"
          >
            <option>Last 24 Hours</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
        </div>
        {statsLoading ? (
          <div className="flex items-center justify-center h-[240px]">
            <p className="text-[var(--text-secondary)]">Loading chart data...</p>
          </div>
        ) : finalChartData.length > 0 && finalChartData[0].time !== 'Awaiting Data Integration' ? (
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={finalChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
                <XAxis 
                  dataKey="time" 
                  stroke="var(--text-secondary)"
                  fontSize={11}
                  tick={{ fill: 'var(--text-secondary)' }}
                />
                <YAxis 
                  stroke="var(--text-secondary)"
                  fontSize={11}
                  tick={{ fill: 'var(--text-secondary)' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  name="Total Threats"
                />
                {showHighSeverity && (
                  <Line 
                    type="monotone" 
                    dataKey="high" 
                    stroke="#dc2626" 
                    strokeWidth={2}
                    name="High Severity"
                  />
                )}
                {showBlocked && (
                  <Line 
                    type="monotone" 
                    dataKey="blocked" 
                    stroke="#059669" 
                    strokeWidth={2}
                    name="Blocked"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[240px]">
            <p className="text-[var(--text-secondary)]">Awaiting Data Integration</p>
          </div>
        )}
      </div>

      {/* Live Threat Feed */}
      <div className="enterprise-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-[14px] font-bold text-[var(--text-primary)]">Live Threat Feed</h2>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filter.severity || 'all'}
              onChange={handleSeverityChange}
              className="enterprise-input px-3 py-1.5 text-[11px]"
            >
              <option value="all">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <select
              value={filter.status || 'all'}
              onChange={handleStatusChange}
              className="enterprise-input px-3 py-1.5 text-[11px]"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
            </select>
            <select
              value={filter.threat_type || 'all'}
              onChange={handleThreatTypeChange}
              className="enterprise-input px-3 py-1.5 text-[11px]"
            >
              <option value="all">All Types</option>
              <option value="Malware">Malware</option>
              <option value="Phishing">Phishing</option>
              <option value="DDoS">DDoS</option>
              <option value="Botnet">Botnet</option>
            </select>
            <select
              value={filter.country || 'all'}
              onChange={handleCountryChange}
              className="enterprise-input px-3 py-1.5 text-[11px]"
            >
              <option value="all">All Countries</option>
              <option value="USA">USA</option>
              <option value="China">China</option>
              <option value="Russia">Russia</option>
              <option value="Germany">Germany</option>
            </select>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-none enterprise-card">
              <Search className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={filter.search || ''}
                onChange={handleSearchChange}
                className="enterprise-input bg-transparent border-0 text-[11px] text-[var(--text-primary)] focus:outline-none w-24" 
              />
            </div>
            {(filter.severity || filter.status || filter.threat_type || filter.country || filter.search) && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-2 px-3 py-1.5 rounded-none enterprise-card hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                <X className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
                <span className="text-[11px] text-[var(--text-secondary)]">Reset</span>
              </button>
            )}
          </div>
        </div>
        {threatsLoading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-[var(--text-secondary)]">Loading feed data...</p>
          </div>
        ) : filteredThreats.length > 0 ? (
          <div className="space-y-2">
            {filteredThreats.slice(0, 10).map((threat) => {
              const feedItem = transformThreatToFeedItem(threat);
              const isSelected = selectedThreat?.id === threat.id;
              return (
                <div
                  key={threat.id}
                  ref={isSelected ? selectedThreatRef : null}
                  onClick={() => handleThreatClick(threat)}
                  className={`flex items-center justify-between px-4 py-3 rounded-none enterprise-card cursor-pointer transition-colors ${
                    isSelected ? 'bg-[var(--bg-tertiary)] border-[var(--color-info)]' : ''
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <span className="text-[11px] font-mono text-[var(--text-tertiary)] w-20">
                      {feedItem.time}
                    </span>
                    <span className="text-[12px] font-mono text-[var(--text-secondary)] w-28">
                      {feedItem.ip}
                    </span>
                    <span className="text-[12px] text-[var(--text-primary)] w-24">
                      {feedItem.type}
                    </span>
                    <span className="text-[12px] text-[var(--text-secondary)] w-24">
                      {feedItem.source}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-[11px] font-semibold px-2 py-1 rounded ${
                        feedItem.severity === 'Critical'
                          ? 'bg-[var(--color-critical-bg)] text-[var(--color-critical)] border border-[var(--color-critical-border)]'
                          : feedItem.severity === 'High'
                          ? 'bg-[var(--color-high-bg)] text-[var(--color-high)] border border-[var(--color-high-border)]'
                          : feedItem.severity === 'Medium'
                          ? 'bg-[var(--color-medium-bg)] text-[var(--color-medium)] border border-[var(--color-medium-border)]'
                          : 'bg-[var(--color-low-bg)] text-[var(--color-low)] border border-[var(--color-low-border)]'
                      }`}
                    >
                      {feedItem.severity}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center py-8">
            <p className="text-[var(--text-secondary)]">Awaiting Data Integration</p>
          </div>
        )}
      </div>
    </div>
  );
};

export { IncidentPanel };
export default OverviewDashboard;