import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { calculateRemainingSeconds } from '../utils/timer-calculations';
import type { FocusSession } from './types';

export function useTimerLogic(activeSession: FocusSession | null | undefined) {
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const hasShownToastRef = useRef(false);

  useEffect(() => {
    if (!activeSession) {
      setIsCompleted(false);
      setRemainingSeconds(0);
      hasShownToastRef.current = false;
      return;
    }

    const updateTimer = () => {
      const remaining = calculateRemainingSeconds(
        activeSession.startedAt,
        activeSession.durationMinutes,
        activeSession.totalPausedSeconds,
        activeSession.pausedAt
      );

      if (remaining <= 0 && !isCompleted && !hasShownToastRef.current) {
        setRemainingSeconds(0);
        setIsCompleted(true);
        hasShownToastRef.current = true;
        toast.success('Session complete!', {
          description: `You completed ${activeSession.durationMinutes} minutes${activeSession.task ? ` on "${activeSession.task}"` : ''}`,
        });
      } else if (!isCompleted) {
        setRemainingSeconds(remaining);
      }
    };

    updateTimer();

    if (activeSession.status === 'ACTIVE' && !isCompleted) {
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [activeSession, isCompleted]);

  return { remainingSeconds, isCompleted, setIsCompleted };
}
