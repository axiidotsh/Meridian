import { DASHBOARD_QUERY_KEYS } from '@/app/(protected)/(main)/dashboard/hooks/dashboard-query-keys';
import { HABITS_QUERY_KEYS } from '@/app/(protected)/(main)/habits/hooks/habit-query-keys';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { api } from '@/lib/rpc';
import { TRASH_QUERY_KEYS } from '../trash-query-keys';

export function useRestoreHabit() {
  return useApiMutation(api.trash.habits[':id'].restore.$post, {
    invalidateKeys: [
      TRASH_QUERY_KEYS.habits,
      TRASH_QUERY_KEYS.counts,
      HABITS_QUERY_KEYS.list,
      HABITS_QUERY_KEYS.stats,
      DASHBOARD_QUERY_KEYS.metrics,
      DASHBOARD_QUERY_KEYS.heatmap,
      DASHBOARD_QUERY_KEYS.dashboardHabits,
    ],
    errorMessage: 'Failed to restore habit',
    successMessage: 'Habit restored',
  });
}
