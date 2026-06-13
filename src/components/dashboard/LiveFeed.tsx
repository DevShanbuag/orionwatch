
import { useRef, useState, useCallback, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import ThreatFeedRow from './ThreatFeedRow';

interface LiveFeedItem {
  time: string;
  ip: string;
  type: string;
  source: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  details: Record<string, string>;
}

interface LiveFeedProps {
  items: LiveFeedItem[];
}

export const LiveFeed = ({ items }: LiveFeedProps) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [expandedIndices, setExpandedIndices] = useState<Set<number>>(new Set());
  const [rowHeights, setRowHeights] = useState<Map<number, number>>(new Map());
  const prevItemCountRef = useRef(items.length);

  const toggleExpand = useCallback((index: number) => {
    setExpandedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  const handleMeasure = useCallback((index: number, height: number) => {
    setRowHeights((prev) => {
      const next = new Map(prev);
      if (next.get(index) !== height) {
        next.set(index, height);
      }
      return next;
    });
  }, []);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      return rowHeights.get(index) || 64;
    },
    overscan: 10,
  });

  // Scroll preservation for new items prepended
  useEffect(() => {
    const currentCount = items.length;
    const addedCount = currentCount - prevItemCountRef.current;
    if (addedCount > 0 && parentRef.current) {
      const scrollParent = parentRef.current;
      const addedHeight = addedCount * 64; // Estimate added height with collapsed rows
      scrollParent.scrollTop += addedHeight;
    }
    prevItemCountRef.current = currentCount;
  }, [items.length]);

  // Measure when virtualizer changes
  useEffect(() => {
    virtualizer.measure();
  }, [rowHeights, virtualizer]);

  return (
    <div
      ref={parentRef}
      className="glass-card p-4 overflow-auto"
      style={{ height: '500px' }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <ThreatFeedRow
              item={items[virtualItem.index]}
              index={virtualItem.index}
              isExpanded={expandedIndices.has(virtualItem.index)}
              onToggle={toggleExpand}
              onMeasure={handleMeasure}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to generate mock large data for testing
export const generateMockLiveFeed = (count: number = 10000): LiveFeedItem[] => {
  const sources = ['AbuseIPDB', 'URLhaus', 'VirusTotal', 'Internal Sensor', 'OTX'];
  const severities: ('Low' | 'Medium' | 'High' | 'Critical')[] = ['Low', 'Medium', 'High', 'Critical'];
  const types = ['Malicious IP Address', 'Phishing URL', 'Suspicious Behavior', 'C2 Communication', 'Port Scan', 'Botnet Activity'];
  
  return Array.from({ length: count }, (_, i) => {
    const time = new Date(Date.now() - i * 1000).toLocaleTimeString('en-US', { hour12: false });
    const ip = `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
    return {
      time,
      ip,
      type: types[Math.floor(Math.random() * types.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      details: {
        attackType: 'Brute Force',
        port: '22',
        location: 'Unknown',
      },
    };
  });
};
