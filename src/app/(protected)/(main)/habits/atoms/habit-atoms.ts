import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export type SortOption = 'currentStreak' | 'bestStreak' | 'title' | 'createdAt';
export type SortOrder = 'asc' | 'desc';
export type FilterOption = 'all' | 'completed' | 'pending';

export const sortByAtom = atomWithStorage<SortOption>(
  'habit-sort-by',
  'title',
  undefined,
  { getOnInit: true }
);
export const sortOrderAtom = atomWithStorage<SortOrder>(
  'habit-sort-order',
  'asc',
  undefined,
  { getOnInit: true }
);
export const searchQueryAtom = atom('');
export const statusFilterAtom = atom<FilterOption>('all');
