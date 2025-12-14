import { useApiQuery } from '@/hooks/use-api-query';
import { api } from '@/lib/rpc';
import { TASK_QUERY_KEYS } from '../task-query-keys';

export function useTaskChart() {
  return useApiQuery(api.tasks.chart.$get, {
    queryKey: TASK_QUERY_KEYS.chart,
    select: (data) => data.chartData,
    errorMessage: 'Failed to fetch chart data',
  });
}
