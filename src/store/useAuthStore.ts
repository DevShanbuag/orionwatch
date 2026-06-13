import { create } from 'zustand';
import { mockAuthEvents } from '../data/mockData';

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

interface AuthStore {
  authEvents: AuthEvent[];
}

export const useAuthStore = create<AuthStore>((set) => ({
  authEvents: mockAuthEvents,
}));
