export interface AuthEvent {
  id: string;
  username: string;
  device: string;
  ip: string;
  location: string;
  status: 'Success' | 'Failed' | 'Blocked';
  timestamp: string;
  method: 'Password' | 'Passkey' | '2FA';
}
