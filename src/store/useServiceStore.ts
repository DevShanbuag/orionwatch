import { create } from 'zustand';
import { mockServices } from '../data/mockData';

interface Service {
  id: string;
  name: string;
  status: 'Operational' | 'Degraded' | 'Down';
  uptime: number;
  latency: number;
}

interface ServiceStore {
  services: Service[];
}

export const useServiceStore = create<ServiceStore>((set) => ({
  services: mockServices,
}));
