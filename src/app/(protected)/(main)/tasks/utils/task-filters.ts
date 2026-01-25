import { formatDueDateLabel } from '@/utils/date-format';

export { formatDueDateLabel as formatDueDate };

function normalizeDateToMidnight(date: Date) {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

export function isOverdue(date: Date | string): boolean {
  const today = normalizeDateToMidnight(new Date());
  const dueDate = normalizeDateToMidnight(new Date(date));
  return dueDate < today;
}
