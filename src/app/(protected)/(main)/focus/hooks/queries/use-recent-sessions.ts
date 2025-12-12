import { api } from '@/lib/rpc';
import { useQuery } from '@tanstack/react-query';
import { FOCUS_QUERY_KEYS } from '../focus-query-keys';

export function useRecentSessions(limit = 20, cursor?: string) {
  return useQuery({
    queryKey: [...FOCUS_QUERY_KEYS.sessions, limit, cursor],
    queryFn: async () => {
      const res = await api.focus.sessions.$get({
        query: { limit: limit.toString(), ...(cursor && { cursor }) },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch sessions');
      }
      const data = await res.json();
      return data.sessions || [];
    },
  });
}
