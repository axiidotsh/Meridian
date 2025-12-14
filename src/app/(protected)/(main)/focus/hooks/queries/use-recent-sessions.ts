import { useApiQuery } from '@/hooks/use-api-query';
import { api } from '@/lib/rpc';
import { FOCUS_QUERY_KEYS } from '../focus-query-keys';

export function useRecentSessions(limit = 20, cursor?: string) {
  return useApiQuery(api.focus.sessions.$get, {
    queryKey: [...FOCUS_QUERY_KEYS.sessions, limit, cursor],
    input: {
      query: { limit: limit.toString(), ...(cursor && { cursor }) },
    },
    select: (data) => data.sessions || [],
    errorMessage: 'Failed to fetch sessions',
  });
}
