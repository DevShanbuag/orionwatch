import React from 'react';
import { Card } from '../components/shared/Card';
import { StatusIndicator } from '../components/shared/StatusIndicator';
import { useServiceStore } from '../store';
import { Server, Activity, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export const ServiceHealth: React.FC = () => {
  const { services } = useServiceStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      <h1 className="text-2xl font-bold">Service Health</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <Card key={service.id}>
            <div className="flex items-start justify-between mb-4">
              <Server className="w-8 h-8 text-cyber-400" />
              <StatusIndicator status={service.status} />
            </div>
            <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
            <div className="space-y-2 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span>Uptime: {service.uptime}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Latency: {service.latency}ms</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Service Dependencies</h3>
        <div className="flex items-center justify-center h-64 text-slate-400">
          Dependency graph visualization placeholder
        </div>
      </Card>
    </motion.div>
  );
};
