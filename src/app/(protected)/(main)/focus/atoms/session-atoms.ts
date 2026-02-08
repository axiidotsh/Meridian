import { atomWithStorage } from 'jotai/utils';

export type SessionSortOption = 'name' | 'duration' | 'date';
export type SessionSortOrder = 'asc' | 'desc';

export const sessionSortByAtom = atomWithStorage<SessionSortOption>(
  'session-sort-by',
  'date',
  undefined,
  { getOnInit: true }
);
export const sessionSortOrderAtom = atomWithStorage<SessionSortOrder>(
  'session-sort-order',
  'desc',
  undefined,
  { getOnInit: true }
);
