import { DASHBOARD_QUERY_KEYS } from '@/app/(protected)/(main)/dashboard/hooks/dashboard-query-keys';
import { TASK_QUERY_KEYS } from '@/app/(protected)/(main)/tasks/hooks/task-query-keys';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { api } from '@/lib/rpc';
import { TRASH_QUERY_KEYS } from '../trash-query-keys';

export function useRestoreTask() {
  return useApiMutation(api.trash.tasks[':id'].restore.$post, {
    invalidateKeys: [
      TRASH_QUERY_KEYS.tasks,
      TRASH_QUERY_KEYS.counts,
      TASK_QUERY_KEYS.all,
      DASHBOARD_QUERY_KEYS.metrics,
      DASHBOARD_QUERY_KEYS.heatmap,
      DASHBOARD_QUERY_KEYS.dashboardTasks,
    ],
    errorMessage: 'Failed to restore task',
    successMessage: 'Task restored',
  });
}
