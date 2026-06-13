import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Compass,
  LayoutDashboard, 
  ShieldAlert, 
  Activity, 
  MapPin,
  Link2, 
  Layers, 
  FileText, 
  Play, 
  Settings, 
  User,
  ChevronDown,
  CheckCircle2,
  WifiOff,
  Loader2
} from 'lucide-react';
import { useRealtimeFeed } from '../../hooks/useRealtimeFeed';

const navItems = [
  { to: '/', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { to: '/threats', label: 'Threats', icon: <ShieldAlert className="w-5 h-5" /> },
  { to: '/live-feed', label: 'Live Feed', icon: <Activity className="w-5 h-5" /> },
  { to: '/ip-intel', label: 'IP Intelligence', icon: <MapPin className="w-5 h-5" /> },
  { to: '/url-intel', label: 'URL Intelligence', icon: <Link2 className="w-5 h-5" /> },
  { to: '/assets', label: 'Assets', icon: <Layers className="w-5 h-5" /> },
  { to: '/reports', label: 'Reports', icon: <FileText className="w-5 h-5" /> },
  { to: '/playbooks', label: 'Playbooks', icon: <Play className="w-5 h-5" /> },
  { to: '/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
];

export const Sidebar: React.FC<{ className?: string }> = ({ className }) => {
  const location = useLocation();
  const { connected, reconnecting } = useRealtimeFeed({ channelName: 'threats' });
  
  return (
    <aside className={`w-[232px] h-screen px-5 py-6 flex flex-col gap-6 border-r border-[rgba(255,255,255,0.06)] bg-[#050816] relative z-10 ${className}`}>
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)]">
          <Compass className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-base font-bold">OrionWatch</h2>
          <p className="text-[10px] text-[#94A3B8] uppercase tracking-[0.12em]">Real-time Threat Intel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1">
        <ul className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={`h-12 flex items-center gap-3 px-3 rounded-[12px] transition-all duration-200
                    ${isActive 
                      ? 'bg-[rgba(124,58,237,0.25)] text-[#A855F7] shadow-[0_0_25px_rgba(124,58,237,0.2)] border border-[rgba(140,100,255,0.3)]' 
                      : 'text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-[rgba(140,100,255,0.08)]'
                    }
                  `}
                >
                  <div className={isActive ? 'text-white' : ''}>{item.icon}</div>
                  <span className="text-sm font-medium">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* System Status Card */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="relative">
            {connected ? (
              <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
            ) : reconnecting ? (
              <Loader2 className="w-5 h-5 text-[#F59E0B] animate-spin" />
            ) : (
              <WifiOff className="w-5 h-5 text-[#EF4444]" />
            )}
            {connected && (
              <div className="absolute inset-0 rounded-full bg-[#22C55E] animate-ping opacity-40"></div>
            )}
          </div>
          <span className="text-xs font-bold">System Status</span>
        </div>
        {reconnecting ? (
          <p className="text-[11px] text-[#F59E0B] mb-3 font-semibold">Reconnecting...</p>
        ) : connected ? (
          <p className="text-[11px] text-[#22C55E] mb-3 font-semibold">All Systems Operational</p>
        ) : (
          <p className="text-[11px] text-[#EF4444] mb-3 font-semibold">Disconnected</p>
        )}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#94A3B8]">API Sources</span>
            <span className="text-[11px] font-mono font-semibold text-[#22C55E]">12 / 12 Online</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#94A3B8]">Realtime Lag</span>
            <span className="text-[11px] font-mono font-semibold text-[#8B5CF6]">120 ms</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#94A3B8]">Events / sec</span>
            <span className="text-[11px] font-mono font-semibold text-[#F59E0B]">642</span>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="glass-card p-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center border border-[rgba(140,100,255,0.3)]">
          <User className="w-4.5 h-4.5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold">NEXUS-07</p>
          <p className="text-[11px] text-[#94A3B8]">Administrator</p>
        </div>
        <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
      </div>
    </aside>
  );
};
