
import React, { useState } from 'react';
import { Card } from '../components/shared/Card';
import { Badge } from '../components/shared/Badge';
import { SearchInput } from '../components/shared/SearchInput';
import { Search, Shield, Globe, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const IPIntelligence: React.FC = () => {
  const [ip, setIp] = useState('');
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<unknown>(null);
  const [cacheHit, setCacheHit] = useState<boolean>(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ip.trim()) return;
    
    setSearching(true);
    try {
      const res = await fetch('http://localhost:3000/api/ip/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip })
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
        setCacheHit(!!data.cache_hit);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">IP Intelligence</h1>
        {result && (
          <Badge cacheStatus={cacheHit ? 'Cached' : 'Live'}>
            {cacheHit ? 'Cached' : 'Live'}
          </Badge>
        )}
      </div>

      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="flex-1">
          <SearchInput
            value={ip}
            onChange={setIp}
            placeholder="Enter IP address..."
          />
        </div>
        <button
          type="submit"
          disabled={searching}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg disabled:opacity-50 flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          {searching ? 'Searching...' : 'Search'}
        </button>
      </form>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* AbuseIPDB Results */}
          {result.abuseipdb && (
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-purple-500" />
                <h3 className="font-semibold">AbuseIPDB</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Abuse Score</span>
                  <span className="font-mono">{result.abuseipdb.data?.abuseConfidenceScore ?? 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Country</span>
                  <span>{result.abuseipdb.data?.countryName ?? 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Reports</span>
                  <span className="font-mono">{result.abuseipdb.data?.totalReports ?? 0}</span>
                </div>
              </div>
            </Card>
          )}

          {/* OTX Results */}
          {result.otx && (
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold">OTX</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Pulse Count</span>
                  <span className="font-mono">{result.otx.pulse_info?.count ?? 0}</span>
                </div>
              </div>
            </Card>
          )}

          {/* Supabase Results */}
          {(result as { supabase?: unknown[] })?.supabase?.length > 0 && (
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold">Local Threats</h3>
              </div>
              <div className="space-y-2">
                {(result as { supabase?: Array<{ threat_type?: string; country?: string }> })?.supabase?.map((t, i) => (
                  <div key={i} className="text-sm">
                    <p className="font-medium">{t.threat_type}</p>
                    <p className="text-slate-400">{t.country}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default IPIntelligence;
