import { useApiMutation } from '@/hooks/use-api-mutation';
import { api } from '@/lib/rpc';
import { TRASH_QUERY_KEYS } from '../trash-query-keys';

export function usePermanentDeleteTask() {
  return useApiMutation(api.trash.tasks[':id'].$delete, {
    invalidateKeys: [TRASH_QUERY_KEYS.tasks, TRASH_QUERY_KEYS.counts],
    errorMessage: 'Failed to permanently delete task',
    successMessage: 'Task permanently deleted',
  });
}
