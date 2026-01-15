'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useSetAtom } from 'jotai';
import {
  CircleIcon,
  FolderIcon,
  ListPlusIcon,
  PartyPopperIcon,
  PlusIcon,
} from 'lucide-react';
import { ContentCard } from '../../components/content-card';
import {
  bulkAddTasksSheetAtom,
  createProjectDialogAtom,
  createTaskDialogAtom,
} from '../../tasks/atoms/task-dialogs';
import { TaskListItem } from '../../tasks/components/task-list/task-list-item';
import { useDashboardTasks } from '../hooks/use-dashboard-tasks';

function DashboardTaskListSkeleton() {
  return (
    <div className="my-4 space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 pb-3">
          <Skeleton className="mt-0.5 size-4 rounded-sm" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="size-8" />
        </div>
      ))}
    </div>
  );
}

const DashboardTaskListActions = () => {
  const setCreateTaskDialog = useSetAtom(createTaskDialogAtom);
  const setCreateProjectDialog = useSetAtom(createProjectDialogAtom);
  const setBulkAddTasksSheet = useSetAtom(bulkAddTasksSheetAtom);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline">
          <PlusIcon />
          New
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => setCreateTaskDialog(true)}>
          <CircleIcon />
          Task
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setBulkAddTasksSheet(true)}>
          <ListPlusIcon />
          Bulk Tasks
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setCreateProjectDialog(true)}>
          <FolderIcon />
          Project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const DashboardTaskList = () => {
  const { data: tasks = [], isLoading } = useDashboardTasks();

  const renderContent = () => {
    if (isLoading) {
      return <DashboardTaskListSkeleton />;
    }

    if (tasks.length === 0) {
      return (
        <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 py-16 text-center">
          <PartyPopperIcon className="mb-2 size-12 stroke-1 opacity-50" />
          <p className="text-sm font-medium">All caught up!</p>
          <p className="text-xs">No pending tasks</p>
        </div>
      );
    }

    return (
      <ul className="mt-6 space-y-3">
        {tasks.map((task) => (
          <TaskListItem key={task.id} task={task} />
        ))}
      </ul>
    );
  };

  return (
    <ContentCard
      title="Up Next"
      action={<DashboardTaskListActions />}
      isDashboard
    >
      {renderContent()}
    </ContentCard>
  );
};
