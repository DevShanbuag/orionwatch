import React, { useState } from 'react';
import { Card } from '../components/shared/Card';
import { motion } from 'framer-motion';

const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6 max-w-4xl"
    >
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Theme Settings</h3>
        <div className="flex items-center justify-between py-3">
          <div>
            <p>Dark Mode</p>
            <p className="text-sm text-slate-400">Enable dark theme</p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-12 h-6 rounded-full transition-colors ${
              darkMode ? 'bg-cyber-500' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                darkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
        <div className="flex items-center justify-between py-3">
          <div>
            <p>Enable Notifications</p>
            <p className="text-sm text-slate-400">Receive alert notifications</p>
          </div>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`w-12 h-6 rounded-full transition-colors ${
              notifications ? 'bg-cyber-500' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                notifications ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-4">API Integrations</h3>
        <p className="text-slate-400 mb-4">Manage your API integrations</p>
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-slate-900/50 flex items-center justify-between">
            <span>OrionWatch API</span>
            <span className="text-slate-400 text-sm">Coming Soon</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/50 flex items-center justify-between">
            <span>OrionWatch Intelligence Engine</span>
            <span className="text-slate-400 text-sm">Coming Soon</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/50 flex items-center justify-between">
            <span>OrionWatch Threat Pipeline</span>
            <span className="text-slate-400 text-sm">Coming Soon</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/50 flex items-center justify-between">
            <span>OrionWatch Analytics</span>
            <span className="text-slate-400 text-sm">Coming Soon</span>
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-4">User Preferences</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Timezone</label>
            <select className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2">
              <option>UTC</option>
              <option>America/New_York</option>
              <option>Europe/London</option>
              <option>Asia/Tokyo</option>
            </select>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default Settings;
