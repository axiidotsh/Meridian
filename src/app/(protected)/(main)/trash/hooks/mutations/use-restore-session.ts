import { DASHBOARD_QUERY_KEYS } from '@/app/(protected)/(main)/dashboard/hooks/dashboard-query-keys';
import { FOCUS_QUERY_KEYS } from '@/app/(protected)/(main)/focus/hooks/focus-query-keys';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { api } from '@/lib/rpc';
import { TRASH_QUERY_KEYS } from '../trash-query-keys';

export function useRestoreSession() {
  return useApiMutation(api.trash.sessions[':id'].restore.$post, {
    invalidateKeys: [
      TRASH_QUERY_KEYS.sessions,
      TRASH_QUERY_KEYS.counts,
      FOCUS_QUERY_KEYS.sessions,
      FOCUS_QUERY_KEYS.stats,
      FOCUS_QUERY_KEYS.chart,
      DASHBOARD_QUERY_KEYS.metrics,
      DASHBOARD_QUERY_KEYS.heatmap,
    ],
    errorMessage: 'Failed to restore session',
    successMessage: 'Session restored',
  });
}
