import { useEffect, useRef, useState } from 'react';
import { calculateRemainingSeconds } from '../../utils/timer-calculations';
import type { FocusSession } from '../types';

export function useTimerLogic(activeSession: FocusSession | null | undefined) {
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    if (!activeSession) {
      setIsCompleted(false);
      setRemainingSeconds(0);
      hasCompletedRef.current = false;
      return;
    }

    const updateTimer = () => {
      const remaining = calculateRemainingSeconds(
        activeSession.startedAt,
        activeSession.durationMinutes,
        activeSession.totalPausedSeconds,
        activeSession.pausedAt
      );

      if (remaining <= 0 && !hasCompletedRef.current) {
        setRemainingSeconds(0);
        setIsCompleted(true);
        hasCompletedRef.current = true;
      } else if (remaining > 0) {
        setRemainingSeconds(remaining);
      }
    };

    updateTimer();

    if (activeSession.status === 'ACTIVE') {
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [activeSession]);

  return { remainingSeconds, isCompleted, setIsCompleted };
}
