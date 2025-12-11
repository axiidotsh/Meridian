'use client';

import { PageHeading } from '@/components/page-heading';
import { Button } from '@/components/ui/button';
import { useAtomValue } from 'jotai';
import {
  ClockPlusIcon,
  FlameIcon,
  Settings2Icon,
  TimerIcon,
  TrophyIcon,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { ContentCard } from '../components/content-card';
import { MetricCard } from '../components/metric-card';
import { selectedMinutesAtom } from './atoms/duration';
import { DurationDropdown } from './components/duration-dropdown';
import { FocusErrorState } from './components/focus-error-state';
import { FocusTimer } from './components/focus-timer';
import { SessionDeleteDialog } from './components/session-delete-dialog';
import { SessionDurationChart } from './components/session-duration-chart';
import { SessionEditDialog } from './components/session-edit-dialog';
import { SessionListItem } from './components/session-list-item';
import { RecentSessionsSkeleton } from './components/skeletons/recent-sessions-skeleton';
import { TimerSkeleton } from './components/skeletons/timer-skeleton';
import type { FocusSession } from './hooks/types';
import { useActiveSession } from './hooks/use-active-session';
import { useFocusStats } from './hooks/use-focus-stats';
import { useRecentSessions } from './hooks/use-recent-sessions';
import { useSessionMetrics } from './hooks/use-session-metrics';
import { generateChartData, getTotalFocusTime } from './utils/session-metrics';

export default function FocusPage() {
  const searchParams = useSearchParams();
  const taskId = searchParams.get('taskId');

  const {
    data: activeSession,
    isLoading: isLoadingActive,
    isError: isActiveError,
    refetch: refetchActive,
  } = useActiveSession();
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

  const selectedMinutes = useAtomValue(selectedMinutesAtom);
  const [editingSession, setEditingSession] = useState<FocusSession | null>(
    null
  );
  const [deletingSession, setDeletingSession] = useState<FocusSession | null>(
    null
  );

  const hasActiveSession =
    activeSession?.status === 'ACTIVE' || activeSession?.status === 'PAUSED';

  const totalFocusTime = getTotalFocusTime(recentSessions);
  const chartData = generateChartData(recentSessions);
  const metrics = useSessionMetrics(recentSessions, focusStats);

  const hasError = isActiveError || isSessionsError || isStatsError;
  const isLoadingMetrics = isLoadingSessions || isLoadingStats;

  const handleRetry = () => {
    if (isActiveError) refetchActive();
    if (isSessionsError) refetchSessions();
    if (isStatsError) refetchStats();
  };

  if (hasError) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center justify-between gap-2">
          <PageHeading>Focus</PageHeading>
        </div>
        <FocusErrorState onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between gap-2">
        <PageHeading>Focus</PageHeading>
        <Button
          size="icon-sm"
          variant="ghost"
          tooltip="Configure dashboard cards"
        >
          <Settings2Icon />
        </Button>
      </div>
      <div className="mt-4 space-y-4">
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
            title="Highest Ever"
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
        <ContentCard
          title={
            hasActiveSession ? 'Focus Session' : 'Start a new focus session'
          }
          action={<DurationDropdown hasActiveSession={hasActiveSession} />}
        >
          {isLoadingActive ? (
            <TimerSkeleton />
          ) : (
            <FocusTimer
              activeSession={activeSession}
              taskId={taskId}
              selectedMinutes={selectedMinutes}
            />
          )}
        </ContentCard>
        <ContentCard title="Recent Sessions">
          {isLoadingSessions ? (
            <RecentSessionsSkeleton />
          ) : recentSessions.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center text-sm">
              No sessions yet. Start your first focus session!
            </p>
          ) : (
            <ul className="mt-4 space-y-4">
              {recentSessions.slice(0, 5).map((session) => (
                <SessionListItem
                  key={session.id}
                  session={session}
                  onEdit={setEditingSession}
                  onDelete={setDeletingSession}
                />
              ))}
            </ul>
          )}
        </ContentCard>
        <SessionDurationChart data={chartData} isLoading={isLoadingSessions} />
      </div>
      <SessionEditDialog
        session={editingSession}
        open={!!editingSession}
        onOpenChange={(open) => !open && setEditingSession(null)}
      />
      <SessionDeleteDialog
        session={deletingSession}
        open={!!deletingSession}
        onOpenChange={(open) => !open && setDeletingSession(null)}
      />
    </div>
  );
}
