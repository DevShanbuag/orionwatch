import React, { useState, useMemo, useCallback } from 'react';
import { Target, Shield, Globe, AlertTriangle, MoreHorizontal, Filter, Search, Plus, Lock, Scan, FileText, ArrowRight, ZoomIn, ZoomOut, RotateCcw, MapPin } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useThreatStats } from '../hooks/useThreats';

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  change?: { value: string; positive: boolean };
  sparklineData?: number[];
  color: string;
}

const chartData = [
  { time: '00:00', total: 45, high: 8, blocked: 37 },
  { time: '04:00', total: 38, high: 5, blocked: 33 },
  { time: '08:00', total: 52, high: 12, blocked: 40 },
  { time: '12:00', total: 68, high: 18, blocked: 50 },
  { time: '16:00', total: 75, high: 22, blocked: 53 },
  { time: '20:00', total: 120, high: 30, blocked: 90 },
  { time: '24:00', total: 812, high: 186, blocked: 672 },
];

const mockLiveFeed = [
  {
    time: '23:46:59',
    ip: '185.244.214.23',
    type: 'Malicious IP Address',
    source: 'AbuseIPDB',
    severity: 'High',
    details: {
      attackType: 'Brute Force (SSH)',
      target: 'TCP',
      port: '22 (SSH)',
      location: 'Moscow, Russia',
      firstSeen: '23:42:12',
      lastSeen: '23:47:12',
      attempts: '128',
      abuseScore: '98 / 100'
    }
  },
  {
    time: '23:46:45',
    ip: 'hxxps://malicious-domain.com',
    type: 'Phishing URL',
    source: 'URLhaus',
    severity: 'High',
    details: {
      attackType: 'Credential Phishing'
    }
  },
  {
    time: '23:46:12',
    ip: '192.168.1.101',
    type: 'Suspicious Behavior',
    source: 'Internal Sensor',
    severity: 'Medium',
    details: {
      attackType: 'Data Exfiltration Attempt'
    }
  },
  {
    time: '23:45:58',
    ip: '203.0.113.45',
    type: 'C2 Communication',
    source: 'VirusTotal',
    severity: 'High',
    details: {}
  }
];

