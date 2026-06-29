import React from 'react';
import { Globe, Mail, Link, Fingerprint, Shield, Clock, AlertTriangle } from 'lucide-react';
import type { IOC, IOCType } from '../../types/ioc';
import type { Severity } from '../../types/common';

interface IOCDetailCardProps {
  ioc: IOC;
}

const getIOCIcon = (type: IOCType) => {
  switch (type) {
    case 'IPv4':
    case 'IPv6':
      return <Globe className="w-4 h-4" />;
    case 'Domain':
      return <Globe className="w-4 h-4" />;
    case 'URL':
      return <Link className="w-4 h-4" />;
    case 'SHA256':
    case 'MD5':
      return <Fingerprint className="w-4 h-4" />;
    case 'Email':
      return <Mail className="w-4 h-4" />;
    default:
      return <Shield className="w-4 h-4" />;
  }
};

const getSeverityColor = (severity: Severity) => {
  switch (severity) {
    case 'Critical':
      return 'text-[var(--color-critical)] bg-[var(--color-critical-bg)] border-[var(--color-critical-border)]';
    case 'High':
      return 'text-[var(--color-high)] bg-[var(--color-high-bg)] border-[var(--color-high-border)]';
    case 'Medium':
      return 'text-[var(--color-medium)] bg-[var(--color-medium-bg)] border-[var(--color-medium-border)]';
    case 'Low':
      return 'text-[var(--color-low)] bg-[var(--color-low-bg)] border-[var(--color-low-border)]';
    default:
      return 'text-[var(--text-secondary)] bg-[var(--bg-tertiary)] border-[var(--border-primary)]';
  }
};

const getReputationColor = (score: number) => {
  if (score >= 80) return 'text-[var(--color-critical)]';
  if (score >= 60) return 'text-[var(--color-high)]';
  if (score >= 40) return 'text-[var(--color-medium)]';
  return 'text-[var(--color-success)]';
};

export const IOCDetailCard: React.FC<IOCDetailCardProps> = ({ ioc }) => {
  const reputation = Math.floor(Math.random() * 100);
  const relatedIncidents = Math.floor(Math.random() * 10);

  return (
    <div className="enterprise-card p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-none bg-[var(--bg-tertiary)] border border-[var(--border-primary)]">
            {getIOCIcon(ioc.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-[0.05em]">
              {ioc.type}
            </p>
            <p className="text-[13px] font-mono text-[var(--text-primary)] truncate mt-0.5">
              {ioc.value}
            </p>
          </div>
        </div>
        <span
          className={`text-[11px] font-semibold px-2 py-1 rounded border ${getSeverityColor(ioc.severity)}`}
        >
          {ioc.severity}
        </span>
      </div>

      <div className="h-px bg-[var(--border-primary)] mb-4" />

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Reputation */}
        <div>
          <p className="text-[11px] text-[var(--text-tertiary)] mb-1">Reputation</p>
          <p className={`text-[14px] font-bold ${getReputationColor(reputation)}`}>
            {reputation}/100
          </p>
        </div>

        {/* Confidence */}
        <div>
          <p className="text-[11px] text-[var(--text-tertiary)] mb-1">Confidence</p>
          <p className="text-[14px] font-bold text-[var(--text-primary)]">
            {ioc.confidence}%
          </p>
        </div>

        {/* First Seen */}
        <div>
          <p className="text-[11px] text-[var(--text-tertiary)] mb-1 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            First Seen
          </p>
          <p className="text-[12px] text-[var(--text-secondary)]">
            {new Date(ioc.first_seen).toLocaleDateString()}
          </p>
        </div>

        {/* Last Seen */}
        <div>
          <p className="text-[11px] text-[var(--text-tertiary)] mb-1 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Last Seen
          </p>
          <p className="text-[12px] text-[var(--text-secondary)]">
            {new Date(ioc.last_seen).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Related Incidents */}
      <div className="enterprise-card p-3 bg-[var(--bg-tertiary)] border border-[var(--border-primary)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[var(--color-high)]" />
            <p className="text-[12px] text-[var(--text-secondary)]">Related Incidents</p>
          </div>
          <span className="text-[14px] font-bold text-[var(--text-primary)]">
            {relatedIncidents}
          </span>
        </div>
      </div>

      {/* Source */}
      <div className="mt-3">
        <p className="text-[11px] text-[var(--text-tertiary)] mb-1">Source</p>
        <p className="text-[12px] text-[var(--text-secondary)]">{ioc.source}</p>
      </div>
    </div>
  );
};
