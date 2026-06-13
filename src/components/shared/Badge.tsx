import React from 'react';

type Severity = 'Critical' | 'High' | 'Medium' | 'Low';
type CacheStatus = 'Cached' | 'Live';

interface BadgeProps {
  severity?: Severity;
  cacheStatus?: CacheStatus;
  children: React.ReactNode;
}

const severityColors: Record<Severity, string> = {
  Critical: 'dark:bg-red-500/20 bg-red-50 dark:text-red-400 text-red-600 dark:border border-red-500/30',
  High: 'dark:bg-orange-500/20 bg-orange-50 dark:text-orange-400 text-orange-600 dark:border border-orange-500/30',
  Medium: 'dark:bg-yellow-500/20 bg-yellow-50 dark:text-yellow-400 text-yellow-600 dark:border border-yellow-500/30',
  Low: 'dark:bg-green-500/20 bg-green-50 dark:text-green-400 text-green-600 dark:border border-green-500/30',
};

const cacheStatusColors: Record<CacheStatus, string> = {
  Cached: 'dark:bg-blue-500/20 bg-blue-50 dark:text-blue-400 text-blue-600 dark:border border-blue-500/30',
  Live: 'dark:bg-purple-500/20 bg-purple-50 dark:text-purple-400 text-purple-600 dark:border border-purple-500/30',
};

export const Badge: React.FC<BadgeProps> = ({ severity, cacheStatus, children }) => {
  let className = 'px-3 py-1 rounded-md text-xs font-medium';
  
  if (severity) {
    className += ` ${severityColors[severity]}`;
  } else if (cacheStatus) {
    className += ` ${cacheStatusColors[cacheStatus]}`;
  }
  
  return (
    <span className={className}>
      {children}
    </span>
  );
};
