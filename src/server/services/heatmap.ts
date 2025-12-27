import type { PrismaClient } from '../db/generated/client';

type TransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

interface DayData {
  date: string;
  focusMinutes: number;
  tasksCompleted: number;
  habitsCompleted: number;
}

function getDateKey(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function getHeatmapData(
  userId: string,
  weeks: number,
  client: PrismaClient | TransactionClient
): Promise<DayData[]> {
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - weeks * 7);

  const [focusSessions, completedTasks, habitCompletions] = await Promise.all([
    client.focusSession.findMany({
      where: {
        userId,
        status: 'COMPLETED',
        startedAt: { gte: startDate },
      },
      select: { startedAt: true, durationMinutes: true },
    }),
    client.task.findMany({
      where: {
        userId,
        completed: true,
        updatedAt: { gte: startDate },
      },
      select: { updatedAt: true },
    }),
    client.habitCompletion.findMany({
      where: {
        userId,
        date: { gte: startDate },
      },
      select: { date: true },
    }),
  ]);

  const dataMap = new Map<string, DayData>();

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const key = getDateKey(new Date(d));
    dataMap.set(key, {
      date: key,
      focusMinutes: 0,
      tasksCompleted: 0,
      habitsCompleted: 0,
    });
  }

  focusSessions.forEach((session) => {
    const key = getDateKey(session.startedAt);
    const data = dataMap.get(key);
    if (data) {
      data.focusMinutes += session.durationMinutes;
    }
  });

  completedTasks.forEach((task) => {
    const key = getDateKey(task.updatedAt);
    const data = dataMap.get(key);
    if (data) {
      data.tasksCompleted++;
    }
  });

  habitCompletions.forEach((completion) => {
    const key = getDateKey(completion.date);
    const data = dataMap.get(key);
    if (data) {
      data.habitsCompleted++;
    }
  });

  return Array.from(dataMap.values());
}

export function calculateLevel(data: DayData): number {
  const hasFocus = data.focusMinutes > 0;
  const hasTasks = data.tasksCompleted > 0;
  const hasHabits = data.habitsCompleted > 0;
  const activityTypes = [hasFocus, hasTasks, hasHabits].filter(Boolean).length;

  if (activityTypes === 0) return 0;

  if (activityTypes === 1) {
    if (hasFocus && data.focusMinutes >= 60) return 2;
    return 1;
  }

  if (activityTypes === 2) {
    const totalScore =
      data.focusMinutes / 30 + data.tasksCompleted + data.habitsCompleted * 2;
    if (totalScore >= 6) return 3;
    return 2;
  }

  const totalScore =
    data.focusMinutes / 30 + data.tasksCompleted + data.habitsCompleted * 2;
  if (totalScore >= 10) return 4;
  return 3;
}
