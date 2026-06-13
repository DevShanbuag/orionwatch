
import React, { useState } from 'react';
import { Card } from '../components/shared/Card';
import { Badge } from '../components/shared/Badge';
import { SearchInput } from '../components/shared/SearchInput';
import { Search, Shield, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const URLIntelligence: React.FC = () => {
  const [url, setUrl] = useState('');
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<unknown>(null);
  const [cacheHit, setCacheHit] = useState<boolean>(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    
    setSearching(true);
    try {
      const res = await fetch('http://localhost:3000/api/url/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
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
        <h1 className="text-2xl font-bold">URL Intelligence</h1>
        {result && (
          <Badge cacheStatus={cacheHit ? 'Cached' : 'Live'}>
            {cacheHit ? 'Cached' : 'Live'}
          </Badge>
        )}
      </div>

      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="flex-1">
          <SearchInput
            value={url}
            onChange={setUrl}
            placeholder="Enter URL..."
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Placeholder cards for URL data sources */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-purple-500" />
              <h3 className="font-semibold">URLhaus</h3>
            </div>
            <div className="text-sm text-slate-400">
              URL data will appear here
            </div>
          </Card>
          
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold">VirusTotal</h3>
            </div>
            <div className="text-sm text-slate-400">
              URL analysis will appear here
            </div>
          </Card>
        </div>
      )}
    </motion.div>
  );
};

export default URLIntelligence;
