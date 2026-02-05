import { useApiQuery } from '@/hooks/use-api-query';
import { api } from '@/lib/rpc';
import { TRASH_QUERY_KEYS } from '../trash-query-keys';
import type { TrashHabitsResponse } from '../types';

export function useTrashHabits() {
  return useApiQuery<typeof api.trash.habits.$get, TrashHabitsResponse>(
    api.trash.habits.$get,
    {
      queryKey: TRASH_QUERY_KEYS.habits,
      errorMessage: 'Failed to load trashed habits',
    }
  );
}
