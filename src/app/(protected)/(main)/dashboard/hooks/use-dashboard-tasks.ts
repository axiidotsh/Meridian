import { useApiQuery } from '@/hooks/use-api-query';
import { api } from '@/lib/rpc';

const DASHBOARD_TASKS_KEY = ['dashboard', 'tasks'] as const;

export function useDashboardTasks() {
  return useApiQuery(api.dashboard.tasks.$get, {
    queryKey: [...DASHBOARD_TASKS_KEY],
    select: (data) => data.tasks,
    errorMessage: 'Failed to fetch dashboard tasks',
  });
}
