import type { Threat } from '../../types/threat';

export class SeverityEngine {
  calculateSeverity(score: number, threatType?: string): Threat['severity'] {
    if (score >= 90 || threatType?.toLowerCase().includes('c2')) {
      return 'Critical';
    }
    if (score >= 70) {
      return 'High';
    }
    if (score >= 40) {
      return 'Medium';
    }
    return 'Low';
  }

  aggregateSeverity(severities: Threat['severity'][]): Threat['severity'] {
    if (severities.includes('Critical')) return 'Critical';
    if (severities.includes('High')) return 'High';
    if (severities.includes('Medium')) return 'Medium';
    return 'Low';
  }
}
