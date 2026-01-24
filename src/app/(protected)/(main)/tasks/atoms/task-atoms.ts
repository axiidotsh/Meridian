import { atom } from 'jotai';

export type SortOption =
  | 'dueDate'
  | 'priority'
  | 'title'
  | 'completed'
  | 'createdAt';

export type SortOrder = 'asc' | 'desc';

export const sortByAtom = atom<SortOption>('dueDate');
export const sortOrderAtom = atom<SortOrder>('asc');
export const searchQueryAtom = atom('');
export const selectedTagsAtom = atom<string[]>([]);
export const selectedProjectsAtom = atom<string[]>([]);
