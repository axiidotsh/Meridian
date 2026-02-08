import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export type SortOption =
  | 'dueDate'
  | 'priority'
  | 'title'
  | 'completed'
  | 'createdAt';

export type SortOrder = 'asc' | 'desc';

export type TaskView = 'list' | 'kanban';

export const sortByAtom = atomWithStorage<SortOption>(
  'task-sort-by',
  'dueDate',
  undefined,
  { getOnInit: true }
);
export const sortOrderAtom = atomWithStorage<SortOrder>(
  'task-sort-order',
  'asc',
  undefined,
  { getOnInit: true }
);
export const searchQueryAtom = atom('');
export const selectedTagsAtom = atom<string[]>([]);
export const selectedProjectsAtom = atom<string[]>([]);
export const taskViewAtom = atomWithStorage<TaskView>('task-view', 'list');
