import type { Task, TaskPriority } from '../hooks/types';

export type SortOption = 'dueDate' | 'priority' | 'title' | 'completed';

const PRIORITY_ORDER: Record<TaskPriority, number> = {
  HIGH: 0,
  MEDIUM: 1,
  LOW: 2,
};

export function filterTasks(
  tasks: Task[],
  query: string,
  tagFilters: string[],
  projectFilters: string[]
): Task[] {
  let filtered = tasks;

  if (query.trim()) {
    const lowerQuery = query.toLowerCase();
    filtered = filtered.filter((task) => {
      const titleMatch = task.title.toLowerCase().includes(lowerQuery);
      const tagsMatch = task.tags?.some((tag: string) =>
        tag.toLowerCase().includes(lowerQuery)
      );
      const projectMatch = task.project?.name
        ?.toLowerCase()
        .includes(lowerQuery);
      return titleMatch || tagsMatch || projectMatch;
    });
  }

  if (tagFilters.length > 0) {
    filtered = filtered.filter((task) =>
      tagFilters.some((tag) => task.tags?.includes(tag))
    );
  }

  if (projectFilters.length > 0) {
    filtered = filtered.filter((task) =>
      task.projectId ? projectFilters.includes(task.projectId) : false
    );
  }

  return filtered;
}

export function sortTasks(tasks: Task[], sortBy: SortOption): Task[] {
  return [...tasks].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case 'priority':
        return (
          PRIORITY_ORDER[a.priority as TaskPriority] -
          PRIORITY_ORDER[b.priority as TaskPriority]
        );
      case 'title':
        return a.title.localeCompare(b.title);
      case 'completed':
        return a.completed === b.completed ? 0 : a.completed ? 1 : -1;
      default:
        return 0;
    }
  });
}

export function groupTasksByDueDate(tasks: Task[]) {
  const groups = {
    overdue: [] as Task[],
    dueToday: [] as Task[],
    dueThisWeek: [] as Task[],
    upcoming: [] as Task[],
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  tasks.forEach((task) => {
    if (!task.dueDate) {
      groups.upcoming.push(task);
      return;
    }

    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      groups.overdue.push(task);
    } else if (diffDays === 0) {
      groups.dueToday.push(task);
    } else if (diffDays <= 7) {
      groups.dueThisWeek.push(task);
    } else {
      groups.upcoming.push(task);
    }
  });

  return groups;
}

export function formatDueDate(date: Date | string): string {
  const dueDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `${Math.abs(diffDays)} days overdue`;
  }
  if (diffDays === 0) {
    return 'Due today';
  }
  if (diffDays === 1) {
    return 'Due tomorrow';
  }
  if (diffDays <= 7) {
    return `Due in ${diffDays} days`;
  }
  return dueDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function isOverdue(date: Date | string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(date);
  dueDate.setHours(0, 0, 0, 0);
  return dueDate < today;
}
