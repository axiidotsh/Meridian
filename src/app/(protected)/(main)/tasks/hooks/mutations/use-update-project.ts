import { useApiMutation } from '@/hooks/use-api-mutation';
import { api } from '@/lib/rpc';
import { TASK_QUERY_KEYS } from '../task-query-keys';

export function useUpdateProject() {
  return useApiMutation(api.projects[':id'].$patch, {
    invalidateKeys: [TASK_QUERY_KEYS.projects],
    errorMessage: 'Failed to update project',
    successMessage: 'Project updated',
  });
}
