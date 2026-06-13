import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { LoadingSpinner } from './components/shared/LoadingSpinner';
import { IncidentPanel } from './components/dashboard/IncidentPanel';
import { useThemeStore } from './store/useThemeStore';

// Lazy-loaded pages
const Dashboard = lazy(() => import('./pages/OverviewDashboard'));
const Threats = lazy(() => import('./pages/ThreatIntelligence'));
const LiveFeed = lazy(() => import('./pages/ThreatIntelligence'));
const IPIntelligence = lazy(() => import('./pages/IPIntelligence'));
const URLIntelligence = lazy(() => import('./pages/URLIntelligence'));
const Assets = lazy(() => import('./pages/ThreatIntelligence'));
const Reports = lazy(() => import('./pages/ThreatIntelligence'));
const Playbooks = lazy(() => import('./pages/ThreatIntelligence'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <Router>
      <div className="grid grid-cols-[232px_1fr_320px] h-screen bg-[#050816] relative overflow-hidden">
        {/* Background stars */}
        <div id="bg-stars" className="absolute inset-0 z-0" />
        <Sidebar className="relative z-10" />
        <main className="relative z-10 overflow-y-auto">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/threats" element={<Threats />} />
              <Route path="/live-feed" element={<LiveFeed />} />
              <Route path="/ip-intel" element={<IPIntelligence />} />
              <Route path="/url-intel" element={<URLIntelligence />} />
              <Route path="/assets" element={<Assets />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/playbooks" element={<Playbooks />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/*" element={<Dashboard />} />
            </Routes>
          </Suspense>
        </main>
        <div className="relative z-10">
          <IncidentPanel />
        </div>
      </div>
    </Router>
  );
}

export default App;
