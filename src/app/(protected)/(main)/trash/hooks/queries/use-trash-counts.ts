import { useApiQuery } from '@/hooks/use-api-query';
import { api } from '@/lib/rpc';
import { TRASH_QUERY_KEYS } from '../trash-query-keys';
import type { TrashCountsResponse } from '../types';

export function useTrashCounts() {
  return useApiQuery<typeof api.trash.counts.$get, TrashCountsResponse>(
    api.trash.counts.$get,
    {
      queryKey: TRASH_QUERY_KEYS.counts,
      errorMessage: 'Failed to load trash counts',
    }
  );
}
