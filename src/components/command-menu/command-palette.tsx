import { CommandGroups } from '@/components/command-menu/command-groups';
import type { CommandMenuItem } from '@/components/command-menu/types';
import type { CommandDefinition } from '@/hooks/command-menu/types';
import type { ResolvedHistoryEntry } from '@/hooks/command-menu/use-command-history';
import { CommandMenuEmpty } from './command-menu-empty';

interface CommandPaletteProps {
  commands: CommandDefinition[];
  todos: CommandMenuItem[];
  projects: CommandMenuItem[];
  habits: CommandMenuItem[];
  sessions: CommandMenuItem[];
  showStartFocusItem: boolean;
  recentEntries: ResolvedHistoryEntry[];
  searchValue: string;
  onCommandSelect: (command: CommandDefinition) => void;
  onItemSelect: (item: CommandMenuItem) => void;
}

export const CommandPalette = ({
  commands,
  todos,
  projects,
  habits,
  sessions,
  showStartFocusItem,
  recentEntries,
  searchValue,
  onCommandSelect,
  onItemSelect,
}: CommandPaletteProps) => {
  return (
    <>
      <CommandMenuEmpty className="border-0" />
      <CommandGroups
        commands={commands}
        todos={todos}
        projects={projects}
        habits={habits}
        sessions={sessions}
        showStartFocusItem={showStartFocusItem}
        recentEntries={recentEntries}
        searchValue={searchValue}
        onCommandSelect={onCommandSelect}
        onItemSelect={onItemSelect}
      />
    </>
  );
};
