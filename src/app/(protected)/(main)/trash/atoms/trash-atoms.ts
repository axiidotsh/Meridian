import { atom } from 'jotai';

export const selectedTrashTasksAtom = atom<Set<string>>(new Set<string>());
export const selectedTrashHabitsAtom = atom<Set<string>>(new Set<string>());
export const selectedTrashSessionsAtom = atom<Set<string>>(new Set<string>());
