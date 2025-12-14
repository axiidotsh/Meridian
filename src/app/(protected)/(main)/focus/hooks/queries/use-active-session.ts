import { useApiQuery } from '@/hooks/use-api-query';
import { api } from '@/lib/rpc';
import { FOCUS_QUERY_KEYS } from '../focus-query-keys';

export function useActiveSession() {
  return useApiQuery(api.focus.sessions.active.$get, {
    queryKey: FOCUS_QUERY_KEYS.activeSession,
    select: (data) => data.session,
    errorMessage: 'Failed to fetch active session',
  });
}
