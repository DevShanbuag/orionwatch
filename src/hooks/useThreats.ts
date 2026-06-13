
import { useQuery } from '@tanstack/react-query';

export const useThreats = (limit?: number) => {
  return useQuery({
    queryKey: ['threats', limit],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:3000/api/threats${limit ? `?limit=${limit}` : ''}`
      );
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return data.data;
    },
  });
};

export const useThreatStats = () => {
  return useQuery({
    queryKey: ['threat-stats'],
    queryFn: async () => {
      const res = await fetch('http://localhost:3000/api/threats/stats');
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return data.data;
    },
  });
};
