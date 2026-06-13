import React, { useState, useEffect } from 'react';
import { Card } from '../components/shared/Card';
import { Badge } from '../components/shared/Badge';
import { MetricCard } from '../components/shared/MetricCard';
import { SearchInput } from '../components/shared/SearchInput';
import { useIncidentStore, type Incident } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, AlertTriangle, AlertCircle, Info, CheckCircle, Edit2, Trash2 } from 'lucide-react';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

const getStatusIcon = (status: Incident['status']) => {
  switch (status) {
    case 'Open':
      return <AlertTriangle className="w-5 h-5" />;
    case 'Investigating':
      return <AlertCircle className="w-5 h-5" />;
    case 'Resolved':
      return <CheckCircle className="w-5 h-5" />;
    case 'Closed':
      return <Info className="w-5 h-5" />;
  }
};

export const Incidents: React.FC = () => {
  const { 
    incidents, 
    stats, 
    selectedIncident, 
    fetchIncidents, 
    fetchStats, 
    setSelectedIncident,
    createIncident,
    updateIncident,
    deleteIncident
  } = useIncidentStore();
  
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncident, setEditingIncident] = useState<Incident | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    severity: 'Medium' as const,
    description: '',
    status: 'Open' as const
  });

  useEffect(() => {
    fetchIncidents();
    fetchStats();
  }, [fetchIncidents, fetchStats]);

  const filteredIncidents = incidents.filter(
    (incident) =>
      (incident.title.toLowerCase().includes(search.toLowerCase()) ||
        incident.description.toLowerCase().includes(search.toLowerCase())) &&
      (severityFilter === 'All' || incident.severity === severityFilter) &&
      (statusFilter === 'All' || incident.status === statusFilter)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIncident) {
      updateIncident(editingIncident.id, formData);
    } else {
      createIncident(formData);
    }
    setIsModalOpen(false);
    setEditingIncident(null);
    setFormData({
      title: '',
      severity: 'Medium',
      description: '',
      status: 'Open'
    });
  };

  const handleEdit = (incident: Incident) => {
    setEditingIncident(incident);
    setFormData({
      title: incident.title,
      severity: incident.severity,
      description: incident.description,
      status: incident.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this incident?')) {
      deleteIncident(id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Incidents</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setEditingIncident(null);
            setFormData({
              title: '',
              severity: 'Medium',
              description: '',
              status: 'Open'
            });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl font-semibold transition-all duration-200"
        >
          <Plus size={18} />
          New Incident
        </motion.button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <MetricCard
          title="Total Incidents"
          value={stats.total_incidents.toLocaleString()}
          icon={<AlertTriangle className="w-7 h-7" />}
          change="+5%"
          positive={false}
          sparklineData={[10, 15, 12, 18, 14, 20, 17]}
          color="text-[#8B5CF6]"
          index={0}
        />
        <MetricCard
          title="Open Incidents"
          value={stats.open_incidents.toLocaleString()}
          icon={<AlertCircle className="w-7 h-7" />}
          change="-3%"
          positive={true}
          sparklineData={[8, 6, 9, 7, 10, 8, 12]}
          color="text-[#EF4444]"
          index={1}
        />
        <MetricCard
          title="Resolved Today"
          value={stats.resolved_today.toLocaleString()}
          icon={<CheckCircle className="w-7 h-7" />}
          change="+20%"
          positive={true}
          sparklineData={[3, 5, 4, 6, 7, 5, 8]}
          color="text-[#22C55E]"
          index={2}
        />
        <MetricCard
          title="Critical Incidents"
          value={stats.critical_incidents.toLocaleString()}
          icon={<AlertTriangle className="w-7 h-7" />}
          change="0%"
          positive={false}
          sparklineData={[2, 3, 2, 4, 3, 2, 3]}
          color="text-[#F59E0B]"
          index={3}
        />
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="w-64">
          <SearchInput value={search} onChange={setSearch} placeholder="Search incidents..." />
        </div>
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="dark:bg-[rgba(15,26,46,1)] bg-slate-50 border dark:border-[rgba(139,92,246,0.3)] border-slate-200 rounded-lg px-4 py-2 text-sm font-semibold dark:text-slate-300 text-slate-700 focus:outline-none focus:border-[#8B5CF6] transition-all duration-200"
        >
          <option value="All">All Severities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="dark:bg-[rgba(15,26,46,1)] bg-slate-50 border dark:border-[rgba(139,92,246,0.3)] border-slate-200 rounded-lg px-4 py-2 text-sm font-semibold dark:text-slate-300 text-slate-700 focus:outline-none focus:border-[#8B5CF6] transition-all duration-200"
        >
          <option value="All">All Statuses</option>
          <option value="Open">Open</option>
          <option value="Investigating">Investigating</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      <Card>
        <div className="overflow-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b dark:border-[rgba(139,92,246,0.2)] border-slate-200">
                <th className="pb-4 font-semibold dark:text-slate-400 text-slate-500 tracking-[0.08em] uppercase" style={{fontSize: '13px', lineHeight: '1.4'}}>Created</th>
                <th className="pb-4 font-semibold dark:text-slate-400 text-slate-500 tracking-[0.08em] uppercase" style={{fontSize: '13px', lineHeight: '1.4'}}>Title</th>
                <th className="pb-4 font-semibold dark:text-slate-400 text-slate-500 tracking-[0.08em] uppercase" style={{fontSize: '13px', lineHeight: '1.4'}}>Severity</th>
                <th className="pb-4 font-semibold dark:text-slate-400 text-slate-500 tracking-[0.08em] uppercase" style={{fontSize: '13px', lineHeight: '1.4'}}>Status</th>
                <th className="pb-4 font-semibold dark:text-slate-400 text-slate-500 tracking-[0.08em] uppercase text-right" style={{fontSize: '13px', lineHeight: '1.4'}}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-[rgba(31,42,63,0.3)] divide-slate-200">
              <AnimatePresence initial={false}>
                {filteredIncidents.map((incident, idx) => (
                  <motion.tr
                    key={incident.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 + idx * 0.05 }}
                    onClick={() => setSelectedIncident(incident)}
                    className={`cursor-pointer hover:dark:bg-[rgba(139,92,246,0.08)] hover:bg-slate-50 transition-colors duration-200 border-l-2 border-transparent hover:border-l-[#8B5CF6]`}
                  >
                    <td className="py-4 text-xs font-semibold dark:text-slate-300 text-slate-700">{formatDate(incident.created_at)}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          incident.status === 'Open' ? 'bg-red-500/10 text-red-500' :
                          incident.status === 'Investigating' ? 'bg-yellow-500/10 text-yellow-500' :
                          incident.status === 'Resolved' ? 'bg-green-500/10 text-green-500' :
                          'bg-blue-500/10 text-blue-500'
                        }`}>
                          {getStatusIcon(incident.status)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold dark:text-[#F8FAFC] text-[#0F172A]">{incident.title}</p>
                          <p className="text-xs dark:text-slate-400 text-slate-500 truncate max-w-md">{incident.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <Badge severity={incident.severity}>{incident.severity}</Badge>
                    </td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        incident.status === 'Open' ? 'bg-red-500/10 text-red-500' :
                        incident.status === 'Investigating' ? 'bg-yellow-500/10 text-yellow-500' :
                        incident.status === 'Resolved' ? 'bg-green-500/10 text-green-500' :
                        'bg-blue-500/10 text-blue-500'
                      }`}>
                        {incident.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(incident);
                          }}
                          className="p-2 text-[#8B5CF6] hover:bg-[#8B5CF6]/10 rounded-lg transition-all duration-200"
                        >
                          <Edit2 size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(incident.id);
                          }}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="dark:bg-[#050b18] bg-white border dark:border-[rgba(139,92,246,0.3)] border-slate-200 rounded-2xl p-6 w-full max-w-lg shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold dark:text-[#F8FAFC] text-[#0F172A]">
                  {editingIncident ? 'Edit Incident' : 'New Incident'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 dark:hover:bg-[rgba(15,26,46,1)] hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold dark:text-slate-300 text-slate-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full dark:bg-[rgba(15,26,46,1)] bg-slate-50 border dark:border-[rgba(139,92,246,0.3)] border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold dark:text-slate-300 text-slate-700 focus:outline-none focus:border-[#8B5CF6] transition-all duration-200"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold dark:text-slate-300 text-slate-700 mb-2">Severity</label>
                    <select
                      value={formData.severity}
                      onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                      className="w-full dark:bg-[rgba(15,26,46,1)] bg-slate-50 border dark:border-[rgba(139,92,246,0.3)] border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold dark:text-slate-300 text-slate-700 focus:outline-none focus:border-[#8B5CF6] transition-all duration-200"
                    >
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold dark:text-slate-300 text-slate-700 mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full dark:bg-[rgba(15,26,46,1)] bg-slate-50 border dark:border-[rgba(139,92,246,0.3)] border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold dark:text-slate-300 text-slate-700 focus:outline-none focus:border-[#8B5CF6] transition-all duration-200"
                    >
                      <option value="Open">Open</option>
                      <option value="Investigating">Investigating</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold dark:text-slate-300 text-slate-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full dark:bg-[rgba(15,26,46,1)] bg-slate-50 border dark:border-[rgba(139,92,246,0.3)] border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold dark:text-slate-300 text-slate-700 focus:outline-none focus:border-[#8B5CF6] transition-all duration-200 resize-none"
                    required
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 dark:bg-[rgba(15,26,46,1)] bg-slate-100 border dark:border-[rgba(139,92,246,0.3)] border-slate-200 rounded-xl text-sm font-semibold dark:text-slate-300 text-slate-700 hover:dark:bg-[rgba(22,36,60,1)] hover:bg-slate-200 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl text-sm font-semibold transition-all duration-200"
                  >
                    {editingIncident ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Incident Details Sidebar */}
      <AnimatePresence>
        {selectedIncident && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed right-0 top-0 bottom-0 w-96 dark:bg-[#050b18] bg-white border-l dark:border-[rgba(139,92,246,0.3)] border-slate-200 p-6 z-50 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold dark:text-[#F8FAFC] text-[#0F172A]">Incident Details</h2>
              <button onClick={() => setSelectedIncident(null)} className="p-2 dark:hover:bg-[rgba(15,26,46,1)] hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold dark:text-slate-400 text-slate-500 tracking-[0.08em] uppercase mb-2">Title</p>
                <p className="text-lg font-semibold dark:text-[#F8FAFC] text-[#0F172A]">{selectedIncident.title}</p>
              </div>
              <div>
                <p className="text-xs font-bold dark:text-slate-400 text-slate-500 tracking-[0.08em] uppercase mb-2">Severity</p>
                <Badge severity={selectedIncident.severity}>{selectedIncident.severity}</Badge>
              </div>
              <div>
                <p className="text-xs font-bold dark:text-slate-400 text-slate-500 tracking-[0.08em] uppercase mb-2">Status</p>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  selectedIncident.status === 'Open' ? 'bg-red-500/10 text-red-500' :
                  selectedIncident.status === 'Investigating' ? 'bg-yellow-500/10 text-yellow-500' :
                  selectedIncident.status === 'Resolved' ? 'bg-green-500/10 text-green-500' :
                  'bg-blue-500/10 text-blue-500'
                }`}>
                  {selectedIncident.status}
                </span>
              </div>
              <div>
                <p className="text-xs font-bold dark:text-slate-400 text-slate-500 tracking-[0.08em] uppercase mb-2">Description</p>
                <p className="dark:text-slate-300 text-slate-700">{selectedIncident.description}</p>
              </div>
              <div>
                <p className="text-xs font-bold dark:text-slate-400 text-slate-500 tracking-[0.08em] uppercase mb-2">Created At</p>
                <p className="dark:text-slate-300 text-slate-700">{formatDate(selectedIncident.created_at)}</p>
              </div>
              <div className="pt-6 space-y-3">
                <button
                  onClick={() => handleEdit(selectedIncident)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl font-semibold transition-all duration-200"
                >
                  <Edit2 size={16} />
                  Edit Incident
                </button>
                <button
                  onClick={() => handleDelete(selectedIncident.id)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl font-semibold transition-all duration-200"
                >
                  <Trash2 size={16} />
                  Delete Incident
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
