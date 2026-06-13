import { AuthEvent } from '../types/auth';

export class AuthRepository {
  private mockAuthEvents: AuthEvent[] = [
    { 
      id: '1', 
      username: 'john.doe', 
      device: 'MacBook Pro', 
      ip: '192.168.1.45', 
      location: 'San Francisco, CA', 
      status: 'Success', 
      timestamp: '2024-05-29T08:00:00Z', 
      method: 'Passkey' 
    },
    { 
      id: '2', 
      username: 'jane.smith', 
      device: 'iPhone 15', 
      ip: '10.0.0.23', 
      location: 'New York, NY', 
      status: 'Success', 
      timestamp: '2024-05-29T09:30:00Z', 
      method: '2FA' 
    },
    { 
      id: '3', 
      username: 'admin', 
      device: 'Windows PC', 
      ip: '172.16.0.12', 
      location: 'London, UK', 
      status: 'Failed', 
      timestamp: '2024-05-29T10:15:00Z', 
      method: 'Password' 
    },
    { 
      id: '4', 
      username: 'guest', 
      device: 'Android Phone', 
      ip: '203.0.113.89', 
      location: 'Tokyo, Japan', 
      status: 'Blocked', 
      timestamp: '2024-05-29T11:00:00Z', 
      method: 'Password' 
    },
  ];

  async getAll(): Promise<AuthEvent[]> {
    return this.mockAuthEvents;
  }

  async getById(id: string): Promise<AuthEvent | undefined> {
    return this.mockAuthEvents.find(e => e.id === id);
  }
}
