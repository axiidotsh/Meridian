import { useApiMutation } from '@/hooks/use-api-mutation';
import { api } from '@/lib/rpc';
import { HABITS_QUERY_KEYS } from '../habit-query-keys';

export function useCreateHabit() {
  return useApiMutation(api.habits.$post, {
    invalidateKeys: [HABITS_QUERY_KEYS.list, HABITS_QUERY_KEYS.stats],
  });
}
