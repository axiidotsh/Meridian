import { DASHBOARD_QUERY_KEYS } from '@/app/(protected)/(main)/dashboard/hooks/dashboard-query-keys';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { api } from '@/lib/rpc';
import { useQueryClient } from '@tanstack/react-query';
import { HABITS_QUERY_KEYS } from '../habit-query-keys';
import type { Habit } from '../types';

export function useUpdateHabit() {
  const queryClient = useQueryClient();

  return useApiMutation(api.habits[':id'].$patch, {
    invalidateKeys: [DASHBOARD_QUERY_KEYS.metrics],
    errorMessage: 'Failed to update habit',
    successMessage: 'Habit updated',
    onSuccess: (data) => {
      if ('habit' in data) {
        const updatedHabit = data.habit;
        const queries = queryClient.getQueriesData<{ habits: Habit[] }>({
          queryKey: HABITS_QUERY_KEYS.list,
        });

        queries.forEach(([queryKey, queryData]) => {
          if (queryData?.habits) {
            const updatedHabits = queryData.habits.map((habit) =>
              habit.id === updatedHabit.id ? updatedHabit : habit
            );
            queryClient.setQueryData(queryKey, { habits: updatedHabits });
          }
        });
      }
    },
  });
}
