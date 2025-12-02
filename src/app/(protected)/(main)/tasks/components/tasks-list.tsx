import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/utils/utils';
import {
  ChevronRightIcon,
  ClipboardCheckIcon,
  DotIcon,
  EllipsisIcon,
  FolderIcon,
  ListChecksIcon,
  PencilIcon,
  Trash2Icon,
} from 'lucide-react';
import { useState } from 'react';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  tags?: string[];
  projectId?: string;
  projectName?: string;
}

const PROJECT_COLORS = {
  '1': 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30',
  '2': 'bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30',
  '3': 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30',
  '4': 'bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30',
} as Record<string, string>;

const getProjectColor = (projectId: string | undefined): string => {
  if (!projectId)
    return 'bg-zinc-500/20 text-zinc-700 dark:text-zinc-300 border-zinc-500/30';
  return (
    PROJECT_COLORS[projectId] ||
    'bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-500/30'
  );
};

interface TasksListProps {
  tasks: Task[];
  sortedTasks: Task[];
}

export function TasksList({ tasks, sortedTasks }: TasksListProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(['dueToday'])
  );

  const formatDueDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(date);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else if (diffDays <= 7) {
      return `Due in ${diffDays} days`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const isOverdue = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(date);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  const toggleSection = (section: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  // Group tasks by due date categories
  const groupedTasks = {
    overdue: [] as Task[],
    dueToday: [] as Task[],
    dueThisWeek: [] as Task[],
    upcoming: [] as Task[],
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  sortedTasks.forEach((task) => {
    if (!task.dueDate) {
      groupedTasks.upcoming.push(task);
      return;
    }

    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      groupedTasks.overdue.push(task);
    } else if (diffDays === 0) {
      groupedTasks.dueToday.push(task);
    } else if (diffDays <= 7) {
      groupedTasks.dueThisWeek.push(task);
    } else {
      groupedTasks.upcoming.push(task);
    }
  });

  const renderTaskItem = (task: Task) => (
    <li
      key={task.id}
      className="border-border flex items-start gap-3 border-b pb-3 last:border-0 last:pb-0"
    >
      <Checkbox
        checked={task.completed}
        className="mt-0.5"
        aria-label={`Mark task "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
      />
      <div className="flex flex-1 items-start justify-between gap-3">
        <div className="flex-1 space-y-1">
          <p
            className={`text-sm ${task.completed ? 'text-muted-foreground line-through' : ''}`}
          >
            {task.title}
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            {task.projectName && (
              <>
                <Badge
                  variant="outline"
                  className={`gap-1 ${getProjectColor(task.projectId)}`}
                >
                  <FolderIcon className="size-3" />
                  {task.projectName}
                </Badge>
                {(task.tags || task.dueDate) && (
                  <DotIcon className="text-muted-foreground size-3" />
                )}
              </>
            )}
            {task.tags && task.tags.length > 0 && (
              <>
                {task.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="dark:bg-secondary bg-foreground/10"
                  >
                    {tag}
                  </Badge>
                ))}
                {task.dueDate && (
                  <DotIcon className="text-muted-foreground size-3" />
                )}
              </>
            )}
            {task.dueDate && (
              <span
                className={cn(
                  'shrink-0 text-xs',
                  isOverdue(task.dueDate) && !task.completed
                    ? 'text-destructive'
                    : 'text-muted-foreground'
                )}
              >
                {formatDueDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon-sm"
            variant="ghost"
            className="shrink-0"
            aria-label="Task options"
            tooltip="Task options"
          >
            <EllipsisIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <PencilIcon />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive">
            <Trash2Icon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  );

  const renderSection = (
    sectionKey: string,
    title: string,
    tasksInSection: Task[]
  ) => {
    if (tasksInSection.length === 0) return null;

    return (
      <Collapsible
        open={openSections.has(sectionKey)}
        onOpenChange={() => toggleSection(sectionKey)}
      >
        <CollapsibleTrigger className="text-muted-foreground hover:text-foreground flex w-full cursor-pointer items-center gap-2 py-2 text-sm font-medium transition-colors">
          <ChevronRightIcon
            className={cn(
              'size-4 transition-transform',
              openSections.has(sectionKey) && 'rotate-90'
            )}
          />
          <div className="flex items-center gap-2">
            <span>{title}</span>
            <div className="bg-foreground/10 flex items-center justify-center rounded-md px-1.5 py-0.5 text-xs">
              {tasksInSection.length}
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-6">
          <ScrollArea className="mt-2">
            <div className="max-h-[600px]">
              <ul className="mb-4 space-y-3 pr-4">
                {tasksInSection.map(renderTaskItem)}
              </ul>
            </div>
          </ScrollArea>
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <div className="my-4">
      {tasks.length === 0 ? (
        <div className="text-muted-foreground flex h-[600px] flex-col items-center justify-center gap-2 text-center">
          <ClipboardCheckIcon className="size-12 opacity-20" />
          <p className="text-sm font-medium">No tasks yet</p>
          <p className="text-xs">Create your first task to get started</p>
        </div>
      ) : sortedTasks.length === 0 ? (
        <div className="text-muted-foreground flex h-[600px] flex-col items-center justify-center gap-2 text-center">
          <ListChecksIcon className="size-12 opacity-20" />
          <p className="text-sm font-medium">No tasks found</p>
          <p className="text-xs">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="space-y-1">
          {renderSection('overdue', 'Overdue', groupedTasks.overdue)}
          {renderSection('dueToday', 'Due Today', groupedTasks.dueToday)}
          {renderSection(
            'dueThisWeek',
            'Due this week',
            groupedTasks.dueThisWeek
          )}
          {renderSection('upcoming', 'Upcoming', groupedTasks.upcoming)}
        </div>
      )}
    </div>
  );
}
