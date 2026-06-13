export interface Incident {
  id: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  status: 'Open' | 'Investigating' | 'Resolved' | 'Closed';
  created_at: string;
}

export interface IncidentStats {
  total_incidents: number;
  open_incidents: number;
  resolved_today: number;
  critical_incidents: number;
}
