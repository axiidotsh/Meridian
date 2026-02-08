'use client';

import type { CommandMenuItem } from '@/components/command-menu/types';
import { CommandItem } from '@/components/ui/command';
import { Kbd } from '@/components/ui/kbd';
import type { CommandDefinition } from '@/hooks/command-menu/types';
import { cn } from '@/utils/utils';
import {
  CheckCircle2Icon,
  CircleIcon,
  ClockPlusIcon,
  FolderIcon,
  PlayIcon,
  SignalIcon,
  TimerIcon,
} from 'lucide-react';

interface CommandItemBaseProps {
  onSelect: () => void;
  className?: string;
}

interface CommandDefinitionItemProps extends CommandItemBaseProps {
  command: CommandDefinition;
  valuePrefix?: string;
}

export const CommandDefinitionItem = ({
  command,
  onSelect,
  className,
  valuePrefix = '',
}: CommandDefinitionItemProps) => {
  return (
    <CommandItem
      value={`${valuePrefix}${[command.id, command.name, ...(command.keywords ?? [])].join(' ')}`}
      onSelect={onSelect}
      className={cn(command.destructive && 'text-destructive!', className)}
    >
      <command.icon
        className={cn('size-3.5', command.destructive && 'text-destructive!')}
      />
      <span>{command.name}</span>
    </CommandItem>
  );
};

interface TodoItemProps extends CommandItemBaseProps {
  item: Extract<CommandMenuItem, { type: 'todo' }>;
  showActions?: boolean;
  valuePrefix?: string;
}

export const TodoItem = ({
  item,
  onSelect,
  showActions = true,
  className,
  valuePrefix = '',
}: TodoItemProps) => {
  return (
    <CommandItem
      value={`${valuePrefix}todo:${item.data.id}:${item.data.title}`}
      onSelect={onSelect}
      className={className}
    >
      {item.data.completed ? (
        <CheckCircle2Icon className="text-muted-foreground size-3.5" />
      ) : (
        <CircleIcon className="size-3.5" />
      )}
      <span
        className={cn(
          'line-clamp-2',
          item.data.completed ? 'text-muted-foreground line-through' : ''
        )}
      >
        {item.data.title}
      </span>
      {showActions && (
        <span className="text-muted-foreground ml-auto flex items-center gap-1 text-xs">
          Actions
          <Kbd>↵</Kbd>
        </span>
      )}
    </CommandItem>
  );
};

interface ProjectItemProps extends CommandItemBaseProps {
  item: Extract<CommandMenuItem, { type: 'project' }>;
  showActions?: boolean;
  valuePrefix?: string;
}

export const ProjectItem = ({
  item,
  onSelect,
  showActions = true,
  className,
  valuePrefix = '',
}: ProjectItemProps) => {
  return (
    <CommandItem
      value={`${valuePrefix}project:${item.data.id}:${item.data.name}`}
      onSelect={onSelect}
      className={className}
    >
      <FolderIcon className="size-3.5" />
      <span className="line-clamp-2">{item.data.name}</span>
      {showActions && (
        <span className="text-muted-foreground ml-auto flex items-center gap-1 text-xs">
          Actions
          <Kbd>↵</Kbd>
        </span>
      )}
    </CommandItem>
  );
};

interface HabitItemProps extends CommandItemBaseProps {
  item: Extract<CommandMenuItem, { type: 'habit' }>;
  showActions?: boolean;
  valuePrefix?: string;
}

export const HabitItem = ({
  item,
  onSelect,
  showActions = true,
  className,
  valuePrefix = '',
}: HabitItemProps) => {
  return (
    <CommandItem
      value={`${valuePrefix}habit:${item.data.id}:${item.data.title}`}
      onSelect={onSelect}
      className={className}
    >
      <TimerIcon className="size-3.5" />
      <span className="line-clamp-2">{item.data.title}</span>
      {showActions && (
        <span className="text-muted-foreground ml-auto flex items-center gap-1 text-xs">
          Actions
          <Kbd>↵</Kbd>
        </span>
      )}
    </CommandItem>
  );
};

interface SessionItemProps extends CommandItemBaseProps {
  item: Extract<CommandMenuItem, { type: 'session' }>;
  showActions?: boolean;
  valuePrefix?: string;
}

