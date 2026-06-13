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
  const colorHex = color.includes('#') ? color : '#8B5CF6';
  
  return (
    <div className="dark:bg-[rgba(8,16,32,0.85)] bg-white border dark:border-[rgba(139,92,246,0.25)] border-slate-200 rounded-xl p-5 h-[160px] flex flex-col relative overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-400 pointer-events-none" style={{
        background: `radial-gradient(circle at 50% 0%, ${colorHex}15, transparent 60%)`,
      }} />
      <div className="flex items-center gap-4 mb-4 relative z-10">
        <div className="w-10 h-10 rounded-full flex items-center justify-center border border-[rgba(139,92,246,0.3)] bg-[rgba(139,92,246,0.1)]" style={{ color: colorHex, boxShadow: `0 0 20px ${colorHex}30` }}>
          {icon}
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] dark:text-slate-400 text-slate-600">{title}</p>
      </div>
      <h3 className="text-3xl font-bold tracking-tight dark:text-[#F8FAFC] text-[#0F172A] mb-1 relative z-10">
        {value}
      </h3>
      {change && (
        <div className="flex items-center gap-2 mb-auto relative z-10">
          <span className={`text-xs font-semibold ${positive ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
            {positive ? '↑' : '↓'} {change}
          </span>
          <span className="text-[11px] dark:text-slate-500 text-slate-400">vs yesterday</span>
        </div>
      )}
      {subtitle && (
        <p className="text-[11px] dark:text-slate-400 text-slate-500 mb-auto relative z-10">{subtitle}</p>
      )}
      <div className="mt-auto -mx-5 -mb-5 h-12 w-[calc(100%+40px)] relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line
              type="monotone"
              dataKey="y"
              stroke={colorHex}
              strokeWidth={3}
              fill={`${colorHex}18`}
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
