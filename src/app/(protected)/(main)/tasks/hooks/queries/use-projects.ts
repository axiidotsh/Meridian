import { useApiQuery } from '@/hooks/use-api-query';
import { api } from '@/lib/rpc';
import { TASK_QUERY_KEYS } from '../task-query-keys';

export function useProjects() {
  return useApiQuery(api.projects.$get, {
    queryKey: TASK_QUERY_KEYS.projects,
    select: (data) => data.projects,
    errorMessage: 'Failed to fetch projects',
  });
}
