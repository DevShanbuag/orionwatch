import type { Threat } from '../../types/threat';

interface CorrelationRule {
  name: string;
  check: (threats: Threat[]) => { matched: Threat[]; shouldCreate: boolean; title: string; description: string };
}

export class CorrelationRules {
  rules: CorrelationRule[] = [];

  constructor() {
    this.rules = [
      this.repeatedIpDetection(),
      this.highAbuseScoreDetection(),
      this.otxPulseDetection(),
      this.portScanDetection()
    ];
  }

  repeatedIpDetection(timeWindowMs: number = 3600000, minOccurrences: number = 5): CorrelationRule {
    return {
      name: 'Repeated IP Detection',
      check: (threats: Threat[]) => {
        const ipCounts = new Map<string, Threat[]>();
        const now = Date.now();

        for (const threat of threats) {
          if (!threat.indicator) continue;
          const threatTime = new Date(threat.created_at).getTime();
          if (now - threatTime <= timeWindowMs) {
            if (!ipCounts.has(threat.indicator)) {
              ipCounts.set(threat.indicator, []);
            }
            ipCounts.get(threat.indicator)!.push(threat);
          }
        }

        const matched = Array.from(ipCounts.values())
          .filter(group => group.length >= minOccurrences)
          .flat();

        if (matched.length === 0) {
          return { matched: [], shouldCreate: false, title: '', description: '' };
        }

        const mostFrequent = Array.from(ipCounts.entries())
          .sort((a, b) => b[1].length - a[1].length)[0];

        return {
          matched, shouldCreate: true,
          title: "Suspicious Repeated IP Activity",
          description: "IP " + mostFrequent[0] + " has been seen " + mostFrequent[1].length + " times in the last " + Math.round(timeWindowMs / 60000) + " minutes"
        };
      }
    };
  }

  highAbuseScoreDetection(minScore: number = 80): CorrelationRule {
    return {
      name: 'High Abuse Score Detection',
      check: (threats: Threat[]) => {
        const matched = threats.filter(
          (t) => t.confidence && t.confidence >= minScore);
        if (matched.length === 0) {
          return { matched: [], shouldCreate: false, title: '', description: '' };
        }
        return {
          matched, shouldCreate: true,
          title: 'High Abuse Score Alert',
          description: matched.length + " threats with abuse score >= " + minScore + " detected",
        };
      }
    };
  }

  otxPulseDetection(minPulses: number = 3): CorrelationRule {
    return {
      name: 'OTX Pulse Threshold Detection',
      check: (threats: Threat[]) => {
        const otxThreats = threats.filter(t => t.source === 'OTX');
        if (otxThreats.length < minPulses) {
          return { matched: [], shouldCreate: false, title: '', description: '' };
        }
        return {
          matched: otxThreats, shouldCreate: true,
          title: 'OTX Pulse Threshold Exceeded',
          description: otxThreats.length + " OTX threats detected",
        };
      }
    };
  }

  portScanDetection(): CorrelationRule {
    return {
      name: 'Port Scan Detection',
      check: (threats: Threat[]) => {
        const matched = threats.filter(
          t => t.threat_type.toLowerCase().includes('scan') || t.threat_type.toLowerCase().includes('port'));
        if (matched.length === 0) {
          return { matched: [], shouldCreate: false, title: '', description: '' };
        }
        return {
          matched, shouldCreate: true,
          title: 'Potential Port Scan Detected',
          description: matched.length + " potential port scan threats found",
        };
      }
    };
  }

  applyAllRules(threats: Threat[]): Array<{rule: string; title: string; description: string; matched: Threat[]}> {
    return this.rules.map(rule => {
      const result = rule.check(threats);
      if (result.shouldCreate) {
        return {
          rule: rule.name,
          title: result.title,
          description: result.description,
          matched: result.matched
        };
      }
      return null;
    }).filter(Boolean) as Array<{rule: string; title: string; description: string; matched: Threat[]}>;
  }
}
