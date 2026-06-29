import React, { useState } from 'react';
import { Card } from '../components/shared/Card';
import { Badge } from '../components/shared/Badge';
import { DataTable } from '../components/shared/DataTable';
import { SearchInput } from '../components/shared/SearchInput';
import { useThreats } from '../hooks/useThreats';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { Threat } from '../types/threat';

const ThreatIntelligence: React.FC = () => {
  const { data: threats = [], isLoading } = useThreats();
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [selectedThreat, setSelectedThreat] = useState<Threat | null>(null);

  // Transform threats for display to match expected structure
  const displayThreats = threats.map((threat) => ({
    id: threat.id,
    type: threat.threat_type,
    severity: threat.severity,
    source: threat.source,
    country: threat.country,
    ip: threat.indicator,
    timestamp: threat.first_seen,
    description: `${threat.threat_type} from ${threat.source} with ${threat.confidence}% confidence`,
  }));

  const filteredThreats = displayThreats.filter(
    (t) =>
      (t.type.toLowerCase().includes(search.toLowerCase()) ||
        t.country.toLowerCase().includes(search.toLowerCase()) ||
        t.ip.toLowerCase().includes(search.toLowerCase())) &&
      (severityFilter === 'All' || t.severity === severityFilter)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Threat Intelligence</h1>
        <span className="text-sm text-gray-400">
          {isLoading ? 'Loading...' : `${displayThreats.length} threats`}
        </span>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="w-64">
          <SearchInput value={search} onChange={setSearch} placeholder="Search threats..." />
        </div>
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="enterprise-input px-4 py-2"
        >
          <option value="All">All Severities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <Card>
        <DataTable
          columns={[
            { key: 'type', header: 'Type' },
            { key: 'severity', header: 'Severity' },
            { key: 'source', header: 'Source' },
            { key: 'country', header: 'Country' },
            { key: 'ip', header: 'IP Address' },
            { key: 'timestamp', header: 'Timestamp' },
          ]}
          data={filteredThreats}
          renderRow={(item) => {
            const originalThreat = threats.find((t) => t.id === item.id);
            return (
              <tr
                key={item.id}
                className="cursor-pointer"
                onClick={() => setSelectedThreat(originalThreat || null)}
              >
                <td className="text-body">{item.type}</td>
                <td className="text-body">
                  <Badge severity={item.severity}>{item.severity}</Badge>
                </td>
                <td className="text-body">{item.source}</td>
                <td className="text-body">{item.country}</td>
                <td className="text-body font-mono text-[var(--text-secondary)]">{item.ip}</td>
                <td className="text-body text-[var(--text-secondary)]">
                  {new Date(item.timestamp).toLocaleString()}
                </td>
              </tr>
            );
          }}
        />
      </Card>

      <AnimatePresence>
        {selectedThreat && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed right-0 top-0 bottom-0 w-96 enterprise-card p-6 z-50"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[16px] font-bold text-[var(--text-primary)]">Threat Details</h2>
              <button onClick={() => setSelectedThreat(null)} className="p-2 hover:bg-[var(--bg-tertiary)] rounded-none">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-muted">Type</p>
                <p className="text-header">{selectedThreat.threat_type}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Severity</p>
                <Badge severity={selectedThreat.severity}>{selectedThreat.severity}</Badge>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Source</p>
                <p className="font-medium">{selectedThreat.source}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Country</p>
                <p className="font-medium">{selectedThreat.country}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Indicator</p>
                <p className="font-mono text-sm">{selectedThreat.indicator}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Confidence</p>
                <p className="font-medium">{selectedThreat.confidence}%</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Status</p>
                <p className="font-medium">{selectedThreat.status}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">First Seen</p>
                <p className="font-medium">{new Date(selectedThreat.first_seen).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Last Seen</p>
                <p className="font-medium">{new Date(selectedThreat.last_seen).toLocaleString()}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ThreatIntelligence;
