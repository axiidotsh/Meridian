'use client';

import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useHabitStats } from '../../hooks/queries/use-habit-stats';

export const HabitMetricsBadges = () => {
  const { data: stats, isLoading } = useHabitStats();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-24" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="flex items-center gap-2">
      <Badge variant="secondary" className="gap-1.5">
        {stats.completedToday}/{stats.totalHabits} done
      </Badge>
      {stats.activeStreakCount > 0 && (
        <Badge
          variant="outline"
          className="gap-1.5 border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
        >
          {stats.activeStreakCount} on streak
        </Badge>
      )}
    </div>
  );
};
