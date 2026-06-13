import type { Threat } from '../../types/threat';
import type { Incident } from '../../types/incident';
import { CorrelationRules } from './rules';
import { SeverityEngine } from './severityEngine';

export class IncidentGenerator {
  private rules: CorrelationRules;
  private severityEngine: SeverityEngine;

  constructor() {
    this.rules = new CorrelationRules();
    this.severityEngine = new SeverityEngine();
  }

  processThreats(threats: Threat[]): Omit<Incident, 'id' | 'created_at'>[] {
    const triggered = this.rules.applyAllRules(threats);
    return triggered.map(result => ({
      title: result.title,
      description: result.description,
      severity: this.severityEngine.aggregateSeverity(
        result.matched.map(t => t.severity)),
      status: 'Open'
    }));
  }
}
