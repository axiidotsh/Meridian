import { useApiMutation } from '@/hooks/use-api-mutation';
import { api } from '@/lib/rpc';
import { TRASH_QUERY_KEYS } from '../trash-query-keys';

export function usePermanentDeleteHabit() {
  return useApiMutation(api.trash.habits[':id'].$delete, {
    invalidateKeys: [TRASH_QUERY_KEYS.habits, TRASH_QUERY_KEYS.counts],
    errorMessage: 'Failed to permanently delete habit',
    successMessage: 'Habit permanently deleted',
  });
}
