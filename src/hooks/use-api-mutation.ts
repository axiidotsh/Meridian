import {
  useMutation,
  useQueryClient,
  type QueryKey,
} from '@tanstack/react-query';
import type { InferRequestType, InferResponseType } from 'hono/client';
import { toast } from 'sonner';

type ClientResponse = {
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyEndpoint = (args: any) => Promise<ClientResponse>;

type OptimisticUpdate<TVariables> = {
  queryKey: QueryKey;
  updater: (oldData: unknown, variables: TVariables) => unknown;
};

type OptimisticUpdateContext = {
  snapshots: Array<{
    queryKey: QueryKey;
    data: unknown;
  }>;
};

export function useApiMutation<TEndpoint extends AnyEndpoint>(
  endpoint: TEndpoint,
  options?: {
    mutationKey?: QueryKey;
    invalidateKeys?: QueryKey[];
    onSuccess?: (data: InferResponseType<TEndpoint>) => void;
    onError?: (error: Error) => void;
    errorMessage?: string;
    optimisticUpdate?: OptimisticUpdate<InferRequestType<TEndpoint>>;
    optimisticUpdates?: Array<OptimisticUpdate<InferRequestType<TEndpoint>>>;
    onMutate?: (
      variables: InferRequestType<TEndpoint>
    ) =>
      | Promise<OptimisticUpdateContext | void>
      | OptimisticUpdateContext
      | void;
  }
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: options?.mutationKey,
    mutationFn: async (input: InferRequestType<TEndpoint>) => {
      const res = await endpoint(input);
      if (!res.ok) {
        const error = await res.json();
        const errorMsg =
          (error as { error?: string }).error || 'Request failed';
        const rateLimitError = new Error(errorMsg);
        (rateLimitError as Error & { status: number }).status = res.status;
        throw rateLimitError;
      }
      return res.json() as Promise<InferResponseType<TEndpoint>>;
    },
    onMutate: async (variables) => {
      const updates =
        options?.optimisticUpdates ||
        (options?.optimisticUpdate ? [options.optimisticUpdate] : []);

      if (updates.length > 0) {
        await Promise.all(
          updates.map((update) =>
            queryClient.cancelQueries({ queryKey: update.queryKey })
          )
        );

        const snapshots = updates.map((update) => ({
          queryKey: update.queryKey,
          data: queryClient.getQueryData(update.queryKey),
        }));

        updates.forEach((update) => {
          queryClient.setQueryData(update.queryKey, (old: unknown) =>
            update.updater(old, variables)
          );
        });

        const customContext = await options?.onMutate?.(variables);

        return customContext ? { ...customContext, snapshots } : { snapshots };
      }

      return options?.onMutate?.(variables);
    },
    onSuccess: (data) => {
      options?.invalidateKeys?.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
      options?.onSuccess?.(data);
    },
    onError: (error: Error & { status?: number }, _variables, context) => {
      if (context?.snapshots) {
        context.snapshots.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      const isRateLimitError = error.status === 429;
      const errorMessage = isRateLimitError
        ? error.message
        : options?.errorMessage || error.message || 'An error occurred';

      toast.error(errorMessage);
      options?.onError?.(error);
    },
  });
}
