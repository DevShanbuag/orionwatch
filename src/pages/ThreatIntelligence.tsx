import React, { useState } from 'react';
import { Card } from '../components/shared/Card';
import { Badge } from '../components/shared/Badge';
import { DataTable } from '../components/shared/DataTable';
import { SearchInput } from '../components/shared/SearchInput';
import { useThreatStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const ThreatIntelligence: React.FC = () => {
  const { threats, selectedThreat, setSelectedThreat } = useThreatStore();
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('All');

  const filteredThreats = threats.filter(
    (t) =>
      (t.type.toLowerCase().includes(search.toLowerCase()) ||
        t.country.toLowerCase().includes(search.toLowerCase())) &&
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
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="w-64">
          <SearchInput value={search} onChange={setSearch} placeholder="Search threats..." />
        </div>
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-sm"
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
          renderRow={(item) => (
            <tr
              key={item.id}
              className="border-b border-slate-800 hover:bg-slate-800/30 cursor-pointer"
              onClick={() => setSelectedThreat(item)}
            >
              <td className="py-3 px-4">{item.type}</td>
              <td className="py-3 px-4">
                <Badge severity={item.severity}>{item.severity}</Badge>
              </td>
              <td className="py-3 px-4">{item.source}</td>
              <td className="py-3 px-4">{item.country}</td>
              <td className="py-3 px-4 font-mono text-sm text-slate-400">{item.ip}</td>
              <td className="py-3 px-4 text-slate-400 text-sm">
                {new Date(item.timestamp).toLocaleString()}
              </td>
            </tr>
          )}
        />
      </Card>

      <AnimatePresence>
        {selectedThreat && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed right-0 top-0 bottom-0 w-96 glassmorphism p-6 z-50"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Threat Details</h2>
              <button onClick={() => setSelectedThreat(null)} className="p-2 hover:bg-slate-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-slate-400 text-sm">Type</p>
                <p className="font-medium">{selectedThreat.type}</p>
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
                <p className="text-slate-400 text-sm">IP Address</p>
                <p className="font-mono text-sm">{selectedThreat.ip}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Description</p>
                <p className="text-slate-300">{selectedThreat.description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ThreatIntelligence;
