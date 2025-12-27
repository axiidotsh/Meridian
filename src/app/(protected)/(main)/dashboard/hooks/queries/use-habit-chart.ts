import { useApiQuery } from '@/hooks/use-api-query';
import { api } from '@/lib/rpc';
import { DASHBOARD_QUERY_KEYS } from '../dashboard-query-keys';

export function useHabitChart(days = 7) {
  return useApiQuery(api.habits.chart.$get, {
    queryKey: [...DASHBOARD_QUERY_KEYS.habitChart, days],
    input: { query: { days: days.toString() } },
    select: (data) => data.chartData,
    errorMessage: 'Failed to fetch habit chart data',
  });
}
