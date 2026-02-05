import { useApiMutation } from '@/hooks/use-api-mutation';
import { api } from '@/lib/rpc';
import { TRASH_QUERY_KEYS } from '../trash-query-keys';

export function usePermanentDeleteSession() {
  return useApiMutation(api.trash.sessions[':id'].$delete, {
    invalidateKeys: [TRASH_QUERY_KEYS.sessions, TRASH_QUERY_KEYS.counts],
    errorMessage: 'Failed to permanently delete session',
    successMessage: 'Session permanently deleted',
  });
}
