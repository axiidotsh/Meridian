import type { Habit } from '@/app/(protected)/(main)/habits/hooks/types';
import { atom } from 'jotai';

export const createDialogOpenAtom = atom(false);
export const editDialogOpenAtom = atom(false);
export const deleteDialogOpenAtom = atom(false);

export const editingHabitAtom = atom<Habit | null>(null);
export const deletingHabitAtom = atom<Habit | null>(null);
