export interface Service {
  id: string;
  name: string;
  provider: string;
  status: 'Operational' | 'Degraded' | 'Down';
  last_sync: string;
}
