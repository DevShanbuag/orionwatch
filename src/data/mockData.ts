type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

interface Threat {
  id: string;
  type: string;
  severity: Severity;
  source: string;
  country: string;
  ip: string;
  timestamp: string;
  description: string;
}

interface Service {
  id: string;
  name: string;
  status: 'Operational' | 'Degraded' | 'Down';
  uptime: number;
  latency: number;
}

interface AuthEvent {
  id: string;
  username: string;
  device: string;
  ip: string;
  location: string;
  status: 'Success' | 'Failed' | 'Blocked';
  timestamp: string;
  method: 'Password' | 'Passkey' | '2FA';
}

export const mockThreats: Threat[] = [
  { id: '1', type: 'Brute Force SSH', severity: 'Critical', source: 'AbuseIPDB', country: 'Russia', ip: '185.220.101.42', timestamp: '2024-05-29T09:15:00Z', description: 'Automated brute force attack targeting SSH services from known TOR exit node.' },
  { id: '2', type: 'Credential Stuffing', severity: 'High', source: 'VirusTotal', country: 'China', ip: '110.249.120.58', timestamp: '2024-05-29T08:30:00Z', description: 'Credential stuffing attempt on authentication endpoints.' },
  { id: '3', type: 'Malicious URL', severity: 'Medium', source: 'URLHaus', country: 'Germany', ip: '91.121.45.32', timestamp: '2024-05-29T10:00:00Z', description: 'URL hosting malware reported by threat feed.' },
  { id: '4', type: 'C2 Communication', severity: 'Critical', source: 'GreyNoise', country: 'Iran', ip: '5.199.163.88', timestamp: '2024-05-29T07:45:00Z', description: 'Command and control beacon detected from compromised host.' },
  { id: '5', type: 'Port Scan', severity: 'Low', source: 'Shodan', country: 'Brazil', ip: '200.100.50.23', timestamp: '2024-05-29T11:20:00Z', description: 'Reconnaissance port scan on common services.' },
  { id: '6', type: 'Botnet Activity', severity: 'Critical', source: 'AlienVault OTX', country: 'North Korea', ip: '175.45.176.10', timestamp: '2024-05-29T06:45:00Z', description: 'Botnet node participating in DDoS attack.' },
  { id: '7', type: 'Suspicious DNS Query', severity: 'Medium', source: 'VirusTotal', country: 'United States', ip: '209.132.188.10', timestamp: '2024-05-29T12:00:00Z', description: 'DNS query to domain with low reputation detected.' },
];

export const mockServices: Service[] = [
  { id: '1', name: 'OrionWatch API', status: 'Operational', uptime: 99.98, latency: 5 },
  { id: '2', name: 'OrionWatch Intelligence Engine', status: 'Operational', uptime: 99.95, latency: 12 },
  { id: '3', name: 'OrionWatch Threat Pipeline', status: 'Degraded', uptime: 98.2, latency: 45 },
  { id: '4', name: 'OrionWatch Analytics', status: 'Operational', uptime: 99.99, latency: 8 },
  { id: '5', name: 'Identity Service', status: 'Down', uptime: 95.5, latency: 0 },
];

export const mockAuthEvents: AuthEvent[] = [
  { id: '1', username: 'john.doe', device: 'MacBook Pro', ip: '192.168.1.45', location: 'San Francisco, CA', status: 'Success', timestamp: '2024-05-29T08:00:00Z', method: 'Passkey' },
  { id: '2', username: 'jane.smith', device: 'iPhone 15', ip: '10.0.0.23', location: 'New York, NY', status: 'Success', timestamp: '2024-05-29T09:30:00Z', method: '2FA' },
  { id: '3', username: 'admin', device: 'Windows PC', ip: '172.16.0.12', location: 'London, UK', status: 'Failed', timestamp: '2024-05-29T10:15:00Z', method: 'Password' },
  { id: '4', username: 'guest', device: 'Android Phone', ip: '203.0.113.89', location: 'Tokyo, Japan', status: 'Blocked', timestamp: '2024-05-29T11:00:00Z', method: 'Password' },
];
