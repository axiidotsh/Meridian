import { useApiQuery } from '@/hooks/use-api-query';
import { api } from '@/lib/rpc';
import { FOCUS_QUERY_KEYS } from '../focus-query-keys';

export function useChartSessions(days: number) {
  return useApiQuery(api.focus.sessions.$get, {
    queryKey: [...FOCUS_QUERY_KEYS.sessions, 'chart', days],
    input: { query: { days: days.toString() } },
    select: (data) => data.sessions || [],
    enabled: days > 0,
    errorMessage: 'Failed to fetch sessions',
  });
}
