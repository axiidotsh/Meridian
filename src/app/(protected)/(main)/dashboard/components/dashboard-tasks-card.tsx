'use client';

import { ContentCard } from '@/app/(protected)/(main)/components/content-card';
import { createTaskDialogAtom } from '@/app/(protected)/(main)/tasks/atoms/task-dialogs';
import { useToggleTask } from '@/app/(protected)/(main)/tasks/hooks/mutations/use-toggle-task';
import { useTasks } from '@/app/(protected)/(main)/tasks/hooks/queries/use-tasks';
import {
  formatDueDate,
  getDueDateUrgency,
} from '@/app/(protected)/(main)/tasks/utils/task-filters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils/utils';
import { useAtom } from 'jotai';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export function DashboardTasksCard() {
  const [, setCreateDialogOpen] = useAtom(createTaskDialogAtom);
  const { data: allTasks, isLoading } = useTasks();
  const toggleTask = useToggleTask();

  const displayTasks = allTasks?.slice(0, 10) || [];

  if (isLoading) {
    return (
      <ContentCard title="Tasks" contentClassName="mt-5">
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
      </ContentCard>
    );
  }

  return (
    <ContentCard
      title="Tasks"
      action={
        <Button
          size="icon-sm"
          variant="ghost"
          className="size-6"
          onClick={() => setCreateDialogOpen(true)}
        >
          <Plus />
        </Button>
      }
      contentClassName="mt-5"
    >
      {displayTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-2 py-20 text-center">
          <p className="text-muted-foreground text-sm">No tasks</p>
          <p className="text-muted-foreground text-xs">
            Create a task to get started
          </p>
        </div>
      ) : (
        <>
          <ScrollArea className="h-[300px]">
            <div>
              {displayTasks.map((task, index) => {
                const urgency = task.dueDate
                  ? getDueDateUrgency(task.dueDate)
                  : 'none';

                return (
                  <div key={task.id}>
                    <div className="flex items-start gap-3 py-3 transition-colors">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() =>
                          toggleTask.mutate({ param: { id: task.id } })
                        }
                        className="mt-0.5"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p
                            className={cn(
                              'truncate text-sm font-medium',
                              task.completed &&
                                'text-muted-foreground line-through'
                            )}
                          >
                            {task.title}
                          </p>
                          {task.project && (
                            <Badge
                              variant="outline"
                              style={{
                                borderColor: task.project.color || undefined,
                              }}
                              className="shrink-0"
                            >
                              {task.project.name}
                            </Badge>
                          )}
                        </div>

                        {task.tags && task.tags.length > 0 && (
                          <div className="mt-1.5 flex flex-wrap gap-1">
                            {task.tags.slice(0, 2).map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {task.tags.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{task.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      {task.dueDate && (
                        <div
                          className={cn(
                            'shrink-0 text-xs whitespace-nowrap',
                            urgency === 'overdue' && 'text-destructive',
                            urgency === 'today' && 'text-orange-500',
                            urgency === 'upcoming' && 'text-muted-foreground'
                          )}
                        >
                          {formatDueDate(task.dueDate)}
                        </div>
                      )}
                    </div>
                    {index < displayTasks.length - 1 && <Separator />}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
          <div className="mt-3">
            <Link href="/tasks">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground w-full text-xs"
              >
                View all
              </Button>
            </Link>
          </div>
        </>
      )}
    </ContentCard>
  );
}
