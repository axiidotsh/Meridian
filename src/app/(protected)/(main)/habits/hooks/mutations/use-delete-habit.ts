import { DASHBOARD_QUERY_KEYS } from '@/app/(protected)/(main)/dashboard/hooks/dashboard-query-keys';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { api } from '@/lib/rpc';
import { useQueryClient, type QueryKey } from '@tanstack/react-query';
import { HABITS_QUERY_KEYS } from '../habit-query-keys';
import type { Habit } from '../types';

export function useDeleteHabit() {
  const queryClient = useQueryClient();

  return useApiMutation(api.habits[':id'].$delete, {
    invalidateKeys: [
      HABITS_QUERY_KEYS.list,
      HABITS_QUERY_KEYS.stats,
      DASHBOARD_QUERY_KEYS.metrics,
      DASHBOARD_QUERY_KEYS.heatmap,
      DASHBOARD_QUERY_KEYS.habitChart,
    ],
    errorMessage: 'Failed to delete habit',
    successMessage: 'Habit deleted',
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: HABITS_QUERY_KEYS.list });

      const queries = queryClient.getQueriesData<{ habits: Habit[] }>({
        queryKey: HABITS_QUERY_KEYS.list,
      });

      const previousData = queries.map(([queryKey, data]) => ({
        queryKey,
        data,
      }));

      queries.forEach(([queryKey, data]) => {
        if (data?.habits) {
          const updatedHabits = data.habits.filter(
            (habit) => habit.id !== variables.param.id
          );
          queryClient.setQueryData(queryKey, { habits: updatedHabits });
        }
      });

      return { previousData, snapshots: [] };
    },
    onError: (
      _error,
      _variables,
      context?: {
        previousData?: Array<{ queryKey: QueryKey; data: unknown }>;
        snapshots: Array<{ queryKey: QueryKey; data: unknown }>;
      }
    ) => {
      if (context?.previousData) {
        context.previousData.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
  });
}
