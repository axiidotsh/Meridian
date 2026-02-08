import { commandHistoryAtom } from '@/atoms/command-menu-atoms';
import type {
  CommandDefinition,
  CommandHistoryEntry,
  CommandMenuItem,
} from '@/hooks/command-menu/types';
import { getHistoryEntryKey } from '@/hooks/command-menu/types';
import type { useCommandItems } from '@/hooks/command-menu/use-command-items';
import { useAtom } from 'jotai';
import { useCallback, useMemo } from 'react';

const MAX_HISTORY = 5;

type ResolvedHistoryEntry =
  | { kind: 'command'; command: CommandDefinition; entry: CommandHistoryEntry }
  | { kind: 'item'; item: CommandMenuItem; entry: CommandHistoryEntry };

interface UseCommandHistoryParams {
  commands: CommandDefinition[];
  items: ReturnType<typeof useCommandItems>;
}

export function useCommandHistory({
  commands,
  items,
}: UseCommandHistoryParams) {
  const [history, setHistory] = useAtom(commandHistoryAtom);

  const commandsMap = useMemo(
    () => new Map(commands.map((cmd) => [cmd.id, cmd])),
    [commands]
  );

  const addCommandToHistory = useCallback(
    (commandId: string) => {
      setHistory((prev) => {
        const key = `command:${commandId}`;
        const filtered = prev.filter((e) => getHistoryEntryKey(e) !== key);
        const entry: CommandHistoryEntry = {
          kind: 'command',
          commandId,
          timestamp: Date.now(),
        };
        return [entry, ...filtered].slice(0, MAX_HISTORY);
      });
    },
    [setHistory]
  );

  const addItemToHistory = useCallback(
    (item: CommandMenuItem) => {
      setHistory((prev) => {
        const entry = commandMenuItemToHistoryEntry(item);
        const key = getHistoryEntryKey(entry);
        const filtered = prev.filter((e) => getHistoryEntryKey(e) !== key);
        return [entry, ...filtered].slice(0, MAX_HISTORY);
      });
    },
    [setHistory]
  );

  const resolvedHistory = useMemo((): ResolvedHistoryEntry[] => {
    const result: ResolvedHistoryEntry[] = [];

    for (const entry of history) {
      if (entry.kind === 'command') {
        const command = commandsMap.get(entry.commandId);
        if (command) {
          result.push({ kind: 'command', command, entry });
        }
        continue;
      }

      if ('itemId' in entry) {
        const mapKey = `${entry.itemType}:${entry.itemId}`;
        const item = items.itemsByIdMap.get(mapKey);
        if (item) {
          result.push({ kind: 'item', item, entry });
        }
        continue;
      }

      const settingsItem: CommandMenuItem = { type: entry.itemType };
      result.push({ kind: 'item', item: settingsItem, entry });
    }

    return result;
  }, [history, commandsMap, items.itemsByIdMap]);

  return { resolvedHistory, addCommandToHistory, addItemToHistory };
}

function commandMenuItemToHistoryEntry(
  item: CommandMenuItem
): CommandHistoryEntry {
  const timestamp = Date.now();

  switch (item.type) {
    case 'todo':
      return {
        kind: 'item',
        itemType: 'todo',
        itemId: item.data.id,
        timestamp,
      };
    case 'project':
      return {
        kind: 'item',
        itemType: 'project',
        itemId: item.data.id,
        timestamp,
      };
    case 'habit':
      return {
        kind: 'item',
        itemType: 'habit',
        itemId: item.data.id,
        timestamp,
      };
    case 'session':
      return {
        kind: 'item',
        itemType: 'session',
        itemId: item.data.id,
        timestamp,
      };
    case 'focus-start':
      return { kind: 'item', itemType: 'focus-start', timestamp };
    case 'focus-duration':
      return { kind: 'item', itemType: 'focus-duration', timestamp };
    case 'task-priority':
      return { kind: 'item', itemType: 'task-priority', timestamp };
  }
}

export type { ResolvedHistoryEntry };
