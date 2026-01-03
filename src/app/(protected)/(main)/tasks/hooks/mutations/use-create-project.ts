import { useApiMutation } from '@/hooks/use-api-mutation';
import { api } from '@/lib/rpc';
import { TASK_QUERY_KEYS } from '../task-query-keys';

export function useCreateProject() {
  return useApiMutation(api.projects.$post, {
    invalidateKeys: [TASK_QUERY_KEYS.projects],
    errorMessage: 'Failed to create project',
    successMessage: 'Project created',
  });
}
