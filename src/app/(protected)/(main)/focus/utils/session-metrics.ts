import type { FocusSession } from '../hooks/types';

export function formatSessionTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatMinutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function getTodaysCompletedSessions(
  sessions: FocusSession[]
): FocusSession[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return sessions.filter((session) => {
    const sessionDate = new Date(session.startedAt);
    sessionDate.setHours(0, 0, 0, 0);
    return (
      sessionDate.getTime() === today.getTime() &&
      session.status === 'COMPLETED'
    );
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
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  return sessions
    .filter((session) => {
      if (session.status !== 'COMPLETED') return false;
      const sessionDate = new Date(session.startedAt);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === yesterday.getTime();
    })
    .reduce((acc, session) => acc + session.durationMinutes, 0);
}

export function generateChartData(sessions: FocusSession[], days = 7) {
  const today = new Date();
  const chartData = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const daySessions = sessions.filter((session) => {
      if (session.status !== 'COMPLETED') return false;
      const sessionDate = new Date(session.startedAt);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === date.getTime();
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
