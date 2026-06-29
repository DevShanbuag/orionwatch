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
  { to: '/', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { to: '/threats', label: 'Threats', icon: <ShieldAlert className="w-4 h-4" /> },
  { to: '/live-feed', label: 'Live Feed', icon: <Activity className="w-4 h-4" /> },
  { to: '/ip-intel', label: 'IP Intelligence', icon: <MapPin className="w-4 h-4" /> },
  { to: '/url-intel', label: 'URL Intelligence', icon: <Link2 className="w-4 h-4" /> },
  { to: '/assets', label: 'Assets', icon: <Layers className="w-4 h-4" /> },
  { to: '/reports', label: 'Reports', icon: <FileText className="w-4 h-4" /> },
  { to: '/playbooks', label: 'Playbooks', icon: <Play className="w-4 h-4" /> },
  { to: '/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
];

export const Sidebar: React.FC<{ className?: string }> = ({ className }) => {
  const location = useLocation();
  const { connected, reconnecting } = useRealtimeFeed({ channelName: 'threats' });

  return (
    <aside className={`w-[232px] h-screen px-4 py-4 flex flex-col gap-4 enterprise-sidebar relative z-10 ${className}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-1">
        <div className="w-8 h-8 rounded-none bg-[var(--bg-tertiary)] border border-[var(--border-primary)] flex items-center justify-center">
          <Compass className="w-4 h-4 text-[var(--text-primary)]" />
        </div>
        <div>
          <h2 className="text-sm font-bold tracking-tight text-[var(--text-primary)]">OrionWatch</h2>
          <p className="text-[11px] text-[var(--text-tertiary)] uppercase tracking-[0.05em] font-semibold">Threat Intel SOC</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1">
        <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-[var(--text-tertiary)] px-3 mb-2">Operations</p>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={`h-9 flex items-center gap-3 px-3 nav-item
                    ${isActive
                      ? 'nav-item-active'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                    }
                  `}
                >
                  <div className={`flex items-center justify-center w-5 h-5 rounded-sm transition-colors ${isActive ? 'bg-[var(--bg-primary)] text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'}`}>
                    {item.icon}
                  </div>
                  <span className="text-[13px] font-medium">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* System Status Card */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-[var(--text-tertiary)] px-1 mb-2">System</p>
        <div className="enterprise-card p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="relative">
              {connected ? (
                <CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" />
              ) : reconnecting ? (
                <Loader2 className="w-4 h-4 text-[var(--color-medium)] animate-spin" />
              ) : (
                <WifiOff className="w-4 h-4 text-[var(--color-critical)]" />
              )}
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-primary)]">System Status</span>
          </div>
          {reconnecting ? (
            <p className="text-[12px] text-[var(--color-medium)] mb-2 font-semibold">Reconnecting...</p>
          ) : connected ? (
            <p className="text-[12px] text-[var(--color-success)] mb-2 font-semibold">Connected</p>
          ) : (
            <p className="text-[12px] text-[var(--color-critical)] mb-2 font-semibold">Disconnected</p>
          )}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-[var(--text-tertiary)]">Data Sources</span>
              <span className="text-[12px] font-mono font-semibold text-[var(--text-secondary)]">--</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-[var(--text-tertiary)]">Realtime Lag</span>
              <span className="text-[12px] font-mono font-semibold text-[var(--text-secondary)]">-- ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-[var(--text-tertiary)]">Events / sec</span>
              <span className="text-[12px] font-mono font-semibold text-[var(--text-secondary)]">--</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="enterprise-card p-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-none bg-[var(--bg-tertiary)] border border-[var(--border-primary)] flex items-center justify-center">
          <User className="w-4 h-4 text-[var(--text-primary)]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold truncate text-[var(--text-primary)]">User</p>
          <p className="text-[11px] text-[var(--text-tertiary)]">Awaiting Auth</p>
        </div>
        <ChevronDown className="w-4 h-4 text-[var(--text-tertiary)] flex-shrink-0" />
      </div>
    </aside>
  );
};
