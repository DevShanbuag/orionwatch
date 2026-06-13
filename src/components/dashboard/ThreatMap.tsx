import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AttackRoute {
  id: string;
  from: { lat: number; lng: number; name: string };
  to: { lat: number; lng: number; name: string };
  severity: 'critical' | 'high' | 'medium' | 'blocked';
  duration: number;
}

const attackRoutes: AttackRoute[] = [
  {
    id: 'russia-usa',
    from: { lat: 60, lng: 100, name: 'Russia' },
    to: { lat: 38, lng: -98, name: 'USA' },
    severity: 'critical',
    duration: 3
  },
  {
    id: 'china-germany',
    from: { lat: 35, lng: 105, name: 'China' },
    to: { lat: 51, lng: 10, name: 'Germany' },
    severity: 'high',
    duration: 3.5
  },
  {
    id: 'nk-japan',
    from: { lat: 40, lng: 127, name: 'North Korea' },
    to: { lat: 36, lng: 138, name: 'Japan' },
    severity: 'critical',
    duration: 2.5
  },
  {
    id: 'iran-uk',
    from: { lat: 32, lng: 53, name: 'Iran' },
    to: { lat: 55, lng: -3, name: 'UK' },
    severity: 'high',
    duration: 3.2
  },
  {
    id: 'brazil-usa',
    from: { lat: -15, lng: -50, name: 'Brazil' },
    to: { lat: 38, lng: -98, name: 'USA' },
    severity: 'medium',
    duration: 2.8
  },
  {
    id: 'india-canada',
    from: { lat: 20, lng: 77, name: 'India' },
    to: { lat: 60, lng: -95, name: 'Canada' },
    severity: 'blocked',
    duration: 3.8
  },
  {
    id: 'nigeria-sa',
    from: { lat: 9, lng: 8, name: 'Nigeria' },
    to: { lat: -25, lng: 133, name: 'Australia' },
    severity: 'medium',
    duration: 4
  },
  {
    id: 'mexico-eu',
    from: { lat: 23, lng: -102, name: 'Mexico' },
    to: { lat: 48, lng: 2, name: 'France' },
    severity: 'high',
    duration: 3.4
  },
  {
    id: 'southkorea-us',
    from: { lat: 37, lng: 127, name: 'South Korea' },
    to: { lat: 34, lng: -118, name: 'California' },
    severity: 'critical',
    duration: 3
  },
  {
    id: 'turkey-spain',
    from: { lat: 39, lng: 35, name: 'Turkey' },
    to: { lat: 40, lng: -4, name: 'Spain' },
    severity: 'medium',
    duration: 2.2
  }
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return '#EF4444';
    case 'high': return '#F59E0B';
    case 'medium': return '#38BDF8';
    case 'blocked': return '#22C55E';
    default: return '#8B5CF6';
  }
};

const PulseDot = ({ color, delay = 0, size = 12 }: { color: string; delay?: number; size?: number }) => (
  <div className="absolute transform -translate-x-1/2 -translate-y-1/2">
    <motion.div
      className="rounded-full absolute"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        boxShadow: `0 0 ${size}px ${color}`
      }}
      animate={{
        scale: [1, 1.5, 1],
        opacity: [1, 0.5, 1]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        delay,
        ease: 'easeInOut'
      }}
    />
    <div
      className="rounded-full relative z-10"
      style={{
        width: size * 0.6,
        height: size * 0.6,
        backgroundColor: color,
        left: size * 0.2,
        top: size * 0.2
      }}
    />
  </div>
);

