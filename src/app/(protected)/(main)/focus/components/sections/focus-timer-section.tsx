'use client';

import { ErrorState } from '@/components/error-state';
import { useActiveSession } from '../../hooks/queries/use-active-session';
import { TimerSkeleton } from '../skeletons/timer-skeleton';
import { FocusTimer } from '../timer/focus-timer';

export const FocusTimerSection = () => {
  const {
    data: activeSession,
    isLoading,
    isError,
    refetch,
  } = useActiveSession();

  if (isError) {
    return (
      <ErrorState
        onRetry={refetch}
        title="Failed to load session"
        description="Unable to fetch active session. Please try again."
      />
    );
  }

  if (isLoading) {
    return <TimerSkeleton />;
  }

  return <FocusTimer activeSession={activeSession} />;
};
