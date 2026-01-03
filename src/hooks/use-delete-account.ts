import { api } from '@/lib/rpc';
import { useApiMutation } from './use-api-mutation';

export function useDeleteAccount() {
  return useApiMutation(api.user.account.$delete, {
    errorMessage: 'Failed to delete account',
    successMessage: 'Account deleted',
  });
}
