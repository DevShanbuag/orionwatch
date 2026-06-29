import React from 'react';

type Severity = 'Critical' | 'High' | 'Medium' | 'Low';
type CacheStatus = 'Cached' | 'Live';

interface BadgeProps {
  severity?: Severity;
  cacheStatus?: CacheStatus;
  children: React.ReactNode;
}

const severityClasses: Record<Severity, string> = {
  Critical: 'badge-critical',
  High: 'badge-high',
  Medium: 'badge-medium',
  Low: 'badge-low',
};

const cacheStatusClasses: Record<CacheStatus, string> = {
  Cached: 'bg-[var(--color-info-bg)] text-[var(--color-info)] border border-[var(--color-info-border)] border-[var(--radius-md)] px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.05em]',
  Live: 'bg-[var(--color-success-bg)] text-[var(--color-success)] border border-[var(--color-success-border)] border-[var(--radius-md)] px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.05em]',
};

export const Badge: React.FC<BadgeProps> = ({ severity, cacheStatus, children }) => {
  let className = '';

  if (severity) {
    className = severityClasses[severity];
  } else if (cacheStatus) {
    className = cacheStatusClasses[cacheStatus];
  }

  return (
    <span className={className}>
      {children}
    </span>
  );
};
