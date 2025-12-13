'use client';

import { MetricCard } from '@/app/(protected)/(main)/components/metric-card';
import { ErrorState } from '@/components/error-state';
import { ClockPlusIcon, FlameIcon, TimerIcon, TrophyIcon } from 'lucide-react';
import { useSessionMetrics } from '../../hooks/derived/use-session-metrics';
import { useFocusStats } from '../../hooks/queries/use-focus-stats';
import { useRecentSessions } from '../../hooks/queries/use-recent-sessions';
import { getTotalFocusTime } from '../../utils/session-metrics';

export const FocusMetricsSection = () => {
  const {
    data: recentSessions = [],
    isLoading: isLoadingSessions,
    isError: isSessionsError,
    refetch: refetchSessions,
  } = useRecentSessions(20);
  const {
    data: focusStats,
    isLoading: isLoadingStats,
    isError: isStatsError,
    refetch: refetchStats,
  } = useFocusStats();
  const metrics = useSessionMetrics(recentSessions, focusStats);

  const isError = isSessionsError || isStatsError;
  const isLoadingMetrics = isLoadingSessions || isLoadingStats;

  const handleRetry = () => {
    if (isSessionsError) refetchSessions();
    if (isStatsError) refetchStats();
  };

  if (isError) {
    return (
      <ErrorState
        onRetry={handleRetry}
        title="Failed to load metrics"
        description="Unable to fetch session metrics. Please try again."
      />
    );
  }

  const totalFocusTime = getTotalFocusTime(recentSessions);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Sessions Today"
        icon={TimerIcon}
        content={metrics.todaysCompleted.length.toString()}
        footer={metrics.personalBestSessions}
        isLoading={isLoadingSessions || isLoadingMetrics}
      />
      <MetricCard
        title="Total Time Today"
        icon={ClockPlusIcon}
        content={totalFocusTime}
        footer={metrics.timeDiffLabel}
        isLoading={isLoadingSessions}
      />
      <MetricCard
        title="Best Day"
        icon={TrophyIcon}
        content={metrics.highestEver}
        footer={metrics.highestEverLabel}
        isLoading={isLoadingMetrics}
      />
      <MetricCard
        title="Current Streak"
        icon={FlameIcon}
        content={metrics.currentStreak}
        footer={metrics.bestStreak}
        isLoading={isLoadingMetrics}
      />
    </div>
  );
};
