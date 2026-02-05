import { DASHBOARD_QUERY_KEYS } from '@/app/(protected)/(main)/dashboard/hooks/dashboard-query-keys';
import { FOCUS_QUERY_KEYS } from '@/app/(protected)/(main)/focus/hooks/focus-query-keys';
import { HABITS_QUERY_KEYS } from '@/app/(protected)/(main)/habits/hooks/habit-query-keys';
import { TASK_QUERY_KEYS } from '@/app/(protected)/(main)/tasks/hooks/task-query-keys';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { api } from '@/lib/rpc';
import { TRASH_QUERY_KEYS } from '../trash-query-keys';

const ALL_INVALIDATE_KEYS = [
  TRASH_QUERY_KEYS.tasks,
  TRASH_QUERY_KEYS.habits,
  TRASH_QUERY_KEYS.sessions,
  TRASH_QUERY_KEYS.counts,
  TASK_QUERY_KEYS.all,
  HABITS_QUERY_KEYS.list,
  HABITS_QUERY_KEYS.stats,
  FOCUS_QUERY_KEYS.sessions,
  FOCUS_QUERY_KEYS.stats,
  FOCUS_QUERY_KEYS.chart,
  DASHBOARD_QUERY_KEYS.metrics,
  DASHBOARD_QUERY_KEYS.heatmap,
  DASHBOARD_QUERY_KEYS.dashboardTasks,
  DASHBOARD_QUERY_KEYS.dashboardHabits,
];

export function useEmptyAllTrash() {
  return useApiMutation(api.trash.all.$delete, {
    invalidateKeys: ALL_INVALIDATE_KEYS,
    errorMessage: 'Failed to empty trash',
    successMessage: 'Trash emptied',
  });
}

export function useEmptyTrashTasks() {
  return useApiMutation(api.trash.tasks.all.$delete, {
    invalidateKeys: [TRASH_QUERY_KEYS.tasks, TRASH_QUERY_KEYS.counts],
    errorMessage: 'Failed to clear trashed tasks',
    successMessage: 'All trashed tasks deleted',
  });
}

export function useEmptyTrashHabits() {
  return useApiMutation(api.trash.habits.all.$delete, {
    invalidateKeys: [TRASH_QUERY_KEYS.habits, TRASH_QUERY_KEYS.counts],
    errorMessage: 'Failed to clear trashed habits',
    successMessage: 'All trashed habits deleted',
  });
}

export function useEmptyTrashSessions() {
  return useApiMutation(api.trash.sessions.all.$delete, {
    invalidateKeys: [TRASH_QUERY_KEYS.sessions, TRASH_QUERY_KEYS.counts],
    errorMessage: 'Failed to clear trashed sessions',
    successMessage: 'All trashed sessions deleted',
  });
}
