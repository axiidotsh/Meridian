import { useApiQuery } from '@/hooks/use-api-query';
import { api } from '@/lib/rpc';
import { TASK_QUERY_KEYS } from '../task-query-keys';

export function useTaskStats() {
  return useApiQuery(api.tasks.stats.$get, {
    queryKey: TASK_QUERY_KEYS.stats,
    select: (data) => data.stats,
    errorMessage: 'Failed to fetch task stats',
  });
}
