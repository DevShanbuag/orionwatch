
import { useQuery } from '@tanstack/react-query';

export const useIPLookup = (ip: string | null) => {
  return useQuery({
    queryKey: ['ip-lookup', ip],
    queryFn: async () => {
      if (!ip) return null;
      const res = await fetch('http://localhost:3000/api/ip/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return { data: data.data, cacheHit: !!data.cache_hit };
    },
    enabled: !!ip,
  });
};
