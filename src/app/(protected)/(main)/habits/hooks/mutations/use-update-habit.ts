import { DASHBOARD_QUERY_KEYS } from '@/app/(protected)/(main)/dashboard/hooks/dashboard-query-keys';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { api } from '@/lib/rpc';
import { useQueryClient, type QueryKey } from '@tanstack/react-query';
import { HABITS_QUERY_KEYS } from '../habit-query-keys';
import type { Habit } from '../types';

export function useUpdateHabit() {
  const queryClient = useQueryClient();

  return useApiMutation(api.habits[':id'].$patch, {
    invalidateKeys: [HABITS_QUERY_KEYS.list, DASHBOARD_QUERY_KEYS.metrics],
    errorMessage: 'Failed to update habit',
    successMessage: 'Habit updated',
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
          const updatedHabits = data.habits.map((habit) =>
            habit.id === variables.param.id
              ? { ...habit, ...variables.json }
              : habit
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