const AttackArc = ({ route }: { route: AttackRoute }) => {
  const color = getSeverityColor(route.severity);
  
  // Calculate arc path using quadratic bezier
  const startX = `${50 + route.from.lng * 0.45}%`;
  const startY = `${50 - route.from.lat * 0.6}%`;
  const endX = `${50 + route.to.lng * 0.45}%`;
  const endY = `${50 - route.to.lat * 0.6}%`;
  
  const controlX = `${50 + (route.from.lng + route.to.lng) * 0.225}%`;
  const controlY = `${30 - Math.min(route.from.lat, route.to.lat) * 0.4}%`;

  return (
    <g>
      <defs>
        <filter id={`glow-${route.id}`}>
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id={`grad-${route.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0" />
          <stop offset="50%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
        </linearGradient>
      </defs>
      
      <path
        d={`M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`}
        fill="none"
        stroke={`url(#grad-${route.id})`}
        strokeWidth="2"
        filter={`url(#glow-${route.id})`}
      >
        <animate
          attributeName="stroke-dasharray"
          from="0, 1000"
          to="1000, 0"
          dur={`${route.duration}s`}
          repeatCount="indefinite"
        />
      </path>
      
      {/* Moving packet */}
      <circle r="4" fill={color} filter={`url(#glow-${route.id})`}>
        <animateMotion
          dur={`${route.duration}s`}
          repeatCount="indefinite"
        >
          <mpath href={`#arc-${route.id}`} />
        </animateMotion>
      </circle>
      <path
        id={`arc-${route.id}`}
        d={`M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`}
        fill="none"
        stroke="transparent"
        strokeWidth="0"
      />
    </g>
  );
};

export const ThreatMap: React.FC = () => {
  return (
    <div className="glassmorphism rounded-xl border border-purple-500/20 bg-gray-900/50 backdrop-blur-xl p-5 shadow-[0_0_30px_rgba(139,92,246,0.1)]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-bold text-white">Global Threat Activity</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
          <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">LIVE</span>
        </div>
      </div>

      {/* Floating Stats Cards */}
      <div className="absolute top-5 right-5 z-20 flex flex-col gap-2">
        <div className="glassmorphism rounded-lg border border-purple-500/30 bg-gray-900/80 backdrop-blur-md px-3 py-2">
          <div className="text-[10px] text-gray-400 mb-0.5">Active Attacks</div>
          <div className="text-lg font-bold text-white">247</div>
        </div>
        <div className="glassmorphism rounded-lg border border-green-500/30 bg-gray-900/80 backdrop-blur-md px-3 py-2">
          <div className="text-[10px] text-gray-400 mb-0.5">Blocked Today</div>
          <div className="text-lg font-bold text-green-400">812</div>
        </div>
        <div className="glassmorphism rounded-lg border border-red-500/30 bg-gray-900/80 backdrop-blur-md px-3 py-2">
          <div className="text-[10px] text-gray-400 mb-0.5">Critical</div>
          <div className="text-lg font-bold text-red-400">19</div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-[260px] overflow-hidden rounded-lg border border-gray-700/50 bg-gray-950/30">
        {/* World Map SVG Background */}
        <svg className="w-full h-full opacity-20" viewBox="0 0 1000 500">
          <g fill="rgba(148,163,184,0.3)" stroke="rgba(139,92,246,0.2)" strokeWidth="0.5">
            <path d="M150 80 L180 90 L210 100 L240 130 L230 170 L200 190 L170 180 L140 200 L120 220 L100 210 L80 180 L60 170 L50 130 L70 100 Z" />
            <path d="M160 230 L190 240 L220 280 L230 330 L210 370 L180 380 L160 350 L170 300 Z" />
            <path d="M250 320 L290 330 L320 370 L340 420 L330 460 L290 480 L270 450 L260 400 Z" />
            <path d="M450 80 L480 70 L520 80 L550 100 L560 140 L530 160 L510 150 L480 170 L450 160 L440 120 Z" />
            <path d="M450 170 L490 160 L520 190 L540 260 L530 340 L490 390 L450 400 L420 370 L410 310 L430 250 Z" />
            <path d="M560 70 L630 60 L700 90 L760 130 L800 180 L790 240 L740 270 L690 260 L650 290 L600 270 L570 300 L540 260 L520 210 L530 160 L570 140 L560 100 Z" />
            <path d="M820 370 L860 380 L890 410 L900 450 L870 480 L840 470 L820 430 Z" />
          </g>
        </svg>

        {/* Attack Arcs */}
        <svg className="absolute inset-0 w-full h-full z-10">
          {attackRoutes.map((route, i) => (
            <AttackArc key={route.id} route={route} />
          ))}
        </svg>

        {/* Attack Nodes */}
        {attackRoutes.map((route, i) => {
          const fromColor = getSeverityColor(route.severity);
          const toColor = i % 2 === 0 ? '#8B5CF6' : '#A855F7';
          
          const fromLeft = `${50 + route.from.lng * 0.45}%`;
          const fromTop = `${50 - route.from.lat * 0.6}%`;
          const toLeft = `${50 + route.to.lng * 0.45}%`;
          const toTop = `${50 - route.to.lat * 0.6}%`;

          return (
            <React.Fragment key={`nodes-${route.id}`}>
              <PulseDot color={fromColor} delay={i * 0.2} size={12} />
              <div style={{ position: 'absolute', left: fromLeft, top: fromTop }}>
                <PulseDot color={fromColor} delay={i * 0.2} size={12} />
              </div>
              <div style={{ position: 'absolute', left: toLeft, top: toTop }}>
                <PulseDot color={toColor} delay={i * 0.2 + 0.3} size={10} />
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Legend */}
      <div className="absolute bottom-5 right-5 glassmorphism rounded-lg border border-gray-700/50 bg-gray-900/80 backdrop-blur-md px-3 py-2 flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-[10px] text-gray-300">Critical</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="text-[10px] text-gray-300">High</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-sky-400" />
          <span className="text-[10px] text-gray-300">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-[10px] text-gray-300">Blocked</span>
        </div>
      </div>
    </div>
  );
};
