'use client';

import { ContentCard } from '@/app/(protected)/(main)/components/content-card';
import { ErrorState } from '@/components/error-state';
import { useAtomValue } from 'jotai';
import { useSearchParams } from 'next/navigation';
import { selectedMinutesAtom } from '../../atoms/duration';
import { useActiveSession } from '../../hooks/queries/use-active-session';
import { TimerSkeleton } from '../skeletons/timer-skeleton';
import { DurationDropdown } from '../timer/duration-dropdown';
import { FocusTimer } from '../timer/focus-timer';

export const FocusTimerSection = () => {
  const searchParams = useSearchParams();
  const taskId = searchParams.get('taskId');
  const selectedMinutes = useAtomValue(selectedMinutesAtom);

  const {
    data: activeSession,
    isLoading,
    isError,
    refetch,
  } = useActiveSession();

  const hasActiveSession =
    activeSession?.status === 'ACTIVE' || activeSession?.status === 'PAUSED';

  if (isError) {
    return (
      <ErrorState
        onRetry={refetch}
        title="Failed to load session"
        description="Unable to fetch active session. Please try again."
      />
    );
  }

  return (
    <ContentCard
      title={hasActiveSession ? 'Focus Session' : 'Start a new focus session'}
      action={<DurationDropdown hasActiveSession={hasActiveSession} />}
    >
      {isLoading ? (
        <TimerSkeleton />
      ) : (
        <FocusTimer
          activeSession={activeSession}
          taskId={taskId}
          selectedMinutes={selectedMinutes}
        />
      )}
    </ContentCard>
  );
};
