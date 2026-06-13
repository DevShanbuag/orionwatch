import type { Threat } from '../../types/threat';

export interface AbuseIPDBResponse {
  data: {
    ipAddress: string;
    abuseConfidenceScore: number;
    countryCode: string;
    countryName: string;
    totalReports: number;
    lastReportedAt: string;
    reports?: Array<{ categories: number[]; comment: string; reportedAt: string }>;
  };
}

export function normalizeAbuseIPDB(data: AbuseIPDBResponse['data']): Omit<Threat, 'id' | 'created_at'> {
  const severity = data.abuseConfidenceScore > 85 ? 'Critical' :
    data.abuseConfidenceScore > 60 ? 'High' :
    data.abuseConfidenceScore > 30 ? 'Medium' : 'Low';

  let threatType = 'Suspicious IP';
  if (data.reports && data.reports.length > 0) {
    const categories = new Set(data.reports.flatMap(r => r.categories));
    if (categories.has(3) || categories.has(14)) threatType = 'Port Scan';
    else if (categories.has(18) || categories.has(22)) threatType = 'Brute Force (SSH)';
    else if (categories.has(4)) threatType = 'Malicious IP';
  }

  return {
    source: 'AbuseIPDB',
    indicator: data.ipAddress,
    threat_type: threatType,
    severity: severity,
    country: data.countryName || 'Unknown',
    confidence: data.abuseConfidenceScore,
    first_seen: new Date().toISOString(),
    last_seen: data.lastReportedAt || new Date().toISOString(),
    status: 'active'
  };
}
