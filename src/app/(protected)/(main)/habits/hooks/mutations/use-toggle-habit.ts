import { useApiMutation } from '@/hooks/use-api-mutation';
import { api } from '@/lib/rpc';
import { HABITS_QUERY_KEYS } from '../habit-query-keys';

export function useToggleHabit() {
  const toggleToday = useApiMutation(api.habits[':id'].toggle.$post, {
    invalidateKeys: [HABITS_QUERY_KEYS.list, HABITS_QUERY_KEYS.stats],
  });

  const toggleDate = useApiMutation(api.habits[':id']['toggle-date'].$post, {
    invalidateKeys: [HABITS_QUERY_KEYS.list, HABITS_QUERY_KEYS.stats],
  });

  return {
    toggleToday,
    toggleDate,
  };
}
