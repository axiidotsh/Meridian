import { useApiQuery } from '@/hooks/use-api-query';
import { api } from '@/lib/rpc';
import { HABITS_QUERY_KEYS } from '../habit-query-keys';

export function useHabitStats() {
  return useApiQuery(api.habits.stats.$get, {
    queryKey: HABITS_QUERY_KEYS.stats,
    select: (data) => data.stats,
    errorMessage: 'Failed to fetch habit stats',
  });
}
