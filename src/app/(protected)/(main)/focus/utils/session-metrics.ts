import {
  formatMinutesToTime,
  formatSessionDateTime,
  formatSessionTime,
} from '@/utils/date-format';
import { getUTCDateKey } from '@/utils/date-utc';
import type { FocusSession } from '../hooks/types';

export { formatMinutesToTime, formatSessionDateTime, formatSessionTime };

export function getTodaysCompletedSessions(
  sessions: FocusSession[]
): FocusSession[] {
  const now = new Date();
  const todayKey = getUTCDateKey(now);
  return sessions.filter((session) => {
    const sessionDate = new Date(session.startedAt);
    const sessionKey = getUTCDateKey(sessionDate);
    return sessionKey === todayKey && session.status === 'COMPLETED';
  });
}

export function getTotalFocusTime(sessions: FocusSession[]): string {
  const todaysSessions = getTodaysCompletedSessions(sessions);
  const totalMinutes = todaysSessions.reduce(
    (acc, session) => acc + session.durationMinutes,
    0
  );
  return formatMinutesToTime(totalMinutes);
}

export function getYesterdaysFocusMinutes(sessions: FocusSession[]): number {
  const now = new Date();
  const yesterday = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1)
  );
  const yesterdayKey = getUTCDateKey(yesterday);

  return sessions
    .filter((session) => {
      if (session.status !== 'COMPLETED') return false;
      const sessionDate = new Date(session.startedAt);
      const sessionKey = getUTCDateKey(sessionDate);
      return sessionKey === yesterdayKey;
    })
    .reduce((acc, session) => acc + session.durationMinutes, 0);
}

export function generateChartData(sessions: FocusSession[], days = 7) {
  const now = new Date();
  const chartData = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - i)
    );
    const dateKey = getUTCDateKey(date);

    const daySessions = sessions.filter((session) => {
      if (session.status !== 'COMPLETED') return false;
      const sessionDate = new Date(session.startedAt);
      const sessionKey = getUTCDateKey(sessionDate);
      return sessionKey === dateKey;
    });

    const totalDuration = daySessions.reduce(
      (acc, session) => acc + session.durationMinutes,
      0
    );

    const dateLabel =
      days <= 7
        ? date.toLocaleDateString('en-US', { weekday: 'short' })
        : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    chartData.push({
      date: dateLabel,
      duration: totalDuration,
    });
  }

  return chartData;
}
