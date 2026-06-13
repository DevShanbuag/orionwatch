export interface OsintLookupRequest {
  query: string;
  type: 'ip' | 'domain' | 'url' | 'hash';
}

export interface OsintLookupResult {
  query: string;
  type: string;
  is_malicious: boolean;
  reputation_score: number;
  sources: string[];
  details: Record<string, any>;
  last_analyzed: string;
}
