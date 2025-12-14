import {
  useQuery,
  type QueryKey,
  type UseQueryOptions,
} from '@tanstack/react-query';
import type { InferRequestType, InferResponseType } from 'hono/client';

type ClientResponse = { ok: boolean; json: () => Promise<unknown> };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyEndpoint = (args?: any) => Promise<ClientResponse>;

export function useApiQuery<
  TEndpoint extends AnyEndpoint,
  TData = InferResponseType<TEndpoint>,
>(
  endpoint: TEndpoint,
  options: {
    queryKey: QueryKey;
    input?: InferRequestType<TEndpoint>;
    select?: (data: InferResponseType<TEndpoint>) => TData;
    enabled?: boolean;
    errorMessage?: string;
  } & Omit<
    UseQueryOptions<InferResponseType<TEndpoint>, Error, TData>,
    'queryKey' | 'queryFn' | 'select' | 'enabled'
  >
) {
  const { queryKey, input, select, enabled, errorMessage, ...restOptions } =
    options;

  return useQuery<InferResponseType<TEndpoint>, Error, TData>({
    queryKey,
    queryFn: async () => {
      const res = await endpoint(input);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(
          (error as { error?: string }).error ||
            errorMessage ||
            'Request failed'
        );
      }
      return res.json() as Promise<InferResponseType<TEndpoint>>;
    },
    select,
    enabled,
    ...restOptions,
  });
}
