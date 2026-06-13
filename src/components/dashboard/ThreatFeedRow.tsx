
import React, { useRef, useLayoutEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface LiveFeedItem {
  time: string;
  ip: string;
  type: string;
  source: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  details: Record<string, string>;
}

interface ThreatFeedRowProps {
  item: LiveFeedItem;
  index: number;
  isExpanded: boolean;
  onToggle: (index: number) => void;
  onMeasure: (index: number, height: number) => void;
}

function ThreatFeedRow({ item, index, isExpanded, onToggle, onMeasure }: ThreatFeedRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (rowRef.current) {
      onMeasure(index, rowRef.current.offsetHeight);
    }
  }, [isExpanded, index, onMeasure]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'High':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'Medium':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div
      ref={rowRef}
      data-index={index}
      className="mb-2 rounded-lg border border-gray-700/30 bg-gray-800/40"
    >
      <div
        className="p-4 cursor-pointer flex items-center justify-between"
        style={{ height: '64px' }}
        onClick={() => onToggle(index)}
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-400">{item.time}</span>
            <span
              className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full border ${getSeverityColor(item.severity)}`}
            >
              {item.severity}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-purple-400">{item.source}</span>
        </div>
      </div>
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-700/30">
          <div className="space-y-2 pt-2">
            <p className="text-sm font-semibold">{item.type}</p>
            <p className="text-xs font-mono text-gray-400">{item.ip}</p>
            {Object.entries(item.details).length > 0 && (
              <div className="text-xs text-gray-500">
                {Object.entries(item.details).map(([key, value]) => (
                  <div key={key} className="flex gap-2">
                    <span className="capitalize">{key}:</span>
                    <span className="font-mono">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(ThreatFeedRow, (prev, next) => {
  return (
    prev.index === next.index &&
    prev.isExpanded === next.isExpanded &&
    prev.item.time === next.item.time &&
    prev.item.ip === next.item.ip &&
    prev.item.type === next.item.type &&
    prev.item.source === next.item.source &&
    prev.item.severity === next.item.severity
  );
});
