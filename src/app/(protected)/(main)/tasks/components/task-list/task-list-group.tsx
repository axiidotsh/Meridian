'use client';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/utils/utils';
import { ChevronRightIcon } from 'lucide-react';
import { LIST_HEIGHT } from '../../constants';
import type { Task } from '../../hooks/types';
import { TaskListItem } from './task-list-item';

interface TaskListGroupProps {
  title: string;
  tasks: Task[];
  isOpen: boolean;
  onToggle: () => void;
}

export const TaskListGroup = ({
  title,
  tasks,
  isOpen,
  onToggle,
}: TaskListGroupProps) => {
  if (tasks.length === 0) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger className="text-muted-foreground hover:text-foreground flex w-full cursor-pointer items-center gap-2 py-2 text-sm font-medium transition-colors">
        <ChevronRightIcon
          className={cn('size-4 transition-transform', isOpen && 'rotate-90')}
        />
        <div className="flex items-center gap-2">
          <span>{title}</span>
          <div className="bg-foreground/10 flex items-center justify-center rounded-md px-1.5 py-0.5 text-xs">
            {tasks.length}
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-6">
        <ScrollArea className="mt-2">
          <div style={{ maxHeight: LIST_HEIGHT }}>
            <ul className="mb-4 space-y-3 pr-4">
              {tasks.map((task) => (
                <TaskListItem key={task.id} task={task} />
              ))}
            </ul>
          </div>
        </ScrollArea>
      </CollapsibleContent>
    </Collapsible>
  );
};
