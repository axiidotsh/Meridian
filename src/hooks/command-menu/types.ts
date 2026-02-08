import type { FocusSession } from '@/app/(protected)/(main)/focus/hooks/types';
import type { Habit } from '@/app/(protected)/(main)/habits/hooks/types';
import type { Project, Task } from '@/app/(protected)/(main)/tasks/hooks/types';
import type { ComponentType } from 'react';

export type CommandMenuItem =
  | { type: 'todo'; data: Task }
  | { type: 'project'; data: Project }
  | { type: 'habit'; data: Habit }
  | { type: 'session'; data: FocusSession }
  | { type: 'focus-start' }
  | { type: 'focus-duration' }
  | { type: 'task-priority' };

export interface CommandDefinition {
  id: string;
  name: string;
  icon: ComponentType<{ className?: string }>;
  keywords?: string[];
  destructive?: boolean;
  category:
    | 'page'
    | 'focus'
    | 'create'
    | 'theme'
    | 'position'
    | 'account'
    | 'settings'
    | 'trash';
  handler: () => void | Promise<void>;
}

export interface CommandMenuState {
  open: boolean;
  searchValue: string;
  selectedValue: string;
  selectedItem: CommandMenuItem | null;
}

export type CommandHistoryEntry =
  | { kind: 'command'; commandId: string; timestamp: number }
  | {
      kind: 'item';
      itemType: 'todo' | 'project' | 'habit' | 'session';
      itemId: string;
      timestamp: number;
    }
  | {
      kind: 'item';
      itemType: 'focus-start' | 'focus-duration' | 'task-priority';
      timestamp: number;
    };

export function getHistoryEntryKey(entry: CommandHistoryEntry): string {
  if (entry.kind === 'command') return `command:${entry.commandId}`;
  if ('itemId' in entry) return `item:${entry.itemType}:${entry.itemId}`;
  return `item:${entry.itemType}`;
}
