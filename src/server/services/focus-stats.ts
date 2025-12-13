import { db } from '../db';
import type { PrismaClient } from '../db/generated/client';

type TransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

function getDateKey(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDaysDifference(date1: Date, date2: Date): number {
  const d1 = Date.UTC(
    date1.getUTCFullYear(),
    date1.getUTCMonth(),
    date1.getUTCDate()
  );
  const d2 = Date.UTC(
    date2.getUTCFullYear(),
    date2.getUTCMonth(),
    date2.getUTCDate()
  );
  return Math.floor((d1 - d2) / (1000 * 60 * 60 * 24));
}

export async function getOrCreateStats(
  userId: string,
  client: PrismaClient | TransactionClient = db
) {
  const existing = await client.focusStats.findUnique({
    where: { userId },
  });

  if (existing) return existing;

  return client.focusStats.create({
    data: { userId },
  });
}

export async function recalculateStats(
  userId: string,
  client: PrismaClient | TransactionClient = db
) {
  const sessions = await client.focusSession.findMany({
    where: {
      userId,
      status: 'COMPLETED',
    },
    select: {
      startedAt: true,
      durationMinutes: true,
    },
    orderBy: { startedAt: 'desc' },
  });

  if (sessions.length === 0) {
    return client.focusStats.upsert({
      where: { userId },
      create: { userId },
      update: {
        currentStreak: 0,
        bestStreak: 0,
        lastStreakDate: null,
        highestDailyMinutes: 0,
        highestDailyDate: null,
        bestSessionsInDay: 0,
      },
    });
  }

  const dailyTotals = new Map<string, { minutes: number; count: number }>();

  for (const session of sessions) {
    const dateKey = getDateKey(session.startedAt);
    const existing = dailyTotals.get(dateKey) || { minutes: 0, count: 0 };
    dailyTotals.set(dateKey, {
      minutes: existing.minutes + session.durationMinutes,
      count: existing.count + 1,
    });
  }

  let highestDailyMinutes = 0;
  let highestDailyDate: Date | null = null;
  let bestSessionsInDay = 0;

  for (const [dateKey, { minutes, count }] of dailyTotals) {
    if (minutes > highestDailyMinutes) {
      highestDailyMinutes = minutes;
      const [year, month, day] = dateKey.split('-').map(Number);
      highestDailyDate = new Date(Date.UTC(year, month - 1, day));
    }
    if (count > bestSessionsInDay) {
      bestSessionsInDay = count;
    }
  }

  const sortedDates = Array.from(dailyTotals.keys()).sort((a, b) =>
    b.localeCompare(a)
  );

  const now = new Date();
  const todayKey = getDateKey(now);
  const yesterday = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1)
  );
  const yesterdayKey = getDateKey(yesterday);

  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;
  let lastStreakDate: Date | null = null;

  const mostRecentKey = sortedDates[0];
  if (mostRecentKey !== todayKey && mostRecentKey !== yesterdayKey) {
    currentStreak = 0;
  } else {
    let checkKey = mostRecentKey === todayKey ? todayKey : yesterdayKey;
    const [year, month, day] = checkKey.split('-').map(Number);
    lastStreakDate = new Date(Date.UTC(year, month - 1, day));

    for (const dateKey of sortedDates) {
      if (dateKey === checkKey) {
        currentStreak++;
        const [y, m, d] = checkKey.split('-').map(Number);
        const nextDate = new Date(Date.UTC(y, m - 1, d - 1));
        checkKey = getDateKey(nextDate);
      } else {
        break;
      }
    }
  }

  for (let i = 0; i < sortedDates.length; i++) {
    const currentKey = sortedDates[i];
    const prevKey = i > 0 ? sortedDates[i - 1] : null;

    if (prevKey) {
      const [cy, cm, cd] = currentKey.split('-').map(Number);
      const [py, pm, pd] = prevKey.split('-').map(Number);
      const currentDate = new Date(Date.UTC(cy, cm - 1, cd));
      const prevDate = new Date(Date.UTC(py, pm - 1, pd));

      if (getDaysDifference(prevDate, currentDate) === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    } else {
      tempStreak = 1;
    }
    bestStreak = Math.max(bestStreak, tempStreak);
  }

  return client.focusStats.upsert({
    where: { userId },
    create: {
      userId,
      currentStreak,
      bestStreak,
      lastStreakDate,
      highestDailyMinutes,
      highestDailyDate,
      bestSessionsInDay,
    },
    update: {
      currentStreak,
      bestStreak,
      lastStreakDate,
      highestDailyMinutes,
      highestDailyDate,
      bestSessionsInDay,
    },
  });
}

export async function getStatsWithDaysAgo(userId: string) {
  const stats = await getOrCreateStats(userId);

  const now = new Date();
  const todayKey = getDateKey(now);

  let highestDailyDaysAgo: number | null = null;
  if (stats.highestDailyDate) {
    const highestKey = getDateKey(stats.highestDailyDate);
    const [ty, tm, td] = todayKey.split('-').map(Number);
    const [hy, hm, hd] = highestKey.split('-').map(Number);
    const todayDate = Date.UTC(ty, tm - 1, td);
    const highestDate = Date.UTC(hy, hm - 1, hd);
    highestDailyDaysAgo = Math.floor(
      (todayDate - highestDate) / (1000 * 60 * 60 * 24)
    );
  }

  return {
    currentStreak: stats.currentStreak,
    bestStreak: stats.bestStreak,
    highestDailyMinutes: stats.highestDailyMinutes,
    highestDailyDaysAgo,
    bestSessionsInDay: stats.bestSessionsInDay,
  };
}
