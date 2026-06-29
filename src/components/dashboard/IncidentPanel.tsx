import React, { useCallback } from 'react';
import { ShieldAlert, X, Clock, AlertTriangle } from 'lucide-react';
import { useSelectedThreatStore } from '../../store/useSelectedThreatStore';

export const IncidentPanel: React.FC = () => {
  const { selectedThreat, clearSelectedThreat } = useSelectedThreatStore();

  const handleCloseClick = useCallback(() => {
    clearSelectedThreat();
  }, [clearSelectedThreat]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'text-[var(--color-critical)] bg-[var(--color-critical-bg)] border-[var(--color-critical-border)]';
      case 'High': return 'text-[var(--color-high)] bg-[var(--color-high-bg)] border-[var(--color-high-border)]';
      case 'Medium': return 'text-[var(--color-medium)] bg-[var(--color-medium-bg)] border-[var(--color-medium-border)]';
      case 'Low': return 'text-[var(--color-low)] bg-[var(--color-low-bg)] border-[var(--color-low-border)]';
      default: return 'text-[var(--text-secondary)] bg-[var(--bg-tertiary)] border-[var(--border-primary)]';
    }
  };

  return (
    <div className="w-[320px] h-full incident-panel overflow-y-auto">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-none bg-[var(--color-critical-bg)] border border-[var(--color-critical-border)]">
              <ShieldAlert className="w-4 h-4 text-[var(--color-critical)]" />
            </div>
            <div>
              <h2 className="text-[14px] font-bold text-[var(--text-primary)] tracking-tight">Incident Panel</h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-none status-dot status-offline" />
                <span className="text-[11px] font-semibold text-[var(--color-tertiary)] uppercase tracking-[0.05em]">STANDBY</span>
              </div>
            </div>
          </div>
          <button onClick={handleCloseClick} className="p-1.5 rounded-none hover:bg-[var(--bg-tertiary)] transition-colors">
            <X className="w-4 h-4 text-[var(--text-tertiary)]" />
          </button>
        </div>

        <div className="h-px bg-[var(--border-primary)] mb-4" />

        {/* Content */}
        {selectedThreat ? (
          <div className="space-y-4">
            {/* Threat Overview */}
            <div className="enterprise-card p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-[0.05em]">
                  Threat Details
                </span>
                <span
                  className={`text-[11px] font-semibold px-2 py-1 rounded border ${getSeverityColor(selectedThreat.severity)}`}
                >
                  {selectedThreat.severity}
                </span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-[11px] text-[var(--text-tertiary)] mb-1">Indicator</p>
                  <p className="text-[13px] font-mono text-[var(--text-primary)] break-all">
                    {selectedThreat.indicator}
                  </p>
                </div>
                
                <div>
                  <p className="text-[11px] text-[var(--text-tertiary)] mb-1">Type</p>
                  <p className="text-[12px] text-[var(--text-secondary)]">
                    {selectedThreat.threat_type}
                  </p>
                </div>
                
                <div>
                  <p className="text-[11px] text-[var(--text-tertiary)] mb-1">Source</p>
                  <p className="text-[12px] text-[var(--text-secondary)]">
                    {selectedThreat.source}
                  </p>
                </div>
                
                <div>
                  <p className="text-[11px] text-[var(--text-tertiary)] mb-1">Country</p>
                  <p className="text-[12px] text-[var(--text-secondary)]">
                    {selectedThreat.country}
                  </p>
                </div>
              </div>
            </div>

            {/* Confidence */}
            <div className="enterprise-card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[var(--color-high)]" />
                  <p className="text-[12px] text-[var(--text-secondary)]">Confidence</p>
                </div>
                <span className="text-[14px] font-bold text-[var(--text-primary)]">
                  {selectedThreat.confidence}%
                </span>
              </div>
            </div>

            {/* Timeline */}
            <div className="enterprise-card p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[var(--text-tertiary)]" />
                  <p className="text-[12px] text-[var(--text-secondary)]">First Seen</p>
                </div>
                <p className="text-[12px] text-[var(--text-primary)] ml-6">
                  {new Date(selectedThreat.first_seen).toLocaleString()}
                </p>
                
                <div className="flex items-center gap-2 mt-3">
                  <Clock className="w-4 h-4 text-[var(--text-tertiary)]" />
                  <p className="text-[12px] text-[var(--text-secondary)]">Last Seen</p>
                </div>
                <p className="text-[12px] text-[var(--text-primary)] ml-6">
                  {new Date(selectedThreat.last_seen).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="enterprise-card p-4">
              <div className="flex items-center justify-between">
                <p className="text-[12px] text-[var(--text-secondary)]">Status</p>
                <span className="text-[12px] font-semibold text-[var(--text-primary)]">
                  {selectedThreat.status}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="enterprise-card p-4">
            <p className="text-[13px] text-[var(--text-secondary)] text-center">
              Awaiting Data Integration
            </p>
            <p className="text-[11px] text-[var(--text-tertiary)] text-center mt-2">
              Select a threat from the feed or map to view details
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
