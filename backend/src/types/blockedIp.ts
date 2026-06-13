export interface BlockedIp {
  id: string;
  ip_address: string;
  reason?: string;
  blocked_at: string;
  expires_at?: string;
  created_at: string;
}
