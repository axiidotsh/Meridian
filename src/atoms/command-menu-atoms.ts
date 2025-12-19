import type { FocusSession } from '@/app/(protected)/(main)/focus/hooks/types';
import type { Habit } from '@/app/(protected)/(main)/habits/hooks/types';
import type { Task } from '@/app/(protected)/(main)/tasks/hooks/types';
import { atom } from 'jotai';

type CommandMenuItem =
  | { type: 'todo'; data: Task }
  | { type: 'habit'; data: Habit }
  | { type: 'session'; data: FocusSession };

export const selectedItemAtom = atom<CommandMenuItem | null>(null);
export const actionsViewOpenAtom = atom(false);
