import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: string;
  positive?: boolean;
  sparklineData: number[];
  color: string;
  subtitle?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  change,
  positive,
  sparklineData,
  color,
  subtitle
}) => {
  const chartData = sparklineData.map((v, i) => ({ x: i, y: v }));
  const colorHex = color.includes('#') ? color : '#2563eb';

  return (
    <div className="enterprise-card p-4 h-[140px] flex flex-col relative overflow-hidden">
      <div className="flex items-center gap-3 mb-3">
        <div className="metric-icon-circle border border-[var(--border-primary)]" style={{ color: colorHex, backgroundColor: `${colorHex}10` }}>
          {icon}
        </div>
        <p className="text-label">{title}</p>
      </div>
      <h3 className="text-[24px] font-bold tracking-tight text-[var(--text-primary)] mb-2">
        {value}
      </h3>
      {change && (
        <div className="flex items-center gap-2 mb-auto">
          <span className={`text-[12px] font-semibold ${positive ? 'text-[var(--color-success)]' : 'text-[var(--color-critical)]'}`}>
            {positive ? '↑' : '↓'} {change}
          </span>
          <span className="text-[11px] text-[var(--text-tertiary)]">vs yesterday</span>
        </div>
      )}
      {subtitle && (
        <p className="text-[11px] text-[var(--text-tertiary)] mb-auto">{subtitle}</p>
      )}
      <div className="mt-auto h-6 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line
              type="monotone"
              dataKey="y"
              stroke={colorHex}
              strokeWidth={2}
              dot={false}
              activeDot={false}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
