import type { CommandMenuItem } from '@/components/command-menu/types';
import type { CommandHistoryEntry } from '@/hooks/command-menu/types';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const selectedItemAtom = atom<CommandMenuItem | null>(null);
export const commandMenuOpenAtom = atom(false);
export const commandSearchValueAtom = atom('');
export const commandHistoryAtom = atomWithStorage<CommandHistoryEntry[]>(
  'command-history',
  []
);
