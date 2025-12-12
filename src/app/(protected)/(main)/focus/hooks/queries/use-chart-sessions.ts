import { api } from '@/lib/rpc';
import { useQuery } from '@tanstack/react-query';
import { FOCUS_QUERY_KEYS } from '../focus-query-keys';

export function useChartSessions(days: number) {
  return useQuery({
    queryKey: [...FOCUS_QUERY_KEYS.sessions, 'chart', days],
    queryFn: async () => {
      const res = await api.focus.sessions.$get({
        query: { days: days.toString() },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch sessions');
      }
      const data = await res.json();
      return data.sessions || [];
    },
    enabled: days > 0,
  });
}
