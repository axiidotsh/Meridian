'use client';

import { useAtomValue } from 'jotai';
import { ClipboardCheckIcon, ListChecksIcon } from 'lucide-react';
import { useState } from 'react';
import { ContentCard } from '../../../components/content-card';
import { useTasks } from '../../hooks/queries/use-tasks';
import {
  filterTasks,
  groupTasksByDueDate,
  sortTasks,
} from '../../utils/task-filters';
import { TaskListSkeleton } from '../skeletons/task-list-skeleton';
import {
  searchQueryAtom,
  selectedProjectsAtom,
  selectedTagsAtom,
  sortByAtom,
} from '../task-atoms';
import { TaskListActions } from '../task-list/task-list-actions';
import { TaskListGroup } from '../task-list/task-list-group';

export const TaskListSection = () => {
  const { data: tasks = [], isLoading } = useTasks();
  const sortBy = useAtomValue(sortByAtom);
  const searchQuery = useAtomValue(searchQueryAtom);
  const selectedTags = useAtomValue(selectedTagsAtom);
  const selectedProjects = useAtomValue(selectedProjectsAtom);

  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(['dueToday'])
  );

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

  const filteredTasks = filterTasks(
    tasks,
    searchQuery,
    selectedTags,
    selectedProjects
  );
  const sortedTasks = sortTasks(filteredTasks, sortBy);
  const groupedTasks = groupTasksByDueDate(sortedTasks);

  const renderContent = () => {
    if (isLoading) {
      return <TaskListSkeleton />;
    }

    if (tasks.length === 0) {
      return (
        <div className="text-muted-foreground flex h-[600px] flex-col items-center justify-center gap-2 text-center">
          <ClipboardCheckIcon className="size-12 opacity-20" />
          <p className="text-sm font-medium">No tasks yet</p>
          <p className="text-xs">Create your first task to get started</p>
        </div>
      );
    }

    if (sortedTasks.length === 0) {
      return (
        <div className="text-muted-foreground flex h-[600px] flex-col items-center justify-center gap-2 text-center">
          <ListChecksIcon className="size-12 opacity-20" />
          <p className="text-sm font-medium">No tasks found</p>
          <p className="text-xs">Try adjusting your search or filters</p>
        </div>
      );
    }

    return (
      <div className="my-4 space-y-1">
        <TaskListGroup
          title="Overdue"
          tasks={groupedTasks.overdue}
          isOpen={openSections.has('overdue')}
          onToggle={() => toggleSection('overdue')}
        />
        <TaskListGroup
          title="Due Today"
          tasks={groupedTasks.dueToday}
          isOpen={openSections.has('dueToday')}
          onToggle={() => toggleSection('dueToday')}
        />
        <TaskListGroup
          title="Due this week"
          tasks={groupedTasks.dueThisWeek}
          isOpen={openSections.has('dueThisWeek')}
          onToggle={() => toggleSection('dueThisWeek')}
        />
        <TaskListGroup
          title="Upcoming"
          tasks={groupedTasks.upcoming}
          isOpen={openSections.has('upcoming')}
          onToggle={() => toggleSection('upcoming')}
        />
      </div>
    );
  };

  return (
    <ContentCard title="Task List" action={<TaskListActions tasks={tasks} />}>
      {renderContent()}
    </ContentCard>
  );
};
