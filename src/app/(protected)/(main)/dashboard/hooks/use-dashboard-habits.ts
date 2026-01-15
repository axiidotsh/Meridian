import { useApiQuery } from '@/hooks/use-api-query';
import { api } from '@/lib/rpc';

const DASHBOARD_HABITS_KEY = ['dashboard', 'habits'] as const;

export function useDashboardHabits() {
  return useApiQuery(api.dashboard.habits.$get, {
    queryKey: [...DASHBOARD_HABITS_KEY],
    select: (data) => data.habits,
    errorMessage: 'Failed to fetch dashboard habits',
  });
}
