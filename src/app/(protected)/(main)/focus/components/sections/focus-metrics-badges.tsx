'use client';

import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useRecentSessions } from '../../hooks/queries/use-recent-sessions';
import { getTotalFocusTime } from '../../utils/session-metrics';

export const FocusMetricsBadges = () => {
  const { data: recentSessions = [], isLoading } = useRecentSessions(20);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-24" />
      </div>
    );
  }

  const totalFocusTime = getTotalFocusTime(recentSessions);

  return (
    <div className="flex items-center gap-2">
      <Badge variant="secondary" className="gap-1.5">
        {totalFocusTime} today
      </Badge>
    </div>
  );
};
