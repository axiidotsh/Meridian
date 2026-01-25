import {
  formatTimeDiff,
  getHabitComparisonLabel,
  getStreakComparisonLabel,
  getTaskComparisonLabel,
} from '@/app/(protected)/(main)/dashboard/utils/dashboard-calculations';
import {
  calculateBestStreak,
  calculateCurrentStreak,
} from '@/app/(protected)/(main)/habits/utils/habit-calculations';
import { getUTCMidnight } from '@/utils/date-utc';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../db';
import { authMiddleware } from '../middleware/auth';
import { calculateLevel, getHeatmapData } from '../services/heatmap';
import { calculateOverallStreak } from '../services/overall-streak';

const heatmapQuerySchema = z.object({
  weeks: z.coerce.number().min(1).max(52).default(52),
});

const DASHBOARD_TASK_LIMIT = 5;
const PRIORITY_ORDER = { HIGH: 0, MEDIUM: 1, LOW: 2, NO_PRIORITY: 3 } as const;

function calculateUrgencyScore(
  task: { dueDate: Date | null; priority: string },
  today: Date
): number {
  const priorityScore =
    PRIORITY_ORDER[task.priority as keyof typeof PRIORITY_ORDER] ?? 3;

  if (!task.dueDate) {
    return 1000 + priorityScore;
  }

  const dueDate = getUTCMidnight(task.dueDate);
  const diffDays = Math.ceil(
    (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0) {
    return -100 + diffDays + priorityScore * 0.1;
  }

  if (diffDays === 0) {
    return priorityScore;
  }

  return 10 + diffDays + priorityScore * 0.1;
}

export const dashboardRouter = new Hono()
  .use(authMiddleware)
  .get('/tasks', async (c) => {
    const user = c.get('user');
    const today = getUTCMidnight(new Date());
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const [urgentTasks, noDueDateTasks] = await Promise.all([
      db.task.findMany({
        where: {
          userId: user.id,
          completed: false,
          dueDate: { lte: nextWeek },
        },
        orderBy: [{ dueDate: 'asc' }, { priority: 'asc' }],
        take: DASHBOARD_TASK_LIMIT * 2,
        include: {
          project: { select: { id: true, name: true, color: true } },
        },
      }),
      db.task.findMany({
        where: {
          userId: user.id,
          completed: false,
          dueDate: null,
        },
        orderBy: { createdAt: 'desc' },
        take: DASHBOARD_TASK_LIMIT,
        include: {
          project: { select: { id: true, name: true, color: true } },
        },
      }),
    ]);

    const allTasks = [...urgentTasks, ...noDueDateTasks];

    const sorted = allTasks
      .map((task) => ({
        ...task,
        urgencyScore: calculateUrgencyScore(task, today),
      }))
      .sort((a, b) => a.urgencyScore - b.urgencyScore)
      .slice(0, DASHBOARD_TASK_LIMIT)
      .map(({ urgencyScore: _, ...task }) => task);

    return c.json({ tasks: sorted });
  })
  .get('/habits', async (c) => {
    const user = c.get('user');

    const now = new Date();
    const todayKey = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );
    const weekAgo = new Date(todayKey.getTime() - 7 * 24 * 60 * 60 * 1000);

    const incompleteHabits = await db.habit.findMany({
      where: {
        userId: user.id,
        archived: false,
        completions: {
          none: { date: todayKey },
        },
      },
      include: {
        completions: {
          select: { date: true },
          orderBy: { date: 'desc' },
        },
      },
    });

    const habitsWithMetrics = incompleteHabits.map((habit) => {
      const allCompletions = habit.completions;
      const currentStreak = calculateCurrentStreak(allCompletions);
      const bestStreak = calculateBestStreak(allCompletions);

      const recentCompletions = allCompletions.filter(
        (c) => c.date.getTime() >= weekAgo.getTime()
      );

      const completionHistory = recentCompletions.map((c) => ({
        date: c.date,
        completed: true,
      }));

      return {
        ...habit,
        completions: recentCompletions,
        currentStreak,
        bestStreak,
        totalCompletions: allCompletions.length,
        completed: false,
        completionHistory,
      };
    });

    const atRiskHabits = habitsWithMetrics
      .sort((a, b) => b.currentStreak - a.currentStreak)
      .slice(0, DASHBOARD_TASK_LIMIT);

    return c.json({ habits: atRiskHabits });
  })
  .get('/metrics', async (c) => {
    const user = c.get('user');

    const today = new Date();
    const todayKey = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
    );
    const yesterday = new Date(todayKey.getTime() - 24 * 60 * 60 * 1000);

    const tomorrowKey = new Date(todayKey.getTime() + 24 * 60 * 60 * 1000);

    const [
      focusToday,
      focusYesterday,
      activeSession,
      tasksCompletedToday,
      tasksDueToday,
      overdueTasks,
      totalActiveHabits,
      habitsCompletedToday,
      last7DaysHabitCompletions,
      overallStreak,
    ] = await Promise.all([
      db.focusSession.aggregate({
        where: {
          userId: user.id,
          status: 'COMPLETED',
          startedAt: { gte: todayKey, lt: tomorrowKey },
        },
        _sum: { durationMinutes: true },
      }),
      db.focusSession.aggregate({
        where: {
          userId: user.id,
          status: 'COMPLETED',
          startedAt: { gte: yesterday, lt: todayKey },
        },
        _sum: { durationMinutes: true },
      }),
      db.focusSession.findFirst({
        where: {
          userId: user.id,
          status: { in: ['ACTIVE', 'PAUSED'] },
        },
        orderBy: { startedAt: 'desc' },
      }),
      db.task.count({
        where: {
          userId: user.id,
          completed: true,
          dueDate: {
            gte: todayKey,
            lt: tomorrowKey,
          },
        },
      }),
      db.task.count({
        where: {
          userId: user.id,
          dueDate: {
            gte: todayKey,
            lt: tomorrowKey,
          },
        },
      }),
      db.task.count({
        where: {
          userId: user.id,
          completed: false,
          dueDate: { lt: todayKey },
        },
      }),
      db.habit.count({
        where: {
          userId: user.id,
          archived: false,
        },
      }),
      db.habitCompletion.count({
        where: {
          userId: user.id,
          date: todayKey,
          habit: {
            archived: false,
          },
        },
      }),
      db.habitCompletion.count({
        where: {
          userId: user.id,
          date: { gte: new Date(todayKey.getTime() - 7 * 24 * 60 * 60 * 1000) },
          habit: {
            archived: false,
          },
        },
      }),
      calculateOverallStreak(user.id, db),
    ]);

    const todayMinutes = focusToday._sum.durationMinutes || 0;
    const yesterdayMinutes = focusYesterday._sum.durationMinutes || 0;
    const timeDiff = todayMinutes - yesterdayMinutes;

    const tasksPercentComplete =
      tasksDueToday > 0
        ? Math.round((tasksCompletedToday / tasksDueToday) * 100)
        : 0;

    const habitsPercentComplete =
      totalActiveHabits > 0
        ? Math.round((habitsCompletedToday / totalActiveHabits) * 100)
        : 0;

    const weeklyAverage =
      totalActiveHabits > 0
        ? Math.round(
            (last7DaysHabitCompletions / (totalActiveHabits * 7)) * 100
          )
        : 0;

    const daysUntilRecord = Math.max(
      0,
      overallStreak.bestStreak - overallStreak.currentStreak
    );

    return c.json({
      metrics: {
        focus: {
          todayMinutes,
          yesterdayMinutes,
          timeDiff,
          timeDiffLabel: formatTimeDiff(timeDiff),
          activeSession,
        },
        tasks: {
          completedToday: tasksCompletedToday,
          totalToday: tasksDueToday,
          percentComplete: tasksPercentComplete,
          comparisonLabel: getTaskComparisonLabel(
            tasksCompletedToday,
            tasksDueToday,
            overdueTasks
          ),
          overdue: overdueTasks,
        },
        habits: {
          completedToday: habitsCompletedToday,
          totalActive: totalActiveHabits,
          percentComplete: habitsPercentComplete,
          weeklyAverage,
          comparisonLabel: getHabitComparisonLabel(weeklyAverage),
        },
        streak: {
          currentStreak: overallStreak.currentStreak,
          bestStreak: overallStreak.bestStreak,
          daysUntilRecord,
          comparisonLabel: getStreakComparisonLabel(
            overallStreak.currentStreak,
            overallStreak.bestStreak
          ),
        },
      },
    });
  })
  .get('/heatmap', zValidator('query', heatmapQuerySchema), async (c) => {
    const user = c.get('user');
    const { weeks } = c.req.valid('query');

    const rawData = await getHeatmapData(user.id, weeks, db);

    const heatmap = rawData.map((day) => ({
      ...day,
      level: calculateLevel(day),
      totalActivity:
        day.focusMinutes + day.tasksCompleted + day.habitsCompleted,
    }));

    return c.json({ heatmap });
  });

export type AppType = typeof dashboardRouter;
