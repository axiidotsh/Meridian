import { useApiInfiniteQuery } from '@/hooks/use-api-infinite-query';
import { api } from '@/lib/rpc';
import type { InferResponseType } from 'hono/client';
import { useMemo } from 'react';
import { FOCUS_QUERY_KEYS } from '../focus-query-keys';

type SessionsResponse = InferResponseType<typeof api.focus.sessions.$get>;
type FocusSession = SessionsResponse['sessions'][number];

interface UseInfiniteRecentSessionsOptions {
  search?: string;
  sortBy?: 'name' | 'duration' | 'date';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
}

export function useInfiniteRecentSessions(
  options: UseInfiniteRecentSessionsOptions = {}
) {
  const { search, sortBy, sortOrder = 'desc', limit = 50 } = options;

  const query = useApiInfiniteQuery(api.focus.sessions.$get, {
    queryKey: [...FOCUS_QUERY_KEYS.sessions, search, sortBy, sortOrder, limit],
    getInput: (offset) => ({
      query: {
        offset: offset.toString(),
        limit: limit.toString(),
        sortOrder,
        ...(search && { search }),
        ...(sortBy && { sortBy }),
      },
    }),
    errorMessage: 'Failed to fetch sessions',
  });

  const sessions = useMemo<FocusSession[]>(
    () => query.data?.pages.flatMap((page) => page.sessions) ?? [],
    [query.data]
  );

  return {
    ...query,
    sessions,
  };
}
