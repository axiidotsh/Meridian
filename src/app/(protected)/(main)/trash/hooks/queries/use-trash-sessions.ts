import { useApiQuery } from '@/hooks/use-api-query';
import { api } from '@/lib/rpc';
import { TRASH_QUERY_KEYS } from '../trash-query-keys';
import type { TrashSessionsResponse } from '../types';

export function useTrashSessions() {
  return useApiQuery<typeof api.trash.sessions.$get, TrashSessionsResponse>(
    api.trash.sessions.$get,
    {
      queryKey: TRASH_QUERY_KEYS.sessions,
      errorMessage: 'Failed to load trashed sessions',
    }
  );
}
