import { addUTCDays } from '@/utils/date-utc';
import type { Task, TaskStats } from '../hooks/types';

export function calculateTaskStats(tasks: Task[]): TaskStats {
  const now = new Date();
  const startOfWeek = addUTCDays(now, -now.getUTCDay());

  const tasksThisWeek = tasks.filter(
    (task) => new Date(task.createdAt) >= startOfWeek
  );

  const total = tasksThisWeek.length;
  const completed = tasksThisWeek.filter((task) => task.completed).length;
  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    pending,
    completionRate,
  };
}
