import { DASHBOARD_QUERY_KEYS } from '@/app/(protected)/(main)/dashboard/hooks/dashboard-query-keys';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { api } from '@/lib/rpc';
import { useQueryClient } from '@tanstack/react-query';
import { TASK_QUERY_KEYS } from '../task-query-keys';
import type { Task } from '../types';

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useApiMutation(api.tasks[':id'].$patch, {
    invalidateKeys: [
      TASK_QUERY_KEYS.stats,
      TASK_QUERY_KEYS.chart,
      DASHBOARD_QUERY_KEYS.metrics,
      DASHBOARD_QUERY_KEYS.heatmap,
    ],
    errorMessage: 'Failed to update task',
    successMessage: 'Task updated',
    onSuccess: (data) => {
      if ('task' in data) {
        const updatedTask = data.task;
        queryClient.setQueryData(TASK_QUERY_KEYS.tasks, (old: unknown) => {
          const queryData = old as { tasks: Task[] };
          return {
            ...queryData,
            tasks: queryData.tasks.map((task) =>
              task.id === updatedTask.id ? updatedTask : task
            ),
          };
        });
      }
    },
  });
}
