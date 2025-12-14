import { useApiQuery } from '@/hooks/use-api-query';
import { api } from '@/lib/rpc';
import { TASK_QUERY_KEYS } from '../task-query-keys';

export function useTasks() {
  return useApiQuery(api.tasks.$get, {
    queryKey: TASK_QUERY_KEYS.tasks,
    select: (data) => data.tasks,
    errorMessage: 'Failed to fetch tasks',
  });
}
