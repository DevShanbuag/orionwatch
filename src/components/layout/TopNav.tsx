import React, { useState, useEffect } from 'react';
import { Bell, Clock, Settings, User, ChevronDown, RadioTower } from 'lucide-react';

export const TopNav: React.FC = () => {
  const [utcTime, setUtcTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      setUtcTime(`${hours}:${minutes}:${seconds}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="dark:bg-[rgba(8,16,32,0.9)] bg-white px-6 py-5 flex items-center justify-between border-b dark:border-[rgba(139,92,246,0.2)] border-slate-200 relative z-10">
      <div>
        <p className="text-[11px] dark:text-slate-500 text-slate-500 mb-1">Welcome back, NEXUS-07</p>
        <div className="flex items-center gap-4 flex-wrap">
          <h1 className="text-xl font-bold tracking-tight dark:text-[#F8FAFC] text-[#0F172A]">Mission Control</h1>
          <div className="flex items-center gap-2 bg-[rgba(139,92,246,0.12)] px-3 py-1.5 rounded-full border border-[rgba(139,92,246,0.25)]">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
              <div className="absolute inset-0 rounded-full bg-[#22C55E] animate-ping opacity-50" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#A855F7]">
              Live Monitoring
            </span>
          </div>
        </div>
        <p className="text-[11px] dark:text-slate-500 text-slate-500 mt-1">Monitoring the digital universe. Hunting threats in real-time.</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] dark:text-slate-400 text-slate-600">
          <Clock className="w-4 h-4" />
          <span className="text-xs font-mono font-semibold">{utcTime} UTC</span>
        </div>
        <button className="p-2.5 rounded-lg dark:hover:bg-[rgba(255,255,255,0.05)] hover:bg-slate-100 relative transition-all duration-200">
          <Bell className="w-5 h-5 dark:text-slate-400 text-slate-600" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#EF4444] rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
        </button>
        <button className="p-2.5 rounded-lg dark:hover:bg-[rgba(255,255,255,0.05)] hover:bg-slate-100 transition-all duration-200">
          <Settings className="w-5 h-5 dark:text-slate-400 text-slate-600" />
        </button>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl dark:bg-[rgba(255,255,255,0.04)] bg-slate-100 cursor-pointer border dark:border-[rgba(255,255,255,0.08)] border-slate-200 transition-all duration-200 hover:shadow-[0_0_20px_rgba(139,92,246,0.1)]">
          <span className="text-xs font-semibold dark:text-slate-300 text-slate-700">Analyst Mode</span>
          <ChevronDown className="w-4 h-4 dark:text-slate-500 text-slate-400" />
        </div>
      </div>
    </header>
  );
};
