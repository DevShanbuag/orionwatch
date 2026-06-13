import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const chartData = [
  { time: '00:00', total: 45, high: 8, blocked: 37 },
  { time: '02:00', total: 38, high: 5, blocked: 33 },
  { time: '04:00', total: 52, high: 12, blocked: 40 },
  { time: '06:00', total: 68, high: 18, blocked: 50 },
  { time: '08:00', total: 75, high: 22, blocked: 53 },
  { time: '10:00', total: 120, high: 30, blocked: 90 },
  { time: '12:00', total: 150, high: 35, blocked: 115 },
  { time: '14:00', total: 180, high: 42, blocked: 138 },
  { time: '16:00', total: 250, high: 55, blocked: 195 },
  { time: '18:00', total: 400, high: 85, blocked: 315 },
  { time: '20:00', total: 600, high: 120, blocked: 480 },
  { time: '22:00', total: 812, high: 186, blocked: 672 },
];

const renderLabel = (props: any, value: number, color: string) => {
  const { x, y } = props;
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect
        x={10}
        y={-14}
        width={60}
        height={28}
        rx={6}
        fill={color}
        fillOpacity={0.2}
        stroke={color}
        strokeWidth={1.5}
      />
      <text
        x={40}
        y={5}
        textAnchor="middle"
        fill={color}
        fontSize={12}
        fontWeight="bold"
      >
        {value}
      </text>
    </g>
  );
};

export const ThreatChart: React.FC = () => {
  const [showBlocked, setShowBlocked] = useState(true);
  const [showHighSeverity, setShowHighSeverity] = useState(true);
  const [timeRange, setTimeRange] = useState('Last 24 Hours');

  return (
    <div className="dark:bg-[rgba(8,16,32,0.85)] bg-white border dark:border-[rgba(139,92,246,0.2)] border-slate-200 rounded-xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold dark:text-[#F8FAFC] text-[#0F172A]">Threat Activity Over Time</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="text-[11px] dark:text-slate-500 text-slate-500 px-3 py-1 rounded-full dark:bg-[rgba(255,255,255,0.05)] bg-slate-100 border dark:border-[rgba(255,255,255,0.08)] border-slate-200 focus:outline-none"
        >
          <option>Last 24 Hours</option>
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
        </select>
      </div>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#8B5CF6]" />
          <span className="text-[11px] dark:text-slate-400 text-slate-600">Total Threats</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
          <span className="text-[11px] dark:text-slate-400 text-slate-600">High Severity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#22C55E]" />
          <span className="text-[11px] dark:text-slate-400 text-slate-600">Blocked</span>
        </div>
        <button
          onClick={() => setShowBlocked(!showBlocked)}
          className="flex items-center gap-2"
        >
          <div className={`w-3 h-3 rounded-full ${showBlocked ? 'bg-[#22C55E]' : 'border border-slate-500'}`} />
          <span className="text-[11px] dark:text-slate-500 text-slate-500">Show Blocked</span>
        </button>
        <button
          onClick={() => setShowHighSeverity(!showHighSeverity)}
          className="flex items-center gap-2"
        >
          <div className={`w-3 h-3 rounded-full ${showHighSeverity ? 'bg-[#EF4444]' : 'border border-slate-500'}`} />
          <span className="text-[11px] dark:text-slate-500 text-slate-500">Show High Severity</span>
        </button>
      </div>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 100, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 2" stroke="rgba(148,163,184,0.15)" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="rgba(148,163,184,0.5)"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="rgba(148,163,184,0.5)"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#05070E',
                borderColor: 'rgba(139,92,246,0.25)',
                borderRadius: '10px',
                padding: '12px',
                fontSize: '11px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
              }}
              itemStyle={{ fontSize: '11px', fontWeight: 600, padding: '3px 0' }}
              labelStyle={{ color: '#94A3B8', fontSize: '10px', marginBottom: '6px', fontWeight: 600 }}
              cursor={{ stroke: 'rgba(139,92,246,0.3)', strokeWidth: 1 }}
            />
            <Line
              type="monotone"
              dataKey="total"
              name="Total Threats"
              stroke="#8B5CF6"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, stroke: '#05070E', fill: '#8B5CF6' }}
              activeDot={{ r: 6, strokeWidth: 3, stroke: '#05070E', fill: '#8B5CF6' }}
              strokeLinecap="round"
              strokeLinejoin="round"
              label={(props) => props.index === chartData.length - 1 ? renderLabel(props, 812, '#8B5CF6') : null}
            />
            {showHighSeverity && (
              <Line
                type="monotone"
                dataKey="high"
                name="High Severity"
                stroke="#EF4444"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, stroke: '#05070E', fill: '#EF4444' }}
                activeDot={{ r: 6, strokeWidth: 3, stroke: '#05070E', fill: '#EF4444' }}
                strokeLinecap="round"
                strokeLinejoin="round"
                label={(props) => props.index === chartData.length - 1 ? renderLabel(props, 186, '#EF4444') : null}
              />
            )}
            {showBlocked && (
              <Line
                type="monotone"
                dataKey="blocked"
                name="Blocked"
                stroke="#22C55E"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, stroke: '#05070E', fill: '#22C55E' }}
                activeDot={{ r: 6, strokeWidth: 3, stroke: '#05070E', fill: '#22C55E' }}
                strokeLinecap="round"
                strokeLinejoin="round"
                label={(props) => props.index === chartData.length - 1 ? renderLabel(props, 672, '#22C55E') : null}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
