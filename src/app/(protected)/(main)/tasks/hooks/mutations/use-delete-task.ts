import { useApiMutation } from '@/hooks/use-api-mutation';
import { api } from '@/lib/rpc';
import { TASK_QUERY_KEYS } from '../task-query-keys';

export function useDeleteTask() {
  return useApiMutation(api.tasks[':id'].$delete, {
    invalidateKeys: [
      TASK_QUERY_KEYS.tasks,
      TASK_QUERY_KEYS.stats,
      TASK_QUERY_KEYS.chart,
    ],
  });
}
