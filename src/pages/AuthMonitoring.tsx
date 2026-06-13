import React from 'react';
import { Card } from '../components/shared/Card';
import { DataTable } from '../components/shared/DataTable';
import { StatusIndicator } from '../components/shared/StatusIndicator';
import { useAuthStore } from '../store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const loginAttempts = [
  { time: '00:00', success: 15, failed: 3 },
  { time: '04:00', success: 8, failed: 1 },
  { time: '08:00', success: 45, failed: 8 },
  { time: '12:00', success: 30, failed: 2 },
  { time: '16:00', success: 50, failed: 5 },
  { time: '20:00', success: 20, failed: 1 },
];

export const AuthMonitoring: React.FC = () => {
  const { authEvents } = useAuthStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      <h1 className="text-2xl font-bold">Authentication Monitoring</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Login Attempts</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={loginAttempts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Bar dataKey="success" fill="#10b981" />
                <Bar dataKey="failed" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-4">
          <Card>
            <h3 className="text-lg font-semibold mb-4">Passkey Statistics</h3>
            <div className="text-center py-6">
              <div className="text-4xl font-bold text-cyber-400 mb-2">72%</div>
              <p className="text-slate-400">of users use passkeys</p>
            </div>
          </Card>
          <Card>
            <h3 className="text-lg font-semibold mb-4">Device Activity</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Desktop</span>
                <span className="text-cyber-400">65%</span>
              </div>
              <div className="flex justify-between">
                <span>Mobile</span>
                <span className="text-cyber-400">30%</span>
              </div>
              <div className="flex justify-between">
                <span>Tablet</span>
                <span className="text-cyber-400">5%</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Auth Events</h3>
        <DataTable
          columns={[
            { key: 'user', header: 'User' },
            { key: 'device', header: 'Device' },
            { key: 'location', header: 'Location' },
            { key: 'method', header: 'Method' },
            { key: 'status', header: 'Status' },
            { key: 'time', header: 'Time' },
          ]}
          data={authEvents}
          renderRow={(item) => (
            <tr key={item.id} className="border-b border-slate-800 hover:bg-slate-800/30">
              <td className="py-3 px-4">{item.username}</td>
              <td className="py-3 px-4 text-slate-400">{item.device}</td>
              <td className="py-3 px-4">{item.location}</td>
              <td className="py-3 px-4">{item.method}</td>
              <td className="py-3 px-4">
                <StatusIndicator status={item.status} />
              </td>
              <td className="py-3 px-4 text-slate-400 text-sm">
                {new Date(item.timestamp).toLocaleTimeString()}
              </td>
            </tr>
          )}
        />
      </Card>
    </motion.div>
  );
};