export const SessionItem = ({
  item,
  onSelect,
  showActions = true,
  className,
  valuePrefix = '',
}: SessionItemProps) => {
  return (
    <CommandItem
      value={`${valuePrefix}session:${item.data.id}:${item.data.task || 'Focus session'}`}
      onSelect={onSelect}
      className={className}
    >
      <ClockPlusIcon className="size-3.5" />
      <span className="line-clamp-2">{item.data.task || 'Focus session'}</span>
      <span className="text-muted-foreground text-xs">
        {item.data.durationMinutes}m
      </span>
      {showActions && (
        <span className="text-muted-foreground ml-auto flex items-center gap-1 text-xs">
          Actions
          <Kbd>↵</Kbd>
        </span>
      )}
    </CommandItem>
  );
};

interface FocusStartItemProps extends CommandItemBaseProps {
  valuePrefix?: string;
}

export const FocusStartItem = ({
  onSelect,
  className,
  valuePrefix = '',
}: FocusStartItemProps) => {
  return (
    <CommandItem
      value={`${valuePrefix}start focus session begin timer pomodoro work`}
      onSelect={onSelect}
      className={className}
    >
      <PlayIcon className="size-3.5" />
      <span>Start focus session</span>
      <span className="text-muted-foreground ml-auto flex items-center gap-1 text-xs">
        Actions
        <Kbd>↵</Kbd>
      </span>
    </CommandItem>
  );
};

interface FocusDurationItemProps extends CommandItemBaseProps {
  valuePrefix?: string;
}

export const FocusDurationItem = ({
  onSelect,
  className,
  valuePrefix = '',
}: FocusDurationItemProps) => {
  return (
    <CommandItem
      value={`${valuePrefix}set default focus duration timer minutes session pomodoro`}
      onSelect={onSelect}
      className={className}
    >
      <TimerIcon className="size-3.5" />
      <span>Set default focus duration</span>
      <span className="text-muted-foreground ml-auto flex items-center gap-1 text-xs">
        Actions
        <Kbd>↵</Kbd>
      </span>
    </CommandItem>
  );
};

interface TaskPriorityItemProps extends CommandItemBaseProps {
  valuePrefix?: string;
}

export const TaskPriorityItem = ({
  onSelect,
  className,
  valuePrefix = '',
}: TaskPriorityItemProps) => {
  return (
    <CommandItem
      value={`${valuePrefix}set default task priority low medium high`}
      onSelect={onSelect}
      className={className}
    >
      <SignalIcon className="size-3.5" />
      <span>Set default task priority</span>
      <span className="text-muted-foreground ml-auto flex items-center gap-1 text-xs">
        Actions
        <Kbd>↵</Kbd>
      </span>
    </CommandItem>
  );
};

interface SearchItemProps extends CommandItemBaseProps {
  item: CommandMenuItem;
  showActions?: boolean;
  valuePrefix?: string;
}

export const SearchItem = ({
  item,
  onSelect,
  showActions = true,
  className,
  valuePrefix,
}: SearchItemProps) => {
  switch (item.type) {
    case 'todo':
      return (
        <TodoItem
          item={item}
          onSelect={onSelect}
          showActions={showActions}
          className={className}
          valuePrefix={valuePrefix}
        />
      );
    case 'project':
      return (
        <ProjectItem
          item={item}
          onSelect={onSelect}
          showActions={showActions}
          className={className}
          valuePrefix={valuePrefix}
        />
      );
    case 'habit':
      return (
        <HabitItem
          item={item}
          onSelect={onSelect}
          showActions={showActions}
          className={className}
          valuePrefix={valuePrefix}
        />
      );
    case 'session':
      return (
        <SessionItem
          item={item}
          onSelect={onSelect}
          showActions={showActions}
          className={className}
          valuePrefix={valuePrefix}
        />
      );
    case 'focus-start':
      return (
        <FocusStartItem
          onSelect={onSelect}
          className={className}
          valuePrefix={valuePrefix}
        />
      );
    case 'focus-duration':
      return (
        <FocusDurationItem
          onSelect={onSelect}
          className={className}
          valuePrefix={valuePrefix}
        />
      );
    case 'task-priority':
      return (
        <TaskPriorityItem
          onSelect={onSelect}
          className={className}
          valuePrefix={valuePrefix}
        />
      );
    default:
      return null;
  }
};
