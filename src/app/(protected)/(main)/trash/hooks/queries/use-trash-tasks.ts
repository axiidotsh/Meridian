import { useApiQuery } from '@/hooks/use-api-query';
import { api } from '@/lib/rpc';
import { TRASH_QUERY_KEYS } from '../trash-query-keys';
import type { TrashTasksResponse } from '../types';

export function useTrashTasks() {
  return useApiQuery<typeof api.trash.tasks.$get, TrashTasksResponse>(
    api.trash.tasks.$get,
    {
      queryKey: TRASH_QUERY_KEYS.tasks,
      errorMessage: 'Failed to load trashed tasks',
    }
  );
}
