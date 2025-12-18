import { atom } from 'jotai';

export const createDialogOpenAtom = atom(false);
export const editDialogOpenAtom = atom(false);
export const deleteDialogOpenAtom = atom(false);

export const editingHabitIdAtom = atom<string | null>(null);
export const deletingHabitIdAtom = atom<string | null>(null);
