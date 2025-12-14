import { atom } from 'jotai';
import type { Project, Task } from '../hooks/types';

export const createTaskDialogAtom = atom(false);
export const editingTaskAtom = atom<Task | null>(null);
export const deletingTaskAtom = atom<Task | null>(null);

export const createProjectDialogAtom = atom(false);
export const editingProjectAtom = atom<Project | null>(null);
export const deletingProjectAtom = atom<Project | null>(null);

export const bulkAddTasksSheetAtom = atom(false);
