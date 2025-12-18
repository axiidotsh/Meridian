import { useApiMutation } from '@/hooks/use-api-mutation';
import { api } from '@/lib/rpc';
import { HABITS_QUERY_KEYS } from '../habit-query-keys';

export function useUpdateHabit() {
  return useApiMutation(api.habits[':id'].$patch, {
    invalidateKeys: [HABITS_QUERY_KEYS.list],
  });
}
