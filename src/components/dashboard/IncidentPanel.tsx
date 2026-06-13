import React, { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, X, MoreHorizontal, Search, Shield, Cpu, Globe, FileText, Plus, Lock, ScanFace } from 'lucide-react';

export const IncidentPanel: React.FC = () => {
  const iocs = useMemo(() => ['185.220.101.45', 'tor-node', 'botnet', 'c2-server', 'malware'], []);
  
  const actions = useMemo(() => [
    { icon: Lock, label: 'Block IP', color: 'red' as const },
    { icon: Search, label: 'Lookup IP', color: 'purple' as const },
    { icon: ScanFace, label: 'Scan Host', color: 'green' as const },
    { icon: Plus, label: 'Add Rule', color: 'purple' as const },
    { icon: FileText, label: 'Export Report', color: 'gray' as const },
    { icon: MoreHorizontal, label: 'More', color: 'gray' as const }
  ], []);

  const handleCloseClick = useCallback(() => {
    console.log('Close incident panel');
  }, []);

  const handleActionClick = useCallback((actionLabel: string) => {
    console.log(`Action clicked: ${actionLabel}`);
  }, []);

  return (
    <div className="w-[320px] h-full dark:bg-[rgba(8,16,32,0.95)] bg-white border-l-2 dark:border-[rgba(239,68,68,0.5)] border-red-300 shadow-[-8px_0_40px_rgba(239,68,68,0.15)] overflow-y-auto">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-red-500/20 border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
              <ShieldAlert className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold dark:text-white text-gray-900">Critical Incident Detected</h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">ACTIVE</span>
                <span className="text-xs text-gray-500">Just now</span>
              </div>
            </div>
          </div>
          <button onClick={handleCloseClick} className="p-1.5 rounded-lg dark:hover:bg-gray-800/50 hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4 dark:text-gray-400 text-gray-600" />
          </button>
        </div>

        {/* Incident Details */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Incident Details</span>
            <span className="text-xs font-bold text-red-400 bg-red-500/15 px-2 py-0.5 rounded-full border border-red-500/20">CRITICAL</span>
          </div>
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Source</span>
              <span className="text-xs font-mono font-semibold dark:text-red-300 text-red-700">185.220.101.45</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Country</span>
              <span className="text-xs font-semibold dark:text-gray-300 text-gray-800">Germany</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Threat</span>
              <span className="text-xs font-semibold dark:text-gray-300 text-gray-800">Botnet Command & Control</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Severity</span>
              <span className="text-xs font-bold text-red-400">Critical</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Risk Score</span>
              <span className="text-xs font-mono font-bold text-red-400">98/100</span>
            </div>
          </div>
        </div>

        {/* IOC Section */}
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-3">Indicators of Compromise</span>
          <div className="flex flex-wrap gap-2">
            {iocs.map((ioc) => (
              <div key={ioc} className="px-2.5 py-1 rounded-full dark:bg-red-500/10 bg-red-50 border border-red-500/20">
                <span className="text-[11px] font-mono font-semibold dark:text-red-300 text-red-700">{ioc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Assessment */}
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-3">AI Assessment</span>
          <div className="p-3 rounded-lg dark:bg-gray-800/40 bg-gray-50 border border-gray-700/30">
            <p className="text-xs dark:text-gray-300 text-gray-700 leading-relaxed">
              This endpoint is associated with known command-and-control infrastructure and has been observed in multiple active malware campaigns.
            </p>
          </div>
        </div>

        {/* Action Grid */}
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-3">Actions</span>
          <div className="grid grid-cols-2 gap-2">
            {actions.map((action, i) => {
              const Icon = action.icon;
              const colorClasses: Record<string, string> = {
                red: 'bg-red-500/15 text-red-400 border-red-500/30 hover:bg-red-500/25',
                purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30 hover:bg-purple-500/25',
                green: 'bg-green-500/15 text-green-400 border-green-500/30 hover:bg-green-500/25',
                gray: 'bg-gray-500/10 text-gray-300 border-gray-600/30 hover:bg-gray-500/20'
              };
              
              return (
                <button
                  key={i}
                  onClick={() => handleActionClick(action.label)}
                  className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg border transition-all duration-200 ${colorClasses[action.color as keyof typeof colorClasses]}`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[11px] font-semibold">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_6px_rgba(239,68,68,0.6)]" />
            <span className="text-xs font-bold uppercase tracking-wider text-red-400">Recommended Response</span>
          </div>
          <p className="text-xs dark:text-red-200 text-red-800 font-medium">
            Immediate containment advised.
          </p>
        </div>
      </div>
    </div>
  );
};
