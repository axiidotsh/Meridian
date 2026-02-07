import { atom } from 'jotai';

export const logoutDialogOpenAtom = atom(false);
export const sessionKeyAtom = atom(0);

export type EmptyTrashTarget = 'tasks' | 'habits' | 'sessions' | 'all' | null;
export const emptyTrashDialogAtom = atom<EmptyTrashTarget>(null);
