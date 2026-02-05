import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/utils';
import type { TaskPriority } from '../../hooks/types';

function formatPriorityLabel(priority: TaskPriority): string {
  if (priority === 'NO_PRIORITY') return '';
  return priority.charAt(0) + priority.slice(1).toLowerCase();
}

interface PriorityBadgeProps {
  priority: TaskPriority;
  className?: string;
}

export const PriorityBadge = ({ priority, className }: PriorityBadgeProps) => {
  if (priority === 'NO_PRIORITY') {
    return null;
  }

  return (
    <Badge
      variant="secondary"
      className={cn(
        'border-0 text-xs',
        priority === 'LOW' &&
          'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-600/50 dark:bg-emerald-500/20 dark:text-emerald-400',
        priority === 'MEDIUM' &&
          'border-orange-200 bg-orange-100 text-orange-700 dark:border-orange-600/50 dark:bg-orange-500/20 dark:text-orange-400',
        priority === 'HIGH' &&
          'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-600/50 dark:bg-rose-500/20 dark:text-rose-400',
        className
      )}
    >
      {formatPriorityLabel(priority)}
    </Badge>
  );
};
