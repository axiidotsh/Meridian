import { useApiQuery } from '@/hooks/use-api-query';
import { api } from '@/lib/rpc';
import { HABITS_QUERY_KEYS } from '../habit-query-keys';

export function useHabits(days = 7) {
  return useApiQuery(api.habits.$get, {
    queryKey: [...HABITS_QUERY_KEYS.list, days],
    input: {
      query: { days: days.toString() },
    },
    select: (data) => data.habits || [],
    errorMessage: 'Failed to fetch habits',
  });
}
