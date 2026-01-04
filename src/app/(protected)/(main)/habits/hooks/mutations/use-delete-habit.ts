import { DASHBOARD_QUERY_KEYS } from '@/app/(protected)/(main)/dashboard/hooks/dashboard-query-keys';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { api } from '@/lib/rpc';
import { useQueryClient } from '@tanstack/react-query';
import { HABITS_QUERY_KEYS } from '../habit-query-keys';
import type { Habit } from '../types';

export function useDeleteHabit() {
  const queryClient = useQueryClient();

  return useApiMutation(api.habits[':id'].$delete, {
    invalidateKeys: [
      HABITS_QUERY_KEYS.stats,
      DASHBOARD_QUERY_KEYS.metrics,
      DASHBOARD_QUERY_KEYS.heatmap,
      DASHBOARD_QUERY_KEYS.habitChart,
    ],
    errorMessage: 'Failed to delete habit',
    successMessage: 'Habit deleted',
    onSuccess: (_data, variables) => {
      const queries = queryClient.getQueriesData<{ habits: Habit[] }>({
        queryKey: HABITS_QUERY_KEYS.list,
      });

      queries.forEach(([queryKey, queryData]) => {
        if (queryData?.habits) {
          const updatedHabits = queryData.habits.filter(
            (habit) => habit.id !== variables.param.id
          );
          queryClient.setQueryData(queryKey, { habits: updatedHabits });
        }
      });
    },
  });
}
