import { useApiQuery } from '@/hooks/use-api-query';
import { api } from '@/lib/rpc';
import { HABITS_QUERY_KEYS } from '../habit-query-keys';

export function useHabitChart(days = 7) {
  return useApiQuery(api.habits.chart.$get, {
    queryKey: HABITS_QUERY_KEYS.chartWithDays(days),
    input: {
      query: { days: days.toString() },
    },
    select: (data) => data.chartData,
    errorMessage: 'Failed to fetch habit chart data',
  });
}