const MetricCard = React.memo<MetricCardProps>(({ icon, title, value, change, sparklineData, color }) => {
  // Memoize sparkline data transformation
  const transformedSparklineData = useMemo(() => {
    if (!sparklineData) return null;
    return sparklineData.map((v: number, i: number) => ({ x: i, y: v }));
  }, [sparklineData]);

  return (
    <div className="glass-card p-5 flex flex-col gap-3" style={{ height: '160px' }}>
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center" style={{ width: '64px', height: '64px', borderRadius: '12px', backgroundColor: `${color}20`, border: `1px solid ${color}40` }}>
          {icon}
        </div>
        <div>
          <p className="text-[14px] text-[#94A3B8]">{title}</p>
          <p className="text-[40px] font-bold">{value}</p>
        </div>
      </div>
      {change && (
        <div className={`text-[12px] font-semibold ${change.positive ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
          {change.value}
        </div>
      )}
      {transformedSparklineData && (
        <div style={{ height: '28px', marginTop: '4px' }}>
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
      <div className="glass-card p-3 border border-purple-500/30">
        <p className="text-gray-300 text-xs mb-2">{label}</p>
        {payload.map((entry: unknown, index: number) => {
          const typedEntry = entry as { color?: string; name?: string; value?: unknown };
          return (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: typedEntry.color }}
              />
              <span className="text-gray-500">{typedEntry.name}:</span>
              <span className="text-white font-semibold">{typedEntry.value as string | number}</span>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
});

const IncidentPanel = () => (
  <div style={{ width: '320px', height: '100vh' }} className="glass-card-red overflow-y-auto">
    <div className="p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-[12px] bg-red-500/20 border border-red-500/30">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h2 className="text-base font-bold">Critical Incident Detected</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-semibold text-red-400 uppercase tracking-[0.12em]">ACTIVE</span>
              <span className="text-[10px] text-gray-500">22 ago</span>
            </div>
          </div>
        </div>
        <button className="p-1 rounded hover:bg-gray-800/50 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {/* Divider */}
      <div className="h-px bg-red-500/10 mb-3" />

      {/* Incident Details */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-gray-400">Incident Details</span>
          <span className="text-[10px] font-bold text-red-400 bg-red-500/15 px-2 py-0.5 rounded-full border border-red-500/30">Critical</span>
        </div>
        <div className="space-y-1.5 text-[12px]">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Severity</span>
            <span className="font-semibold text-red-400">Critical</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Attack Type</span>
            <span className="font-semibold">Brute Force (SSH)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Source IP</span>
            <span className="font-mono font-semibold text-red-300">185.244.214.23</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Location</span>
            <span className="font-semibold">Moscow, Russia</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Target Port</span>
            <span className="font-mono font-semibold">22 (SSH)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Protocol</span>
            <span className="font-semibold">TCP</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">First Seen</span>
            <span className="font-mono text-[11px]">23:42:12</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Last Seen</span>
            <span className="font-mono text-[11px]">23:47:12</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Attempts</span>
            <span className="font-mono font-semibold">128</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Abuse Score</span>
            <span className="font-mono font-bold text-red-400">98 / 100</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Status</span>
            <span className="font-semibold text-red-400">● Blocked</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-red-500/10 mb-3" />

      {/* Description */}
      <div className="mb-3">
        <span className="text-[12px] font-bold uppercase tracking-[0.12em] text-gray-400 block mb-2">Description</span>
        <div className="p-3 rounded-[12px] bg-gray-800/40 border border-gray-700/30">
          <p className="text-[13px] text-gray-300 leading-relaxed">
            Multiple failed SSH login attempts using common credential list.
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-red-500/10 mb-3" />

      {/* IOC Section */}
      <div className="mb-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400 block mb-2">IOCs</span>
        <div className="flex flex-wrap gap-1.5">
          {['185.244.214.23', 'SSH', 'Brute Force', 'Malicious IP'].map((ioc, i) => (
            <div key={i} className="px-2 py-1 rounded-[8px] bg-red-500/10 border border-red-500/30">
              <span className="text-[10px] font-mono font-semibold text-red-300">{ioc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-red-500/10 mb-3" />

      {/* Actions */}
      <div className="mb-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400 block mb-2">Actions</span>
        <div className="grid grid-cols-3 gap-2">
          {[
              { icon: Lock, label: 'Block IP', color: 'red' as const },
              { icon: Search, label: 'Lookup IP', color: 'purple' as const },
              { icon: Scan, label: 'Scan IP', color: 'green' as const },
              { icon: Plus, label: 'Add Rule', color: 'purple' as const },
              { icon: FileText, label: 'Export', color: 'gray' as const },
              { icon: MoreHorizontal, label: 'More', color: 'gray' as const },
            ].map((action, i) => {
              const Icon = action.icon;
              const colorClasses: Record<string, string> = {
                red: 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30',
                purple: 'bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30',
                green: 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30',
                gray: 'bg-gray-500/10 text-gray-300 border border-gray-600/30 hover:bg-gray-500/20'
              };
              return (
                <button
                  key={i}
                  className={`flex flex-col items-center justify-center gap-1 p-2.5 rounded-[12px] transition-all duration-200 ${colorClasses[action.color]}`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[10px] font-semibold">{action.label}</span>
                </button>
              );
            })}
        </div>
      </div>
    </div>
  </div>
);

const OverviewDashboard = () => {
  const [showBlocked, setShowBlocked] = useState(true);
  const [showHighSeverity, setShowHighSeverity] = useState(true);
  const [timeRange, setTimeRange] = useState('Last 24 Hours');
  const { data: threatStatsData } = useThreatStats();

  // Memoize event handlers with useCallback
  const handleShowBlockedToggle = useCallback(() => {
    setShowBlocked(prev => !prev);
  }, []);

  const handleShowHighSeverityToggle = useCallback(() => {
    setShowHighSeverity(prev => !prev);
  }, []);

  const handleTimeRangeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeRange(e.target.value);
  }, []);

  // Memoize chart data transformations
  const transformedChartData = useMemo(() => {
    // If we have real data from threatStatsData, use that; otherwise use mock chartData
    if (threatStatsData?.threats_over_time) {
      return threatStatsData.threats_over_time;
    }
    return chartData;
  }, [threatStatsData]);

  // Memoize severity filtering and aggregation
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

  // Memoize final chart data
  const finalChartData = useMemo(() => {
    return filteredChartData;
  }, [filteredChartData]);

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: '#050816' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="relative">
          {/* Radial glow behind Mission Control */}
          <div className="absolute -inset-8 rounded-full blur-3xl -z-10" style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 70%)' }} />
          <p className="text-[11px] text-[#94A3B8] mb-0.5">Welcome back, NEXUS-07</p>
          <h1 className="text-[40px] font-semibold mb-0.5" style={{ lineHeight: '1.1' }}>Mission Control</h1>
          <div className="flex items-center gap-2">
            <div className="px-2 py-0.5 rounded-full bg-green-500/15 border border-green-500/30 flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] font-semibold text-green-400">LIVE MONITORING</span>
            </div>
            <p className="text-[11px] text-[#64748B]">Monitoring the digital universe. Hunting threats in real-time.</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[12px]">
          <div className="flex items-center gap-2 text-gray-400">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            <span>23:47:18 UTC</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-2 py-0.5 rounded-full bg-green-500/15 border border-green-500/30 flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] font-semibold text-green-400">LIVE</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <span>Analyst Mode</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          icon={<Target className="w-5 h-5" style={{ color: '#8B5CF6' }} />}
          title="Total Threats"
          value={threatStatsData?.total_threats?.toLocaleString() || "1,248"}
          change={{ value: '↑ 23.5% vs yesterday', positive: false }}
          sparklineData={[40, 55, 62, 48, 72, 88, 75]}
          color="#8B5CF6"
        />
        <MetricCard
          icon={<Shield className="w-5 h-5" style={{ color: '#22C55E' }} />}
          title="Active Feeds"
          value={threatStatsData?.active_feeds ? `${threatStatsData.active_feeds} / 8` : "8 / 8"}
          change={{ value: 'All feeds operational', positive: true }}
          sparklineData={[5, 6, 7, 6, 8, 8, 8]}
          color="#22C55E"
        />
        <MetricCard
          icon={<Globe className="w-5 h-5" style={{ color: '#38BDF8' }} />}
          title="IPs Blocked"
          value={threatStatsData?.ips_blocked?.toLocaleString() || "672"}
          change={{ value: '↑ 18.7% vs yesterday', positive: true }}
          sparklineData={[45, 52, 48, 60, 65, 70, 67]}
          color="#38BDF8"
        />
        <MetricCard
          icon={<AlertTriangle className="w-5 h-5" style={{ color: '#EF4444' }} />}
          title="High Risk Alerts"
          value={threatStatsData?.high_risk_alerts?.toLocaleString() || "186"}
          change={{ value: '↑ 12.4% vs yesterday', positive: false }}
          sparklineData={[120, 135, 142, 138, 155, 170, 186]}
          color="#EF4444"
        />
      </div>

      {/* Chart & Map Row */}
      <div className="grid grid-cols-[60%_40%] gap-4">
        {/* Threat Activity Chart */}
        <div className="glass-card p-5" style={{ height: '360px' }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[18px] font-bold">Threat Activity Over Time</h2>
            <select
              value={timeRange}
              onChange={handleTimeRangeChange}
              className="text-[12px] text-gray-500 px-3 py-1.5 rounded-full bg-gray-800/50 border border-gray-700 focus:outline-none"
            >
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="mb-2.5 flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#8B5CF6]" />
              <span className="text-[12px] text-gray-400">Total Threats</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
              <span className="text-[12px] text-gray-400">High Severity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#22C55E]" />
              <span className="text-[12px] text-gray-400">Blocked</span>
            </div>
            <button
              onClick={handleShowBlockedToggle}
              className="flex items-center gap-2"
            >
              <div className={`w-3 h-3 rounded-full ${showBlocked ? 'bg-[#22C55E]' : 'border border-gray-600'}`} />
              <span className="text-[12px] text-gray-500">Show Blocked</span>
            </button>
            <button
              onClick={handleShowHighSeverityToggle}
              className="flex items-center gap-2"
            >
              <div className={`w-3 h-3 rounded-full ${showHighSeverity ? 'bg-[#EF4444]' : 'border border-gray-600'}`} />
              <span className="text-[12px] text-gray-500">Show High Severity</span>
            </button>
          </div>
          <div className="relative" style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={finalChartData} margin={{ top: 8, right: 60, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="rgba(148,163,184,0.15)" vertical={false} />
                <XAxis
                  dataKey="time"
                  stroke="rgba(148,163,184,0.5)"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="rgba(148,163,184,0.5)"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickCount={5}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Total Threats"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, stroke: '#050816', fill: '#8B5CF6' }}
                  activeDot={{ r: 6, strokeWidth: 3, stroke: '#050816', fill: '#8B5CF6' }}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {showHighSeverity && (
                  <Line
                    type="monotone"
                    dataKey="high"
                    name="High Severity"
                    stroke="#EF4444"
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, stroke: '#050816', fill: '#EF4444' }}
                    activeDot={{ r: 6, strokeWidth: 3, stroke: '#050816', fill: '#EF4444' }}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
                {showBlocked && (
                  <Line
                    type="monotone"
                    dataKey="blocked"
                    name="Blocked"
                    stroke="#22C55E"
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, stroke: '#050816', fill: '#22C55E' }}
                    activeDot={{ r: 6, strokeWidth: 3, stroke: '#050816', fill: '#22C55E' }}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
            {/* Endpoint Pills */}
            <div className="absolute top-0 right-0 flex flex-col gap-1.5">
              <div className="px-2.5 py-1.5 rounded-[12px] bg-purple-500/20 border border-purple-500/30">
                <span className="text-[12px] font-bold text-purple-400">
                  {finalChartData[finalChartData.length - 1]?.total || 812}
                </span>
              </div>
              <div className="px-2.5 py-1.5 rounded-[12px] bg-red-500/20 border border-red-500/30">
                <span className="text-[12px] font-bold text-red-400">
                  {showHighSeverity && finalChartData[finalChartData.length - 1]?.high ? finalChartData[finalChartData.length - 1].high : 186}
                </span>
              </div>
              <div className="px-2.5 py-1.5 rounded-[12px] bg-green-500/20 border border-green-500/30">
                <span className="text-[12px] font-bold text-green-400">
                  {showBlocked && finalChartData[finalChartData.length - 1]?.blocked ? finalChartData[finalChartData.length - 1].blocked : 672}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Threat Map */}
        <div className="glass-card p-5 flex flex-col" style={{ height: '360px' }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[18px] font-bold">Global Threat Map</h2>
            <div className="flex items-center gap-2">
              <button className="text-[12px] text-gray-500 px-3 py-1.5 rounded-full bg-gray-800/50 border border-gray-700">
                3D Globe
              </button>
            </div>
          </div>
          <div className="flex-1 relative overflow-hidden rounded-[12px] border border-gray-700/30 bg-[#050816]" style={{ height: '85%' }}>
            <svg viewBox="0 0 1000 500" className="w-full h-full">
              <defs>
                <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <rect width="1000" height="500" fill="url(#mapGlow)" />
              <g fill="rgba(51,65,85,0.3)" stroke="rgba(139,92,246,0.25)" strokeWidth="0.5">
                <path d="M120,70 L150,80 L180,90 L210,110 L240,140 L230,180 L200,200 L170,190 L140,210 L120,230 L100,220 L80,190 L60,170 L50,130 L70,100 Z" />
                <path d="M160,230 L190,240 L220,280 L230,330 L210,370 L180,380 L160,350 L170,300 Z" />
                <path d="M250,320 L290,330 L320,370 L340,420 L330,460 L290,480 L270,450 L260,400 Z" />
                <path d="M450,70 L480,60 L520,70 L550,90 L560,130 L530,150 L510,140 L480,160 L450,150 L440,110 Z" />
                <path d="M450,160 L490,150 L520,180 L540,250 L530,330 L490,380 L450,390 L420,360 L410,300 L430,240 Z" />
                <path d="M560,60 L630,50 L700,80 L760,120 L800,170 L790,230 L740,260 L690,250 L650,280 L600,260 L570,290 L540,250 L520,200 L530,150 L570,130 L560,90 Z" />
                <path d="M820,360 L860,370 L890,400 L900,440 L870,470 L840,460 L820,420 Z" />
              </g>
              
              {/* Attack Nodes with brighter glow */}
              <g filter="url(#glow)">
                <circle cx="150" cy="150" r="16" fill="#8B5CF6" />
                <circle cx="150" cy="150" r="8" fill="#fff" />
                
                <circle cx="480" cy="120" r="18" fill="#8B5CF6" />
                <circle cx="480" cy="120" r="9" fill="#fff" />
                
                <circle cx="650" cy="200" r="20" fill="#8B5CF6" />
                <circle cx="650" cy="200" r="10" fill="#fff" />
                
                <circle cx="300" cy="400" r="14" fill="#8B5CF6" />
                <circle cx="300" cy="400" r="7" fill="#fff" />
                
                <circle cx="850" cy="420" r="16" fill="#8B5CF6" />
                <circle cx="850" cy="420" r="8" fill="#fff" />
                
                <circle cx="720" cy="190" r="15" fill="#8B5CF6" />
                <circle cx="720" cy="190" r="7.5" fill="#fff" />
                
                <circle cx="550" cy="300" r="17" fill="#8B5CF6" />
                <circle cx="550" cy="300" r="8.5" fill="#fff" />
              </g>
              
              {/* Attack Arcs matching screenshot */}
              <g stroke="#8B5CF6" strokeWidth="2.5" fill="none" opacity="0.8">
                <path d="M150,150 Q400,50 650,200">
                  <animate attributeName="stroke-dasharray" from="0,2000" to="2000,0" dur="2.8s" repeatCount="indefinite" />
                </path>
                <path d="M480,120 Q665,270 850,420">
                  <animate attributeName="stroke-dasharray" from="0,2000" to="2000,0" dur="3.2s" repeatCount="indefinite" />
                </path>
                <path d="M300,400 Q425,325 550,300">
                  <animate attributeName="stroke-dasharray" from="0,2000" to="2000,0" dur="2.4s" repeatCount="indefinite" />
                </path>
                <path d="M720,190 Q425,185 150,150">
                  <animate attributeName="stroke-dasharray" from="0,2000" to="2000,0" dur="3s" repeatCount="indefinite" />
                </path>
                <path d="M550,300 Q700,360 850,420">
                  <animate attributeName="stroke-dasharray" from="0,2000" to="2000,0" dur="2.6s" repeatCount="indefinite" />
                </path>
              </g>
            </svg>
            
            {/* Map Controls */}
            <div className="absolute top-3 right-3 flex flex-col gap-1.5">
              <button className="w-8 h-8 rounded-[8px] bg-gray-900/75 backdrop-blur border border-gray-700/30 flex items-center justify-center hover:bg-gray-800/85 transition">
                <ZoomIn className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-[8px] bg-gray-900/75 backdrop-blur border border-gray-700/30 flex items-center justify-center hover:bg-gray-800/85 transition">
                <ZoomOut className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-[8px] bg-gray-900/75 backdrop-blur border border-gray-700/30 flex items-center justify-center hover:bg-gray-800/85 transition">
                <RotateCcw className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-[8px] bg-gray-900/75 backdrop-blur border border-gray-700/30 flex items-center justify-center hover:bg-gray-800/85 transition">
                <MapPin className="w-4 h-4" />
              </button>
            </div>
            
            {/* Legend at bottom-left */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2.5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#38BDF8]" />
                <span className="text-[10px] text-gray-500">Low</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                <span className="text-[10px] text-gray-500">Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#EF4444]" />
                <span className="text-[10px] text-gray-500">High</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#DC2626]" />
                <span className="text-[10px] text-gray-500">Critical</span>
              </div>
            </div>
            
            {/* Attack Counter at bottom-right */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse" />
              <span className="text-[10px] text-gray-500">Live Attacks: 142</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Threat Feed */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] font-bold">Live Threat Feed</h2>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2 px-3 py-2 rounded-[12px] bg-gray-800/50 border border-gray-700">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-[12px] text-gray-400 font-semibold">All Severities</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-[12px] bg-gray-800/50 border border-gray-700">
              <Search className="w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search feed..." className="bg-transparent border-0 text-[12px] text-gray-300 focus:outline-none w-32" />
            </div>
            <button className="p-2 rounded-[12px] hover:bg-gray-800/50 transition-all duration-200">
              <MoreHorizontal className="w-4.5 h-4.5 text-gray-400" />
            </button>
          </div>
        </div>
        <div className="space-y-1.5">
          {mockLiveFeed.map((threat, idx) => {
            const severityColor = threat.severity === 'High' ? '#EF4444' : threat.severity === 'Medium' ? '#F59E0B' : '#22C55E';
            return (
              <div key={idx} className="px-4 py-3 rounded-[12px] bg-gray-800/30 border border-gray-700/30 hover:shadow-[0_0_20px_rgba(139,92,246,0.06)] transition-all duration-200" style={{ height: '80px' }}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.4)]" style={{ backgroundColor: severityColor, boxShadow: `0 0 8px ${severityColor}40` }} />
                    <span className="text-[12px] font-mono text-gray-400">{threat.time}</span>
                    <span className="text-sm font-semibold">{threat.ip}</span>
                    <span className="text-[12px] text-gray-500">{threat.type}</span>
                    <div className="px-2 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
                      <span className="text-[10px] font-semibold text-purple-400">{threat.source}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-0.5 rounded-full text-[11px] font-bold" style={{ backgroundColor: `${severityColor}15`, color: severityColor }}>
                      {threat.severity}
                    </div>
                    <button className="p-1.5 rounded-[8px] hover:bg-gray-800/50 transition-all duration-200">
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                {threat.details.attackType && (
                  <div className="grid grid-cols-4 md:grid-cols-7 gap-2 text-[12px]">
                    <div>
                      <span className="text-gray-500">Type</span>
                      <p className="font-semibold text-gray-300">{threat.details.attackType}</p>
                    </div>
                    {threat.details.target && (
                      <div>
                        <span className="text-gray-500">Target</span>
                        <p className="font-semibold text-gray-300">{threat.details.target}</p>
                      </div>
                    )}
                    {threat.details.port && (
                      <div>
                        <span className="text-gray-500">Target Port</span>
                        <p className="font-semibold text-gray-300">{threat.details.port}</p>
                      </div>
                    )}
                    {threat.details.location && (
                      <div>
                        <span className="text-gray-500">Location</span>
                        <p className="font-semibold text-gray-300">{threat.details.location}</p>
                      </div>
                    )}
                    {threat.details.firstSeen && (
                      <div>
                        <span className="text-gray-500">First Seen</span>
                        <p className="font-semibold text-gray-300">{threat.details.firstSeen}</p>
                      </div>
                    )}
                    {threat.details.attempts && (
                      <div>
                        <span className="text-gray-500">Attempts</span>
                        <p className="font-semibold text-gray-300">{threat.details.attempts}</p>
                      </div>
                    )}
                    {threat.details.abuseScore && (
                      <div>
                        <span className="text-gray-500">Abuse Score</span>
                        <p className="font-semibold text-red-400">{threat.details.abuseScore}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex justify-center">
          <button className="text-[12px] font-semibold text-purple-400 hover:underline flex items-center gap-1">
            View all threats
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export { IncidentPanel };
export default OverviewDashboard;
