import React from 'react';

interface StatusIndicatorProps {
  status: string;
}

const statusColors: Record<string, string> = {
  Operational: 'bg-green-500',
  Degraded: 'bg-yellow-500',
  Down: 'bg-red-500',
  Success: 'bg-green-500',
  Failed: 'bg-red-500',
  Blocked: 'bg-orange-500',
};

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => (
  <span className="flex items-center gap-2">
    <span className={`w-2 h-2 rounded-full ${statusColors[status] || 'bg-slate-500'}`}></span>
    {status}
  </span>
);
