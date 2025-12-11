import { useMemo } from 'react';
import {
  formatMinutesToTime,
  getTodaysCompletedSessions,
  getYesterdaysFocusMinutes,
} from '../utils/session-metrics';
import type { FocusSession } from './types';

interface FocusStats {
  currentStreak: number;
  bestStreak: number;
  highestDailyMinutes: number;
  highestDailyDaysAgo: number | null;
  bestSessionsInDay: number;
}

export function useSessionMetrics(
  recentSessions: FocusSession[],
  focusStats: FocusStats | undefined
) {
  return useMemo(() => {
    const todaysCompleted = getTodaysCompletedSessions(recentSessions);
    const todayMinutes = todaysCompleted.reduce(
      (acc, session) => acc + session.durationMinutes,
      0
    );
    const yesterdayMinutes = getYesterdaysFocusMinutes(recentSessions);
    const timeDiff = todayMinutes - yesterdayMinutes;

    const currentStreak = focusStats?.currentStreak ?? 0;
    const bestStreak = focusStats?.bestStreak ?? 0;
    const highestDailyMinutes = focusStats?.highestDailyMinutes ?? 0;
    const highestDailyDaysAgo = focusStats?.highestDailyDaysAgo ?? null;
    const bestSessionsInDay = focusStats?.bestSessionsInDay ?? 0;

    return {
      todaysCompleted,
      timeDiff,
      timeDiffLabel:
        timeDiff >= 0
          ? `+${formatMinutesToTime(timeDiff)} from yesterday`
          : `${formatMinutesToTime(Math.abs(timeDiff))} less than yesterday`,
      highestEver: formatMinutesToTime(highestDailyMinutes),
      highestEverLabel:
        highestDailyDaysAgo === null
          ? 'No sessions yet'
          : highestDailyDaysAgo === 0
            ? 'Achieved today'
            : highestDailyDaysAgo === 1
              ? 'Achieved yesterday'
              : `Achieved ${highestDailyDaysAgo} days ago`,
      currentStreak: `${currentStreak} day${currentStreak !== 1 ? 's' : ''}`,
      bestStreak: `Personal Best: ${bestStreak} day${bestStreak !== 1 ? 's' : ''}`,
      personalBestSessions: `Personal Best: ${bestSessionsInDay} session${bestSessionsInDay !== 1 ? 's' : ''}`,
    };
  }, [recentSessions, focusStats]);
}
