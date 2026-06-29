import React, { useEffect, useState, useCallback } from 'react';
import { Search, X, FileText, Shield, Globe, AlertTriangle, Command } from 'lucide-react';
import { useSearchStore } from '../../store/useSearchStore';
import { useSelectedThreatStore } from '../../store/useSelectedThreatStore';
import { useIncidents } from '../../hooks/useIncidents';
import { useThreats } from '../../hooks/useThreats';

const typeIcons = {
  incident: <FileText className="w-4 h-4" />,
  threat: <Shield className="w-4 h-4" />,
  asset: <Globe className="w-4 h-4" />,
  ioc: <AlertTriangle className="w-4 h-4" />,
};

const typeColors = {
  incident: 'text-blue-400',
  threat: 'text-red-400',
  asset: 'text-green-400',
  ioc: 'text-purple-400',
};

export const CommandPalette: React.FC = () => {
  const { isOpen, query, results, setQuery, setResults, close } = useSearchStore();
  const { setSelectedThreat } = useSelectedThreatStore();
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Fetch data for search
  const { data: incidents = [] } = useIncidents({ limit: 100 });
  const { data: threats = [] } = useThreats({ limit: 100 });

  // Mock data for assets and IOCs
  const mockAssets = [
    { id: 'asset-1', name: 'Server-001', type: 'Server', ip: '192.168.1.1' },
    { id: 'asset-2', name: 'Workstation-045', type: 'Workstation', ip: '192.168.1.45' },
    { id: 'asset-3', name: 'Database-Primary', type: 'Database', ip: '192.168.1.100' },
  ];

  const mockIOCs = [
    { id: 'ioc-1', value: '192.168.1.50', type: 'IPv4', severity: 'High' },
    { id: 'ioc-2', value: 'malicious-domain.com', type: 'Domain', severity: 'Critical' },
    { id: 'ioc-3', value: 'abc123def456', type: 'SHA256', severity: 'Medium' },
  ];

  // Perform search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }

    const searchLower = query.toLowerCase();
    const searchResults: any[] = [];

    // Search incidents
    incidents.forEach((incident: any) => {
      const title = incident.title || `Incident #${incident.id}`;
      const subtitle = incident.status || 'Unknown';
      if (
        title.toLowerCase().includes(searchLower) ||
        subtitle.toLowerCase().includes(searchLower)
      ) {
        searchResults.push({
          id: incident.id,
          type: 'incident',
          title,
          subtitle,
          data: incident,
        });
      }
    });

    // Search threats
    threats.forEach((threat: any) => {
      const title = threat.indicator || threat.threat_type || 'Unknown Threat';
      const subtitle = `${threat.severity} - ${threat.source}`;
      if (
        title.toLowerCase().includes(searchLower) ||
        subtitle.toLowerCase().includes(searchLower) ||
        threat.country?.toLowerCase().includes(searchLower)
      ) {
        searchResults.push({
          id: threat.id,
          type: 'threat',
          title,
          subtitle,
          data: threat,
        });
      }
    });

    // Search assets
    mockAssets.forEach((asset) => {
      const title = asset.name;
      const subtitle = `${asset.type} - ${asset.ip}`;
      if (
        title.toLowerCase().includes(searchLower) ||
        subtitle.toLowerCase().includes(searchLower)
      ) {
        searchResults.push({
          id: asset.id,
          type: 'asset',
          title,
          subtitle,
          data: asset,
        });
      }
    });

    // Search IOCs
    mockIOCs.forEach((ioc) => {
      const title = ioc.value;
      const subtitle = `${ioc.type} - ${ioc.severity}`;
      if (
        title.toLowerCase().includes(searchLower) ||
        subtitle.toLowerCase().includes(searchLower)
      ) {
        searchResults.push({
          id: ioc.id,
          type: 'ioc',
          title,
          subtitle,
          data: ioc,
        });
      }
    });

    setResults(searchResults);
    setSelectedIndex(0);
  }, [query, incidents, threats, setResults]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter' && results.length > 0) {
        e.preventDefault();
        const selected = results[selectedIndex];
        // Set selected threat if result is a threat
        if (selected.type === 'threat') {
          setSelectedThreat(selected.data);
        }
        console.log('Selected:', selected);
        close();
      } else if (e.key === 'Escape') {
        close();
      }
    },
    [results, selectedIndex, close, setSelectedThreat]
  );

  // Close on backdrop click
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      close();
    }
  }, [close]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-2xl mx-4">
        <div className="enterprise-card bg-[var(--bg-primary)] border border-[var(--border-primary)] shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-primary)]">
            <Search className="w-5 h-5 text-[var(--text-tertiary)]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search incidents, threats, assets, IOCs..."
              className="flex-1 bg-transparent border-0 text-[14px] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 text-[10px] text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded">
                ESC
              </kbd>
              <button
                onClick={close}
                className="p-1 rounded hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                <X className="w-4 h-4 text-[var(--text-tertiary)]" />
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto">
            {query.trim() === '' ? (
              <div className="p-8 text-center">
                <Search className="w-12 h-12 mx-auto text-[var(--text-tertiary)] mb-4" />
                <p className="text-[14px] text-[var(--text-secondary)] mb-2">
                  Search across OrionWatch
                </p>
                <p className="text-[12px] text-[var(--text-tertiary)]">
                  Type to search incidents, threats, assets, and IOCs
                </p>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <kbd className="px-2 py-1 text-[10px] text-[var(--text-tertiary)] bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded">
                    <Command className="w-3 h-3 inline mr-1" />
                    K
                  </kbd>
                  <span className="text-[11px] text-[var(--text-tertiary)]">to open</span>
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-[14px] text-[var(--text-secondary)]">No results found</p>
              </div>
            ) : (
              <div className="py-2">
                {results.map((result, index) => (
                  <div
                    key={result.id}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                      index === selectedIndex ? 'bg-[var(--bg-tertiary)]' : 'hover:bg-[var(--bg-tertiary)]'
                    }`}
                    onClick={() => {
                      // Set selected threat if result is a threat
                      if (result.type === 'threat') {
                        setSelectedThreat(result.data);
                      }
                      console.log('Selected:', result);
                      close();
                    }}
                  >
                    <div className={`p-2 rounded bg-[var(--bg-tertiary)] ${typeColors[result.type as keyof typeof typeColors]}`}>
                      {typeIcons[result.type as keyof typeof typeIcons]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-[var(--text-primary)] truncate">
                        {result.title}
                      </p>
                      <p className="text-[11px] text-[var(--text-secondary)] truncate">
                        {result.subtitle}
                      </p>
                    </div>
                    <span className="text-[10px] uppercase text-[var(--text-tertiary)]">
                      {result.type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-[var(--border-primary)] flex items-center justify-between">
            <div className="flex items-center gap-4 text-[10px] text-[var(--text-tertiary)]">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded">↵</kbd>
                Select
              </span>
            </div>
            <span className="text-[10px] text-[var(--text-tertiary)]">
              {results.length} result{results.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
