# Dashboard Implementation Plan

## Executive Summary

This document outlines the complete implementation plan for the Dashboard page, which serves as a high-level productivity overview aggregating data from Tasks, Habits, and Focus features. The current dashboard exists as a static mockup with hardcoded data. This plan details the backend infrastructure and frontend integration needed to make it fully functional.

**Key Finding**: All necessary backend routes for individual features exist, but the dashboard itself makes zero API calls. The implementation will focus on creating dashboard-specific aggregation endpoints and wiring up the existing UI components with real data.

---

## Current State Analysis

### Existing Infrastructure

**Backend API Routes Available**:

- **Tasks**: `/api/tasks/stats`, `/api/tasks/chart?days=N`, `/api/tasks` (CRUD)
- **Habits**: `/api/habits/stats`, `/api/habits?days=N`, `/api/habits` (CRUD)
- **Focus**: `/api/focus/stats`, `/api/focus/sessions?days=N`, `/api/focus/sessions/active`

**Frontend Query Hooks Available**:

- `useTaskStats()`, `useTaskChart(days)`
- `useHabitStats()`
- `useFocusStats()`, `useChartSessions(days)`
- `useActiveSession()`

**Existing Dashboard Components** (All Using Mock Data):

- 4 metric cards (hardcoded values)
- Tasks card (7 hardcoded tasks, non-interactive)
- Habits card (6 hardcoded habits, non-interactive)
- 3 area charts (focus time, task completion, habit completion - all mock data)
- Productivity heatmap (52 weeks, mock data generator)

### Critical Gaps

1. **No Data Fetching**: Dashboard page is a server component that doesn't fetch any data
2. **No Dashboard API Routes**: No aggregated endpoints for dashboard-specific data
3. **Missing Habits Chart Endpoint**: Tasks and Focus have chart endpoints, Habits does not
4. **Missing Heatmap Endpoint**: No API route to fetch aggregated productivity data by date
5. **Non-Interactive Components**: Task/habit toggles don't work, add buttons don't function
6. **No Focus Session Controls**: Cannot start focus sessions from dashboard
7. **No Real-Time Updates**: Changes elsewhere don't reflect on dashboard

---

## Architecture Decisions

### Backend Strategy: Hybrid Approach

**New Dashboard-Specific Endpoints**:

- `GET /api/dashboard/metrics` - Single aggregated call for all 4 metric cards
- `GET /api/dashboard/heatmap?weeks=52` - Aggregated productivity data by date
- `GET /api/habits/chart?days=N` - Missing habits chart endpoint

**Reuse Existing Endpoints**:

- Task chart: Use existing `/api/tasks/chart?days=N`
- Focus chart: Use existing `/api/focus/sessions?days=N` with client-side transformation
- Active session: Use existing `/api/focus/sessions/active`
- Task/Habit CRUD: Use existing mutation hooks

**Rationale**:

- **Server-side aggregation** for expensive calculations (heatmap for 52 weeks)
- **Single request** for dashboard metrics reduces network overhead
- **Reuse existing endpoints** where efficient to avoid duplication
- **Consistent patterns** with other features (Hono + Zod + TanStack Query)

### Data Contribution Philosophy

**Productivity Heatmap**:

- **Equal weight**: All three features contribute equally to daily productivity
- **Minimum threshold**: Even 1 minute of focus time counts as activity
- **Aggregation logic**:
  - Focus: Any completed session on a date = activity
  - Tasks: Any task completed on a date = activity
  - Habits: Any habit completion on a date = activity
- **Intensity levels** (0-4):
  - Level 0: No activity
  - Level 1: 1 type of activity (e.g., only focus)
  - Level 2: 2 types of activity (e.g., focus + tasks)
  - Level 3: All 3 types with moderate volume
  - Level 4: All 3 types with high volume

**Date Normalization**:

- All dates normalized to UTC midnight for consistency
- Timezone-agnostic calculations
- Date key format: `YYYY-MM-DD`

---

## PHASE 1: BACKEND IMPLEMENTATION

### 1.1 New Dashboard Metrics Endpoint

**Route**: `GET /api/dashboard/metrics`

**File**: `/home/aditya/Github/horizon/src/server/routes/dashboard.ts` (new file)

**Response Schema**:

```typescript
{
  metrics: {
    focus: {
      todayMinutes: number,           // Total focus time today
      yesterdayMinutes: number,       // Total focus time yesterday
      timeDiff: number,               // Today - yesterday (can be negative)
      timeDiffLabel: string,          // "+24m from yesterday" or "-10m from yesterday"
      activeSession: FocusSession | null  // Current active/paused session
    },
    tasks: {
      completedToday: number,         // Tasks completed today
      totalToday: number,             // Total tasks with dueDate = today
      percentComplete: number,        // (completed / total) * 100
      comparisonLabel: string,        // "Ahead of your usual pace" or "Behind schedule"
      overdue: number                 // Count of overdue tasks
    },
    habits: {
      completedToday: number,         // Habits completed today
      totalActive: number,            // Total non-archived habits
      percentComplete: number,        // (completed / total) * 100
      weeklyAverage: number,          // Average completion % over last 7 days
      comparisonLabel: string         // "67% weekly average"
    },
    streak: {
      currentStreak: number,          // Days with ANY activity (focus OR tasks OR habits)
      bestStreak: number,             // All-time best productivity streak
      daysUntilRecord: number,        // bestStreak - currentStreak (0 if new record)
      comparisonLabel: string         // "3 days to beat your record" or "New personal record!"
    }
  }
}
```

**Implementation Logic**:

```typescript
// 1. Get today and yesterday UTC date keys
const today = getDateKey(new Date());
const yesterday = getDateKey(new Date(Date.now() - 24 * 60 * 60 * 1000));

// 2. FOCUS METRICS
// - Query FocusSession WHERE userId AND status = COMPLETED
// - Filter by startedAt date
// - Sum durationMinutes for today and yesterday
// - Get active session (status IN ['ACTIVE', 'PAUSED'])
// - Calculate timeDiff and format label

// 3. TASK METRICS
// - Query Tasks WHERE userId AND completed = true AND DATE(updatedAt) = today
// - Query Tasks WHERE userId AND dueDate = today
// - Query Tasks WHERE userId AND dueDate < today AND completed = false
// - Calculate percentComplete
// - Generate comparisonLabel based on average completion rate

// 4. HABIT METRICS
// - Query Habits WHERE userId AND archived = false (count = totalActive)
// - Query HabitCompletion WHERE userId AND date = today (count = completedToday)
// - Query HabitCompletion for last 7 days, group by date, calculate average %
// - Calculate percentComplete and format label

// 5. OVERALL STREAK
// - Call new calculateOverallStreak() service function
// - Aggregates activity across all three features by date
// - Returns current streak and best streak
// - Calculate daysUntilRecord

// 6. Return aggregated response
```

**New Service File**: `/home/aditya/Github/horizon/src/server/services/overall-streak.ts`

**Functions**:

```typescript
interface DailyActivity {
  hasFocus: boolean;
  hasTasks: boolean;
  hasHabits: boolean;
}

async function calculateOverallStreak(
  userId: string,
  client: PrismaClient
): Promise<{ currentStreak: number; bestStreak: number }> {
  // 1. Fetch all completed focus sessions (dates only)
  const focusSessions = await client.focusSession.findMany({
    where: { userId, status: 'COMPLETED' },
    select: { startedAt: true },
  });

  // 2. Fetch all completed tasks (dates only)
  const completedTasks = await client.task.findMany({
    where: { userId, completed: true },
    select: { updatedAt: true },
  });

  // 3. Fetch all habit completions (dates only)
  const habitCompletions = await client.habitCompletion.findMany({
    where: { userId },
    select: { date: true },
  });

  // 4. Build Map<dateKey, DailyActivity>
  const activityMap = new Map<string, DailyActivity>();

  focusSessions.forEach((session) => {
    const key = getDateKey(session.startedAt);
    const activity = activityMap.get(key) || {
      hasFocus: false,
      hasTasks: false,
      hasHabits: false,
    };
    activity.hasFocus = true;
    activityMap.set(key, activity);
  });

  completedTasks.forEach((task) => {
    const key = getDateKey(task.updatedAt);
    const activity = activityMap.get(key) || {
      hasFocus: false,
      hasTasks: false,
      hasHabits: false,
    };
    activity.hasTasks = true;
    activityMap.set(key, activity);
  });

  habitCompletions.forEach((completion) => {
    const key = getDateKey(completion.date);
    const activity = activityMap.get(key) || {
      hasFocus: false,
      hasTasks: false,
      hasHabits: false,
    };
    activity.hasHabits = true;
    activityMap.set(key, activity);
  });

  // 5. Calculate current streak (from today/yesterday backwards)
  const today = getDateKey(new Date());
  const yesterday = getDateKey(new Date(Date.now() - 24 * 60 * 60 * 1000));

  let currentStreak = 0;
  let currentDate = activityMap.has(today)
    ? new Date()
    : new Date(Date.now() - 24 * 60 * 60 * 1000);

  // Only start streak if today or yesterday has activity
  if (!activityMap.has(today) && !activityMap.has(yesterday)) {
    currentStreak = 0;
  } else {
    while (true) {
      const dateKey = getDateKey(currentDate);
      if (activityMap.has(dateKey)) {
        currentStreak++;
        currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
      } else {
        break;
      }
    }
  }

  // 6. Calculate best streak (all time)
  const sortedDates = Array.from(activityMap.keys()).sort();
  let bestStreak = 0;
  let tempStreak = 0;
  let lastDate: Date | null = null;

  sortedDates.forEach((dateKey) => {
    const currentDate = new Date(dateKey);
    if (lastDate === null) {
      tempStreak = 1;
    } else {
      const diffDays = Math.round(
        (currentDate.getTime() - lastDate.getTime()) / (24 * 60 * 60 * 1000)
      );
      if (diffDays === 1) {
        tempStreak++;
      } else {
        bestStreak = Math.max(bestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    lastDate = currentDate;
  });
  bestStreak = Math.max(bestStreak, tempStreak);

  return { currentStreak, bestStreak };
}

function getDateKey(date: Date): string {
  const utc = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  return utc.toISOString().split('T')[0];
}
```

**Zod Schema**:

```typescript
// No query params for this endpoint
```

**Performance Considerations**:

- Single transaction with 4 parallel queries for focus/tasks/habits/streak
- Use `Promise.all` for independent queries
- Index usage: Existing indexes on `userId`, `userId + status`, `userId + date`
- Consider caching this endpoint (5-minute TTL) if performance issues arise

---

### 1.2 Heatmap Data Endpoint

**Route**: `GET /api/dashboard/heatmap?weeks=52`

**File**: `/home/aditya/Github/horizon/src/server/routes/dashboard.ts`

**Query Params**:

```typescript
const heatmapQuerySchema = z.object({
  weeks: z.coerce.number().min(1).max(52).default(52),
});
```

**Response Schema**:

```typescript
{
  heatmap: [
    {
      date: string, // "2024-01-15" (YYYY-MM-DD)
      level: number, // 0-4 intensity
      focusMinutes: number, // Total focus time
      tasksCompleted: number, // Tasks completed count
      habitsCompleted: number, // Habits completed count
      totalActivity: number, // Sum for sorting/display
    },
  ];
}
```

**Implementation**:

**New Service File**: `/home/aditya/Github/horizon/src/server/services/heatmap.ts`

```typescript
interface DayData {
  date: string;
  focusMinutes: number;
  tasksCompleted: number;
  habitsCompleted: number;
}

async function getHeatmapData(
  userId: string,
  weeks: number,
  client: PrismaClient
): Promise<DayData[]> {
  // 1. Calculate date range (weeks * 7 days ago to today)
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - weeks * 7);

  // 2. Fetch focus sessions in range
  const focusSessions = await client.focusSession.findMany({
    where: {
      userId,
      status: 'COMPLETED',
      startedAt: { gte: startDate },
    },
    select: { startedAt: true, durationMinutes: true },
  });

  // 3. Fetch completed tasks in range
  // NOTE: Use updatedAt for completion date (when task.completed became true)
  const completedTasks = await client.task.findMany({
    where: {
      userId,
      completed: true,
      updatedAt: { gte: startDate },
    },
    select: { updatedAt: true },
  });

  // 4. Fetch habit completions in range
  const habitCompletions = await client.habitCompletion.findMany({
    where: {
      userId,
      date: { gte: startDate },
    },
    select: { date: true },
  });

  // 5. Build map of date -> data
  const dataMap = new Map<string, DayData>();

  // Initialize all dates in range with zero values
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const key = getDateKey(new Date(d));
    dataMap.set(key, {
      date: key,
      focusMinutes: 0,
      tasksCompleted: 0,
      habitsCompleted: 0,
    });
  }

  // Aggregate focus minutes by date
  focusSessions.forEach((session) => {
    const key = getDateKey(session.startedAt);
    const data = dataMap.get(key);
    if (data) {
      data.focusMinutes += session.durationMinutes;
    }
  });

  // Count tasks by completion date
  completedTasks.forEach((task) => {
    const key = getDateKey(task.updatedAt);
    const data = dataMap.get(key);
    if (data) {
      data.tasksCompleted++;
    }
  });

  // Count habit completions by date
  habitCompletions.forEach((completion) => {
    const key = getDateKey(completion.date);
    const data = dataMap.get(key);
    if (data) {
      data.habitsCompleted++;
    }
  });

  // 6. Convert map to array
  return Array.from(dataMap.values());
}

function calculateLevel(data: DayData): number {
  // Level calculation based on activity volume
  // Criteria (can be tuned based on user feedback):

  const hasFocus = data.focusMinutes > 0;
  const hasTasks = data.tasksCompleted > 0;
  const hasHabits = data.habitsCompleted > 0;
  const activityTypes = [hasFocus, hasTasks, hasHabits].filter(Boolean).length;

  if (activityTypes === 0) return 0; // No activity

  // Single activity type
  if (activityTypes === 1) {
    if (hasFocus && data.focusMinutes >= 60) return 2; // 1hr+ focus = level 2
    return 1; // Minimal activity
  }

  // Two activity types
  if (activityTypes === 2) {
    const totalScore =
      data.focusMinutes / 30 + // 30 min focus = 1 point
      data.tasksCompleted +
      data.habitsCompleted * 2; // Habits weighted higher
    if (totalScore >= 6) return 3;
    return 2;
  }

  // All three activity types
  const totalScore =
    data.focusMinutes / 30 + data.tasksCompleted + data.habitsCompleted * 2;
  if (totalScore >= 10) return 4; // Very high productivity
  return 3; // All types present, moderate volume
}
```

**Endpoint Handler**:

```typescript
export const dashboardRouter = new Hono()
  .use(authMiddleware)
  .get('/heatmap', async (c) => {
    const user = c.get('user');
    const { weeks } = heatmapQuerySchema.parse(c.req.query());

    const rawData = await getHeatmapData(user.id, weeks, db);

    const heatmap = rawData.map((day) => ({
      ...day,
      level: calculateLevel(day),
      totalActivity:
        day.focusMinutes + day.tasksCompleted + day.habitsCompleted,
    }));

    return c.json({ heatmap });
  });
```

**Performance Optimizations**:

- Use indexes: `userId + status + startedAt` (focus), `userId + completed + updatedAt` (tasks), `userId + date` (habits)
- Consider caching: 52-week data changes infrequently for past dates
- Potential optimization: Store aggregated daily stats in separate table (materialized view pattern)

---

### 1.3 Habits Chart Endpoint (Missing)

**Route**: `GET /api/habits/chart?days=N`

**File**: `/home/aditya/Github/horizon/src/server/routes/habits.ts`

**Query Params**:

```typescript
const chartQuerySchema = z.object({
  days: z.coerce.number().min(1).max(365).default(7),
});
```

**Response Schema**:

```typescript
{
  chartData: [
    {
      date: string, // Day name ("Mon") or date ("12/25")
      completionRate: number, // 0-100 percentage
    },
  ];
}
```

**Implementation**:

```typescript
habitsRouter.get('/chart', async (c) => {
  const user = c.get('user');
  const { days } = chartQuerySchema.parse(c.req.query());

  const chartData = [];
  const endDate = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const targetDate = new Date(endDate);
    targetDate.setDate(targetDate.getDate() - i);
    const dateKey = getDateKey(targetDate);

    // Get total active habits on this date
    const totalHabits = await db.habit.count({
      where: {
        userId: user.id,
        archived: false,
        createdAt: { lte: targetDate }, // Only habits created before this date
      },
    });

    // Get completed habits on this date
    const completedCount = await db.habitCompletion.count({
      where: {
        userId: user.id,
        date: targetDate,
      },
    });

    // Calculate completion rate
    const completionRate =
      totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;

    // Format date label
    const dateLabel =
      days <= 7
        ? targetDate.toLocaleDateString('en-US', { weekday: 'short' })
        : `${targetDate.getMonth() + 1}/${targetDate.getDate()}`;

    chartData.push({
      date: dateLabel,
      completionRate,
    });
  }

  return c.json({ chartData });
});
```

**Performance Note**: This endpoint makes 2 \* N database queries (where N = days). For better performance with large N values, consider:

- Fetching all habits once, filtering in memory
- Fetching all completions in date range, grouping in memory
- Caching results for 1 hour

**Optimized Version**:

```typescript
habitsRouter.get('/chart', async (c) => {
  const user = c.get('user');
  const { days } = chartQuerySchema.parse(c.req.query());

  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - (days - 1));

  // Fetch all data in parallel
  const [habits, completions] = await Promise.all([
    db.habit.findMany({
      where: {
        userId: user.id,
        archived: false,
        createdAt: { lte: endDate },
      },
      select: { createdAt: true },
    }),
    db.habitCompletion.findMany({
      where: {
        userId: user.id,
        date: { gte: startDate, lte: endDate },
      },
      select: { date: true },
    }),
  ]);

  // Group completions by date
  const completionsByDate = new Map<string, number>();
  completions.forEach((c) => {
    const key = getDateKey(c.date);
    completionsByDate.set(key, (completionsByDate.get(key) || 0) + 1);
  });

  // Build chart data
  const chartData = [];
  for (let i = days - 1; i >= 0; i--) {
    const targetDate = new Date(endDate);
    targetDate.setDate(targetDate.getDate() - i);
    const dateKey = getDateKey(targetDate);

    // Count habits that existed on this date
    const totalHabits = habits.filter((h) => h.createdAt <= targetDate).length;
    const completedCount = completionsByDate.get(dateKey) || 0;
    const completionRate =
      totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;

    const dateLabel =
      days <= 7
        ? targetDate.toLocaleDateString('en-US', { weekday: 'short' })
        : `${targetDate.getMonth() + 1}/${targetDate.getDate()}`;

    chartData.push({ date: dateLabel, completionRate });
  }

  return c.json({ chartData });
});
```

---

### 1.4 Router Setup

**File**: `/home/aditya/Github/horizon/src/server/routes/dashboard.ts` (new)

```typescript
import { Hono } from 'hono';
import { z } from 'zod';
import { authMiddleware } from '@/server/middleware/auth';
import { db } from '@/server/db';
import { getHeatmapData, calculateLevel } from '@/server/services/heatmap';
import { calculateOverallStreak } from '@/server/services/overall-streak';

const heatmapQuerySchema = z.object({
  weeks: z.coerce.number().min(1).max(52).default(52),
});

export const dashboardRouter = new Hono()
  .use(authMiddleware)
  .get('/metrics', async (c) => {
    // Implementation from 1.1
  })
  .get('/heatmap', async (c) => {
    // Implementation from 1.2
  });
```

**Update Main Server Router** (`/home/aditya/Github/horizon/src/server/index.ts`):

```typescript
import { dashboardRouter } from './routes/dashboard';

const router = app
  .on(['POST', 'GET'], '/auth/*', (c) => auth.handler(c.req.raw))
  .route('/focus', focusRouter)
  .route('/tasks', tasksRouter)
  .route('/projects', projectsRouter)
  .route('/habits', habitsRouter)
  .route('/dashboard', dashboardRouter); // Add this line
```

---

### 1.5 Database Migrations

**No schema changes needed**. All data structures already exist:

- `FocusSession`, `FocusStats`
- `Task`
- `Habit`, `HabitCompletion`, `HabitStats`

**Optional Future Enhancement**: Add `DashboardCache` table for materialized aggregations:

```prisma
model DashboardCache {
  id        String   @id @default(cuid())
  userId    String
  date      DateTime
  focusMinutes      Int @default(0)
  tasksCompleted    Int @default(0)
  habitsCompleted   Int @default(0)
  level     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, date])
  @@index([userId, date])
  @@map("dashboard_cache")
}
```

This would enable instant heatmap queries but requires update logic on every task/habit/focus completion.

---

## PHASE 2: FRONTEND INTEGRATION

### 2.1 Dashboard Query Hooks

**File**: `/home/aditya/Github/horizon/src/app/(protected)/(main)/dashboard/hooks/queries/use-dashboard-metrics.ts` (new)

```typescript
import { useApiQuery } from '@/hooks/use-api-query';
import { api } from '@/lib/rpc';
import { DASHBOARD_QUERY_KEYS } from '../dashboard-query-keys';
import type { InferResponseType } from 'hono/client';

type MetricsResponse = InferResponseType<typeof api.dashboard.metrics.$get>;
export type DashboardMetrics = MetricsResponse['metrics'];

export function useDashboardMetrics() {
  return useApiQuery(api.dashboard.metrics.$get, {
    queryKey: DASHBOARD_QUERY_KEYS.metrics,
    select: (data) => data.metrics,
    errorMessage: 'Failed to fetch dashboard metrics',
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
```

**File**: `/home/aditya/Github/horizon/src/app/(protected)/(main)/dashboard/hooks/queries/use-heatmap-data.ts` (new)

```typescript
import { useApiQuery } from '@/hooks/use-api-query';
import { api } from '@/lib/rpc';
import { DASHBOARD_QUERY_KEYS } from '../dashboard-query-keys';
import type { InferResponseType } from 'hono/client';

type HeatmapResponse = InferResponseType<typeof api.dashboard.heatmap.$get>;
export type HeatmapData = HeatmapResponse['heatmap'];

export function useHeatmapData(weeks = 52) {
  return useApiQuery(api.dashboard.heatmap.$get, {
    queryKey: [...DASHBOARD_QUERY_KEYS.heatmap, weeks],
    input: { query: { weeks: weeks.toString() } },
    select: (data) => data.heatmap,
    errorMessage: 'Failed to fetch heatmap data',
    staleTime: 1000 * 60 * 30, // 30 minutes (heatmap data changes slowly)
  });
}
```

**File**: `/home/aditya/Github/horizon/src/app/(protected)/(main)/dashboard/hooks/queries/use-habit-chart.ts` (new)

```typescript
import { useApiQuery } from '@/hooks/use-api-query';
import { api } from '@/lib/rpc';
import { DASHBOARD_QUERY_KEYS } from '../dashboard-query-keys';
import type { InferResponseType } from 'hono/client';

type ChartResponse = InferResponseType<typeof api.habits.chart.$get>;
export type HabitChartData = ChartResponse['chartData'];

export function useHabitChart(days = 7) {
  return useApiQuery(api.habits.chart.$get, {
    queryKey: [...DASHBOARD_QUERY_KEYS.habitChart, days],
    input: { query: { days: days.toString() } },
    select: (data) => data.chartData,
    errorMessage: 'Failed to fetch habit chart data',
  });
}
```

**File**: `/home/aditya/Github/horizon/src/app/(protected)/(main)/dashboard/hooks/dashboard-query-keys.ts` (new)

```typescript
export const DASHBOARD_QUERY_KEYS = {
  metrics: ['dashboard', 'metrics'] as const,
  heatmap: ['dashboard', 'heatmap'] as const,
  habitChart: ['dashboard', 'habit-chart'] as const,
  dashboardTasks: ['dashboard', 'tasks'] as const,
  dashboardHabits: ['dashboard', 'habits'] as const,
};
```

**File**: `/home/aditya/Github/horizon/src/app/(protected)/(main)/dashboard/hooks/types.ts` (new)

```typescript
import type { InferResponseType } from 'hono/client';
import { api } from '@/lib/rpc';

type MetricsResponse = InferResponseType<typeof api.dashboard.metrics.$get>;
export type DashboardMetrics = MetricsResponse['metrics'];

type HeatmapResponse = InferResponseType<typeof api.dashboard.heatmap.$get>;
export type HeatmapData = HeatmapResponse['heatmap'];
export type HeatmapDay = HeatmapData[number];

type HabitChartResponse = InferResponseType<typeof api.habits.chart.$get>;
export type HabitChartData = HabitChartResponse['chartData'];
```

---

### 2.2 Convert Dashboard Page to Client Component

**File**: `/home/aditya/Github/horizon/src/app/(protected)/(main)/dashboard/page.tsx`

**Current**: Server component with no data fetching

**New**: Client component with comprehensive data fetching

```typescript
'use client';

import { useState } from 'react';
import { PageHeading } from '@/components/page-heading';
import { MetricsSkeleton } from './components/skeletons/metrics-skeleton';
import { ErrorState } from '@/components/error-state';
import { DashboardMetrics } from './components/dashboard-metrics';
import { DashboardTasksCard } from './components/dashboard-tasks-card';
import { DashboardHabitsCard } from './components/dashboard-habits-card';
import { FocusTimeChart } from './components/focus-time-chart';
import { TaskCompletionChart } from './components/task-completion-chart';
import { HabitCompletionChart } from './components/habit-completion-chart';
import { ProductivityHeatmapCard } from './components/productivity-heatmap-card';
import { ActiveFocusSession } from './components/active-focus-session';
import { useDashboardMetrics } from './hooks/queries/use-dashboard-metrics';
import { useHeatmapData } from './hooks/queries/use-heatmap-data';
import { useTaskChart } from '@/app/(protected)/(main)/tasks/hooks/queries/use-task-chart';
import { useHabitChart } from './hooks/queries/use-habit-chart';
import { useChartSessions } from '@/app/(protected)/(main)/focus/hooks/queries/use-chart-sessions';

export default function DashboardPage() {
  const [chartPeriod, setChartPeriod] = useState(7);

  const {
    data: metrics,
    isLoading: metricsLoading,
    error: metricsError,
    refetch: refetchMetrics
  } = useDashboardMetrics();

  const {
    data: heatmapData,
    isLoading: heatmapLoading,
    error: heatmapError
  } = useHeatmapData(52);

  const {
    data: taskChartData,
    isLoading: taskChartLoading
  } = useTaskChart(chartPeriod);

  const {
    data: habitChartData,
    isLoading: habitChartLoading
  } = useHabitChart(chartPeriod);

  const {
    data: focusSessions,
    isLoading: focusLoading
  } = useChartSessions(chartPeriod);

  if (metricsError) {
    return (
      <div className="space-y-6">
        <PageHeading
          title="Dashboard"
          description="Your productivity overview"
        />
        <ErrorState
          message="Failed to load dashboard"
          onRetry={refetchMetrics}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeading
        title="Dashboard"
        description="Your productivity overview"
      />

      {/* Active Focus Session (if any) */}
      {metrics?.focus.activeSession && (
        <ActiveFocusSession session={metrics.focus.activeSession} />
      )}

      {/* Metric Cards */}
      {metricsLoading ? (
        <MetricsSkeleton />
      ) : (
        <DashboardMetrics metrics={metrics} />
      )}

      {/* Tasks and Habits Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <DashboardTasksCard />
        <DashboardHabitsCard />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-3">
        <FocusTimeChart
          data={focusSessions}
          isLoading={focusLoading}
          period={chartPeriod}
          onPeriodChange={setChartPeriod}
        />
        <TaskCompletionChart
          data={taskChartData}
          isLoading={taskChartLoading}
          period={chartPeriod}
          onPeriodChange={setChartPeriod}
        />
        <HabitCompletionChart
          data={habitChartData}
          isLoading={habitChartLoading}
          period={chartPeriod}
          onPeriodChange={setChartPeriod}
        />
      </div>

      {/* Productivity Heatmap */}
      <ProductivityHeatmapCard
        data={heatmapData}
        isLoading={heatmapLoading}
        error={heatmapError}
      />
    </div>
  );
}
```

**Rationale for Client Component**:

- Real-time data fetching with React Query
- Interactive elements (checkboxes, buttons)
- Period selector state management
- Loading/error states with retry functionality
- Follows pattern from Tasks, Habits, Focus pages

---

### 2.3 Improved Metric Cards

**File**: `/home/aditya/Github/horizon/src/app/(protected)/(main)/dashboard/components/dashboard-metrics.tsx` (new)

```typescript
import { MetricCard } from '@/components/metric-card';
import { Clock, CheckCircle2, Target, Flame } from 'lucide-react';
import type { DashboardMetrics } from '../hooks/types';

interface DashboardMetricsProps {
  metrics: DashboardMetrics;
}

export function DashboardMetrics({ metrics }: DashboardMetricsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Focus Time Card */}
      <MetricCard
        title="Focus Time"
        value={formatMinutesToTime(metrics.focus.todayMinutes)}
        subtitle={metrics.focus.timeDiffLabel}
        icon={Clock}
        trend={metrics.focus.timeDiff > 0 ? 'up' : metrics.focus.timeDiff < 0 ? 'down' : 'neutral'}
      />

      {/* Tasks Card */}
      <MetricCard
        title="Tasks"
        value={`${metrics.tasks.completedToday}/${metrics.tasks.totalToday}`}
        subtitle={
          metrics.tasks.overdue > 0
            ? `${metrics.tasks.overdue} overdue`
            : metrics.tasks.comparisonLabel
        }
        icon={CheckCircle2}
        trend={metrics.tasks.overdue > 0 ? 'down' : 'neutral'}
      />

      {/* Habits Card */}
      <MetricCard
        title="Habits"
        value={`${metrics.habits.completedToday}/${metrics.habits.totalActive}`}
        subtitle={metrics.habits.comparisonLabel}
        icon={Target}
        trend={
          metrics.habits.percentComplete >= metrics.habits.weeklyAverage ? 'up' : 'down'
        }
      />

      {/* Streak Card */}
      <MetricCard
        title="Overall Streak"
        value={`${metrics.streak.currentStreak} days`}
        subtitle={metrics.streak.comparisonLabel}
        icon={Flame}
        trend={metrics.streak.currentStreak >= metrics.streak.bestStreak ? 'up' : 'neutral'}
      />
    </div>
  );
}

function formatMinutesToTime(minutes: number): string {
  if (minutes === 0) return '0m';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}
```

**Improvements over current implementation**:

- **Real data** instead of hardcoded values
- **Contextual subtitles** (overdue tasks highlighted, weekly comparison)
- **Trend indicators** (up/down/neutral with color coding)
- **Semantic icons** from Lucide React
- **Responsive grid** layout

---

### 2.4 Interactive Dashboard Tasks Card

**File**: `/home/aditya/Github/horizon/src/app/(protected)/(main)/dashboard/components/dashboard-tasks-card.tsx`

**Replace existing implementation** with:

```typescript
'use client';

import { useState } from 'react';
import { useAtom } from 'jotai';
import { Plus } from 'lucide-react';
import { ContentCard } from '@/components/content-card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/empty-state';
import { useTasks } from '@/app/(protected)/(main)/tasks/hooks/queries/use-tasks';
import { useToggleTask } from '@/app/(protected)/(main)/tasks/hooks/mutations/use-toggle-task';
import { formatDueDate, isOverdue, getDueDateUrgency } from '@/app/(protected)/(main)/tasks/utils/task-filters';
import { createTaskDialogAtom } from '@/app/(protected)/(main)/tasks/atoms/task-dialogs';
import { cn } from '@/utils/utils';

export function DashboardTasksCard() {
  const [, setCreateDialogOpen] = useAtom(createTaskDialogAtom);
  const { data: allTasks, isLoading } = useTasks();
  const { mutate: toggleTask } = useToggleTask();

  // Filter: Show today + overdue + upcoming (limit 10)
  const displayTasks = allTasks
    ?.filter(task => !task.completed)
    .sort((a, b) => {
      // Sort: overdue first, then by due date
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    })
    .slice(0, 10) || [];

  if (isLoading) {
    return (
      <ContentCard title="Tasks" description="Your upcoming tasks">
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
      </ContentCard>
    );
  }

  return (
    <ContentCard
      title="Tasks"
      description="Your upcoming tasks"
      action={
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setCreateDialogOpen(true)}
        >
          <Plus className="size-4" />
        </Button>
      }
    >
      {displayTasks.length === 0 ? (
        <EmptyState
          title="No tasks"
          description="Create a task to get started"
        />
      ) : (
        <ScrollArea className="h-[300px]">
          <div className="space-y-2">
            {displayTasks.map(task => {
              const urgency = task.dueDate ? getDueDateUrgency(task.dueDate) : 'none';

              return (
                <div
                  key={task.id}
                  className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask({ param: { id: task.id } })}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={cn(
                        "text-sm font-medium truncate",
                        task.completed && "line-through text-muted-foreground"
                      )}>
                        {task.title}
                      </p>
                      {task.project && (
                        <Badge
                          variant="outline"
                          style={{ borderColor: task.project.color || undefined }}
                        >
                          {task.project.name}
                        </Badge>
                      )}
                    </div>

                    {task.tags.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {task.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {task.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{task.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {task.dueDate && (
                    <div className={cn(
                      "text-xs whitespace-nowrap",
                      urgency === 'overdue' && "text-destructive",
                      urgency === 'today' && "text-orange-500",
                      urgency === 'upcoming' && "text-muted-foreground"
                    )}>
                      {formatDueDate(task.dueDate)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </ContentCard>
  );
}
```

**New Utility Function** (add to `/home/aditya/Github/horizon/src/app/(protected)/(main)/tasks/utils/task-filters.ts`):

```typescript
export function getDueDateUrgency(
  dueDate: Date | string
): 'overdue' | 'today' | 'upcoming' | 'none' {
  if (!dueDate) return 'none';

  const date = new Date(dueDate);
  const today = normalizeDateToMidnight(new Date());
  const due = normalizeDateToMidnight(date);

  if (due < today) return 'overdue';
  if (due.getTime() === today.getTime()) return 'today';
  return 'upcoming';
}
```

**Improvements**:

- **Real data** from `useTasks()` hook
- **Interactive checkboxes** using `useToggleTask()` mutation
- **Context-rich display**: Shows projects, tags (first 2 + count)
- **Color-coded due dates**: Red (overdue), orange (today), gray (upcoming)
- **Functional "+" button**: Opens create task dialog (already exists in app)
- **Sorting logic**: Overdue first, then by due date
- **Limit 10 tasks**: Dashboard overview, not full list
- **Loading state**: Skeleton components
- **Empty state**: Helpful message

---

### 2.5 Interactive Dashboard Habits Card

**File**: `/home/aditya/Github/horizon/src/app/(protected)/(main)/dashboard/components/dashboard-habits-card.tsx`

**Replace existing implementation** with:

```typescript
'use client';

import { useAtom } from 'jotai';
import { Plus, Flame } from 'lucide-react';
import { ContentCard } from '@/components/content-card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/empty-state';
import { useHabits } from '@/app/(protected)/(main)/habits/hooks/queries/use-habits';
import { useToggleHabit } from '@/app/(protected)/(main)/habits/hooks/mutations/use-toggle-habit';
import { enrichHabitsWithMetrics } from '@/app/(protected)/(main)/habits/utils/habit-calculations';
import { createDialogOpenAtom } from '@/app/(protected)/(main)/habits/atoms/dialog-atoms';
import { cn } from '@/utils/utils';

export function DashboardHabitsCard() {
  const [, setCreateDialogOpen] = useAtom(createDialogOpenAtom);
  const { data: habits, isLoading } = useHabits(7);
  const { toggleToday } = useToggleHabit();

  const enrichedHabits = habits ? enrichHabitsWithMetrics(habits) : [];

  if (isLoading) {
    return (
      <ContentCard title="Habits" description="Your daily habits">
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
      </ContentCard>
    );
  }

  return (
    <ContentCard
      title="Habits"
      description="Your daily habits"
      action={
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setCreateDialogOpen(true)}
        >
          <Plus className="size-4" />
        </Button>
      }
    >
      {enrichedHabits.length === 0 ? (
        <EmptyState
          title="No habits"
          description="Create a habit to get started"
        />
      ) : (
        <ScrollArea className="h-[300px]">
          <div className="space-y-2">
            {enrichedHabits.slice(0, 10).map(habit => {
              const streakColor = getStreakColor(habit.currentStreak);

              return (
                <div
                  key={habit.id}
                  className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <Checkbox
                    checked={habit.completed}
                    onCheckedChange={() => toggleToday.mutate({ param: { id: habit.id } })}
                  />

                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm font-medium truncate",
                      habit.completed && "line-through text-muted-foreground"
                    )}>
                      {habit.title}
                    </p>
                    {habit.category && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        {habit.category}
                      </Badge>
                    )}
                  </div>

                  {habit.currentStreak > 0 && (
                    <div className="flex items-center gap-1">
                      <Flame className={cn("size-4", streakColor)} />
                      <span className="text-xs font-medium">{habit.currentStreak}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </ContentCard>
  );
}

function getStreakColor(streak: number): string {
  if (streak >= 30) return 'text-purple-500';
  if (streak >= 14) return 'text-yellow-500';
  if (streak >= 7) return 'text-orange-500';
  return 'text-muted-foreground';
}
```

**Improvements**:

- **Real data** from `useHabits(7)` hook
- **Interactive checkboxes** using `toggleToday` mutation
- **Streak display**: Colored flame icon with days count
- **Category badges**: Shows habit category if set
- **Functional "+" button**: Opens create habit dialog (already exists in app)
- **Limit 10 habits**: Dashboard overview
- **Loading/empty states**: Proper UX patterns
- **Today-only toggle**: Simplified interaction for dashboard (weekly view on Habits page)

**Note**: Weekly interaction (like on Habits page) would require more complex UI. For dashboard simplicity, we show today's toggle only. Users can go to full Habits page for weekly view.

**Alternative Implementation** (with weekly toggles):

If you want full weekly interaction on dashboard, we can reuse the `WeekDayToggle` component from the Habits page. This would make the card taller but more functional. Let me know if you want this version instead.

---

### 2.6 Active Focus Session Component

**File**: `/home/aditya/Github/horizon/src/app/(protected)/(main)/dashboard/components/active-focus-session.tsx` (new)

```typescript
'use client';

import { useRouter } from 'next/navigation';
import { Clock, Pause, Play, CheckCircle2 } from 'lucide-react';
import { ContentCard } from '@/components/content-card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useFocusSession } from '@/app/(protected)/(main)/focus/hooks/mutations/use-focus-session';
import { useTimerLogic } from '@/app/(protected)/(main)/focus/hooks/timer/use-timer-logic';
import { formatTime } from '@/app/(protected)/(main)/focus/utils/timer-calculations';
import type { FocusSession } from '@/app/(protected)/(main)/focus/hooks/types';
import { cn } from '@/utils/utils';

interface ActiveFocusSessionProps {
  session: FocusSession;
}

export function ActiveFocusSession({ session }: ActiveFocusSessionProps) {
  const router = useRouter();
  const { pause, resume, complete } = useFocusSession();
  const { remainingSeconds } = useTimerLogic(session);

  const totalSeconds = session.durationMinutes * 60;
  const progress = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
  const isPaused = session.status === 'PAUSED';

  return (
    <ContentCard
      title="Active Focus Session"
      description={session.task || 'Untitled session'}
      className="border-primary/50 bg-primary/5"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="size-5 text-primary" />
            <span className="text-2xl font-bold">{formatTime(remainingSeconds)}</span>
          </div>

          <div className="text-sm text-muted-foreground">
            {session.durationMinutes} min session
          </div>
        </div>

        <Progress value={progress} className="h-2" />

        <div className="flex gap-2">
          {isPaused ? (
            <Button
              size="sm"
              variant="default"
              onClick={() => resume.mutate({ param: { id: session.id } })}
              disabled={resume.isPending}
            >
              <Play className="mr-2 size-4" />
              Resume
            </Button>
          ) : (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => pause.mutate({ param: { id: session.id } })}
              disabled={pause.isPending}
            >
              <Pause className="mr-2 size-4" />
              Pause
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={() => complete.mutate({ param: { id: session.id } })}
            disabled={complete.isPending}
          >
            <CheckCircle2 className="mr-2 size-4" />
            Complete
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => router.push('/focus')}
          >
            View Details
          </Button>
        </div>
      </div>
    </ContentCard>
  );
}
```

**Features**:

- **Live timer**: Uses existing `useTimerLogic` hook
- **Progress bar**: Visual indication of completion
- **Quick controls**: Pause/Resume, Complete, View Details
- **Highlighted card**: Primary border and background to stand out
- **Task display**: Shows session task or "Untitled session"
- **Reuses existing logic**: No duplication of timer/mutation logic

---

### 2.7 Focus Session Start Button

**File**: `/home/aditya/Github/horizon/src/app/(protected)/(main)/dashboard/components/start-focus-button.tsx` (new)

```typescript
'use client';

import { useState } from 'react';
import { Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DurationDropdown } from '@/app/(protected)/(main)/focus/components/timer/duration-dropdown';
import { useFocusSession } from '@/app/(protected)/(main)/focus/hooks/mutations/use-focus-session';

export function StartFocusButton() {
  const [open, setOpen] = useState(false);
  const [task, setTask] = useState('');
  const [duration, setDuration] = useState(45);

  const { start } = useFocusSession();

  function handleStart() {
    start.mutate(
      {
        json: {
          durationMinutes: duration,
          task: task || undefined,
        },
      },
      {
        onSuccess: () => {
          setOpen(false);
          setTask('');
          setDuration(45);
        },
      }
    );
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Timer className="mr-2 size-4" />
        Start Focus Session
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start Focus Session</DialogTitle>
            <DialogDescription>
              Set your focus duration and optional task
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="task">Task (Optional)</Label>
              <Input
                id="task"
                placeholder="What are you working on?"
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Duration</Label>
              <DurationDropdown
                selectedMinutes={duration}
                onSelect={setDuration}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleStart}
                disabled={start.isPending}
                className="flex-1"
              >
                Start Session
              </Button>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={start.isPending}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

**Add to Dashboard Page**:

Update `/home/aditya/Github/horizon/src/app/(protected)/(main)/dashboard/page.tsx`:

```typescript
import { StartFocusButton } from './components/start-focus-button';

// In PageHeading:
<PageHeading
  title="Dashboard"
  description="Your productivity overview"
  action={!metrics?.focus.activeSession && <StartFocusButton />}
/>
```

**Features**:

- **Dialog-based UI**: Clean modal interface
- **Task input**: Optional task name
- **Duration selector**: Reuses existing `DurationDropdown` component
- **Conditional display**: Only shows button when no active session
- **Existing mutation**: Uses `start` from `useFocusSession` hook

---

### 2.8 Heatmap Component Integration

**File**: `/home/aditya/Github/horizon/src/app/(protected)/(main)/dashboard/components/productivity-heatmap-card.tsx`

**Update existing component** to use real data:

```typescript
'use client';

import { useMemo } from 'react';
import { ContentCard } from '@/components/content-card';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/error-state';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { HeatmapData } from '../hooks/types';
import { cn } from '@/utils/utils';

interface ProductivityHeatmapCardProps {
  data: HeatmapData | undefined;
  isLoading: boolean;
  error: Error | null;
}

export function ProductivityHeatmapCard({ data, isLoading, error }: ProductivityHeatmapCardProps) {
  const weeks = useMemo(() => {
    if (!data) return [];

    // Group data into weeks (7 days each)
    const result: HeatmapData[][] = [];
    for (let i = 0; i < data.length; i += 7) {
      result.push(data.slice(i, i + 7));
    }
    return result;
  }, [data]);

  const months = useMemo(() => {
    if (!data) return [];

    // Calculate month labels
    const monthLabels: { name: string; offset: number }[] = [];
    let currentMonth = '';

    data.forEach((day, index) => {
      const date = new Date(day.date);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });

      if (monthName !== currentMonth) {
        currentMonth = monthName;
        const weekIndex = Math.floor(index / 7);
        monthLabels.push({ name: monthName, offset: weekIndex });
      }
    });

    return monthLabels;
  }, [data]);

  if (error) {
    return (
      <ContentCard title="Productivity Heatmap" description="Your activity over time">
        <ErrorState message="Failed to load heatmap" />
      </ContentCard>
    );
  }

  if (isLoading) {
    return (
      <ContentCard title="Productivity Heatmap" description="Your activity over time">
        <Skeleton className="h-[200px] w-full" />
      </ContentCard>
    );
  }

  return (
    <ContentCard
      title="Productivity Heatmap"
      description="Your activity over the last 52 weeks"
    >
      <div className="space-y-2">
        {/* Month labels */}
        <div className="flex gap-1" style={{ paddingLeft: '32px' }}>
          {months.map((month, index) => (
            <div
              key={index}
              className="text-xs text-muted-foreground"
              style={{ marginLeft: `${month.offset * 12}px` }}
            >
              {month.name}
            </div>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 text-xs text-muted-foreground">
            <div style={{ height: '10px' }}>Mon</div>
            <div style={{ height: '10px' }} />
            <div style={{ height: '10px' }}>Wed</div>
            <div style={{ height: '10px' }} />
            <div style={{ height: '10px' }}>Fri</div>
            <div style={{ height: '10px' }} />
            <div style={{ height: '10px' }}>Sun</div>
          </div>

          {/* Weeks */}
          <div className="flex gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => (
                  <HeatmapCell key={day.date} day={day} />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 justify-end pt-2">
          <span className="text-xs text-muted-foreground">Less</span>
          {[0, 1, 2, 3, 4].map(level => (
            <div
              key={level}
              className={cn(
                'size-3 rounded-sm',
                getLevelColor(level)
              )}
            />
          ))}
          <span className="text-xs text-muted-foreground">More</span>
        </div>
      </div>
    </ContentCard>
  );
}

interface HeatmapCellProps {
  day: HeatmapData[number];
}

function HeatmapCell({ day }: HeatmapCellProps) {
  const date = new Date(day.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            'size-3 rounded-sm cursor-pointer transition-all hover:ring-2 hover:ring-primary',
            getLevelColor(day.level)
          )}
        />
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-xs space-y-1">
          <div className="font-medium">{formattedDate}</div>
          <div>Focus: {day.focusMinutes}m</div>
          <div>Tasks: {day.tasksCompleted}</div>
          <div>Habits: {day.habitsCompleted}</div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

function getLevelColor(level: number): string {
  switch (level) {
    case 0: return 'bg-muted';
    case 1: return 'bg-green-200 dark:bg-green-900';
    case 2: return 'bg-green-300 dark:bg-green-700';
    case 3: return 'bg-green-400 dark:bg-green-600';
    case 4: return 'bg-green-500 dark:bg-green-500';
    default: return 'bg-muted';
  }
}
```

**Changes from current implementation**:

- **Real data** from `useHeatmapData()` hook
- **Loading state**: Skeleton while fetching
- **Error state**: ErrorState component
- **Tooltip data**: Shows actual focus/tasks/habits counts
- **Intensity levels**: Calculated by backend based on activity volume
- **Responsive design**: Works with different week counts

---

### 2.9 Chart Components with Real Data

**File**: `/home/aditya/Github/horizon/src/app/(protected)/(main)/dashboard/components/focus-time-chart.tsx`

**Update existing component**:

```typescript
'use client';

import { useMemo } from 'react';
import { ContentCard } from '@/components/content-card';
import { GenericAreaChart } from '@/components/generic-area-chart';
import { Skeleton } from '@/components/ui/skeleton';
import { generateChartData } from '@/app/(protected)/(main)/focus/utils/session-metrics';
import type { FocusSession } from '@/app/(protected)/(main)/focus/hooks/types';

interface FocusTimeChartProps {
  data: FocusSession[] | undefined;
  isLoading: boolean;
  period: number;
  onPeriodChange: (days: number) => void;
}

export function FocusTimeChart({ data, isLoading, period, onPeriodChange }: FocusTimeChartProps) {
  const chartData = useMemo(() => {
    if (!data) return [];
    return generateChartData(data, period);
  }, [data, period]);

  if (isLoading) {
    return (
      <ContentCard title="Focus Time" description="Daily focus duration">
        <Skeleton className="h-[200px] w-full" />
      </ContentCard>
    );
  }

  return (
    <GenericAreaChart
      title="Focus Time"
      description="Daily focus duration"
      data={chartData}
      dataKey="minutes"
      color="#8b5cf6"
      formatValue={(value) => `${value}m`}
      period={period}
      onPeriodChange={onPeriodChange}
    />
  );
}
```

**File**: `/home/aditya/Github/horizon/src/app/(protected)/(main)/dashboard/components/task-completion-chart.tsx`

**Update existing component**:

```typescript
'use client';

import { ContentCard } from '@/components/content-card';
import { GenericAreaChart } from '@/components/generic-area-chart';
import { Skeleton } from '@/components/ui/skeleton';
import type { TaskChartData } from '@/app/(protected)/(main)/tasks/hooks/types';

interface TaskCompletionChartProps {
  data: TaskChartData | undefined;
  isLoading: boolean;
  period: number;
  onPeriodChange: (days: number) => void;
}

export function TaskCompletionChart({ data, isLoading, period, onPeriodChange }: TaskCompletionChartProps) {
  if (isLoading) {
    return (
      <ContentCard title="Task Completion" description="Daily completion rate">
        <Skeleton className="h-[200px] w-full" />
      </ContentCard>
    );
  }

  return (
    <GenericAreaChart
      title="Task Completion"
      description="Daily completion rate"
      data={data || []}
      dataKey="completionRate"
      color="#10b981"
      formatValue={(value) => `${value}%`}
      period={period}
      onPeriodChange={onPeriodChange}
    />
  );
}
```

**File**: `/home/aditya/Github/horizon/src/app/(protected)/(main)/dashboard/components/habit-completion-chart.tsx`

**Update existing component**:

```typescript
'use client';

import { ContentCard } from '@/components/content-card';
import { GenericAreaChart } from '@/components/generic-area-chart';
import { Skeleton } from '@/components/ui/skeleton';
import type { HabitChartData } from '../hooks/types';

interface HabitCompletionChartProps {
  data: HabitChartData | undefined;
  isLoading: boolean;
  period: number;
  onPeriodChange: (days: number) => void;
}

export function HabitCompletionChart({ data, isLoading, period, onPeriodChange }: HabitCompletionChartProps) {
  if (isLoading) {
    return (
      <ContentCard title="Habit Completion" description="Daily completion rate">
        <Skeleton className="h-[200px] w-full" />
      </ContentCard>
    );
  }

  return (
    <GenericAreaChart
      title="Habit Completion"
      description="Daily completion rate"
      data={data || []}
      dataKey="completionRate"
      color="#f59e0b"
      formatValue={(value) => `${value}%`}
      period={period}
      onPeriodChange={onPeriodChange}
    />
  );
}
```

**Key Changes**:

- **Real data**: All charts now use actual API data
- **Loading states**: Skeleton components during fetch
- **Period selector**: Shared state in parent (DashboardPage)
- **Data transformations**: Reuse existing utility functions where available
- **Type safety**: All props properly typed with inferred API types

---

### 2.10 Loading and Error States

**File**: `/home/aditya/Github/horizon/src/app/(protected)/(main)/dashboard/components/skeletons/metrics-skeleton.tsx` (new)

```typescript
import { Skeleton } from '@/components/ui/skeleton';

export function MetricsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-lg border p-6 space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      ))}
    </div>
  );
}
```

**Existing Components**:

- `ErrorState` component already exists in `/home/aditya/Github/horizon/src/components/error-state.tsx`
- `Skeleton` component from shadcn/ui
- `EmptyState` component already exists

**Usage**: All components implemented above use proper loading/error/empty states.

---

### 2.11 Query Invalidation Strategy

**Goal**: Ensure dashboard updates when data changes elsewhere in the app.

**Strategy**: Invalidate dashboard queries when mutations occur in Tasks, Habits, or Focus features.

**Implementation**:

**Tasks Mutations** - Update all task mutation hooks to also invalidate dashboard keys:

Example (`/home/aditya/Github/horizon/src/app/(protected)/(main)/tasks/hooks/mutations/use-toggle-task.ts`):

```typescript
import { DASHBOARD_QUERY_KEYS } from '@/app/(protected)/(main)/dashboard/hooks/dashboard-query-keys';

export function useToggleTask() {
  return useApiMutation(api.tasks[':id'].toggle.$patch, {
    invalidateKeys: [
      TASK_QUERY_KEYS.tasks,
      TASK_QUERY_KEYS.stats,
      TASK_QUERY_KEYS.chart,
      DASHBOARD_QUERY_KEYS.metrics, // Add
      DASHBOARD_QUERY_KEYS.heatmap, // Add
    ],
  });
}
```

Apply same pattern to:

- `useCreateTask`
- `useUpdateTask`
- `useDeleteTask`
- `useBulkCreateTasks`

**Habits Mutations** - Update habit mutation hooks:

Example (`/home/aditya/Github/horizon/src/app/(protected)/(main)/habits/hooks/mutations/use-toggle-habit.ts`):

```typescript
import { DASHBOARD_QUERY_KEYS } from '@/app/(protected)/(main)/dashboard/hooks/dashboard-query-keys';

export function useToggleHabit() {
  const toggleToday = useApiMutation(api.habits[':id'].toggle.$post, {
    invalidateKeys: [
      HABITS_QUERY_KEYS.list,
      HABITS_QUERY_KEYS.stats,
      DASHBOARD_QUERY_KEYS.metrics, // Add
      DASHBOARD_QUERY_KEYS.heatmap, // Add
      DASHBOARD_QUERY_KEYS.habitChart, // Add
    ],
  });

  const toggleDate = useApiMutation(api.habits[':id']['toggle-date'].$post, {
    invalidateKeys: [
      HABITS_QUERY_KEYS.list,
      HABITS_QUERY_KEYS.stats,
      DASHBOARD_QUERY_KEYS.metrics,
      DASHBOARD_QUERY_KEYS.heatmap,
      DASHBOARD_QUERY_KEYS.habitChart,
    ],
  });

  return { toggleToday, toggleDate };
}
```

Apply to all habit mutations.

**Focus Mutations** - Update focus session hooks:

Example (`/home/aditya/Github/horizon/src/app/(protected)/(main)/focus/hooks/mutations/use-focus-session.ts`):

```typescript
import { DASHBOARD_QUERY_KEYS } from '@/app/(protected)/(main)/dashboard/hooks/dashboard-query-keys';

// In complete mutation:
complete: useApiMutation(api.focus.sessions[':id'].complete.$patch, {
  invalidateKeys: [
    FOCUS_QUERY_KEYS.active,
    FOCUS_QUERY_KEYS.sessions,
    FOCUS_QUERY_KEYS.stats,
    DASHBOARD_QUERY_KEYS.metrics,
    DASHBOARD_QUERY_KEYS.heatmap,
  ],
});
```

Apply to all focus mutations that affect completed sessions.

**Result**: Dashboard automatically refreshes when user:

- Completes/creates/deletes a task
- Toggles a habit completion
- Completes a focus session

---

## PHASE 2 SUMMARY

### Files to Create:

1. `/home/aditya/Github/horizon/src/app/(protected)/(main)/dashboard/hooks/queries/use-dashboard-metrics.ts`
2. `/home/aditya/Github/horizon/src/app/(protected)/(main)/dashboard/hooks/queries/use-heatmap-data.ts`
3. `/home/aditya/Github/horizon/src/app/(protected)/(main)/dashboard/hooks/queries/use-habit-chart.ts`
4. `/home/aditya/Github/horizon/src/app/(protected)/(main)/dashboard/hooks/dashboard-query-keys.ts`
5. `/home/aditya/Github/horizon/src/app/(protected)/(main)/dashboard/hooks/types.ts`
6. `/home/aditya/Github/horizon/src/app/(protected)/(main)/dashboard/components/dashboard-metrics.tsx`
7. `/home/aditya/Github/horizon/src/app/(protected)/(main)/dashboard/components/active-focus-session.tsx`
8. `/home/aditya/Github/horizon/src/app/(protected)/(main)/dashboard/components/start-focus-button.tsx`
9. `/home/aditya/Github/horizon/src/app/(protected)/(main)/dashboard/components/skeletons/metrics-skeleton.tsx`

### Files to Update:

1. `/home/aditya/Github/horizon/src/app/(protected)/(main)/dashboard/page.tsx` (convert to client component)
2. `/home/aditya/Github/horizon/src/app/(protected)/(main)/dashboard/components/dashboard-tasks-card.tsx` (wire up real data)
3. `/home/aditya/Github/horizon/src/app/(protected)/(main)/dashboard/components/dashboard-habits-card.tsx` (wire up real data)
4. `/home/aditya/Github/horizon/src/app/(protected)/(main)/dashboard/components/productivity-heatmap-card.tsx` (wire up real data)
5. `/home/aditya/Github/horizon/src/app/(protected)/(main)/dashboard/components/focus-time-chart.tsx` (wire up real data)
6. `/home/aditya/Github/horizon/src/app/(protected)/(main)/dashboard/components/task-completion-chart.tsx` (wire up real data)
7. `/home/aditya/Github/horizon/src/app/(protected)/(main)/dashboard/components/habit-completion-chart.tsx` (wire up real data)
8. `/home/aditya/Github/horizon/src/app/(protected)/(main)/tasks/utils/task-filters.ts` (add `getDueDateUrgency` function)
9. All task mutation hooks (add dashboard invalidations)
10. All habit mutation hooks (add dashboard invalidations)
11. All focus mutation hooks (add dashboard invalidations)

---

## TESTING STRATEGY

### Backend Testing

**Unit Tests**:

1. `calculateOverallStreak()` - Test streak logic with various date patterns
2. `getHeatmapData()` - Test date range filtering and aggregation
3. `calculateLevel()` - Test intensity level calculation
4. `GET /api/dashboard/metrics` - Test response structure and data accuracy
5. `GET /api/dashboard/heatmap` - Test query params and data grouping
6. `GET /api/habits/chart` - Test completion rate calculations

**Integration Tests**:

1. Create tasks/habits/focus sessions, verify dashboard metrics update
2. Test heatmap with mixed activity types
3. Test streak calculation across features
4. Test date normalization and timezone handling

### Frontend Testing

**Component Tests**:

1. `DashboardMetrics` - Test rendering with different metric values
2. `DashboardTasksCard` - Test interactive checkboxes
3. `DashboardHabitsCard` - Test toggle functionality
4. `ActiveFocusSession` - Test timer display and controls
5. `ProductivityHeatmapCard` - Test tooltip and level colors

**Integration Tests**:

1. Test data fetching and loading states
2. Test error states and retry functionality
3. Test query invalidation on mutations
4. Test period selector for charts

### Manual Testing Checklist

- [ ] All metric cards show real data
- [ ] Task card displays correct tasks with context (projects, tags)
- [ ] Task checkboxes toggle completion
- [ ] Habit card displays correct habits
- [ ] Habit checkboxes toggle today's completion
- [ ] Active focus session shows timer and controls
- [ ] Start focus button creates new session
- [ ] Charts display real data for all periods
- [ ] Heatmap shows correct activity levels
- [ ] Heatmap tooltips show correct data
- [ ] Completing task elsewhere updates dashboard
- [ ] Completing habit elsewhere updates dashboard
- [ ] Completing focus session updates dashboard
- [ ] Loading states appear correctly
- [ ] Error states show retry option
- [ ] Empty states show helpful messages

---

## PERFORMANCE CONSIDERATIONS

### Backend Optimizations

1. **Query Efficiency**:
   - Use indexes: `userId + status`, `userId + date`, `userId + completed`
   - Parallel queries with `Promise.all`
   - Select only necessary fields

2. **Caching Strategy**:
   - Dashboard metrics: 5-minute cache
   - Heatmap data: 30-minute cache (past dates don't change)
   - Consider Redis for production

3. **Aggregation**:
   - Server-side aggregation for heatmap (expensive calculation)
   - Client-side transformation for charts (lightweight)

4. **Future Optimization**:
   - Materialized views for dashboard cache table
   - Pre-calculate daily stats on mutation
   - Background job to update stats

### Frontend Optimizations

1. **React Query**:
   - `staleTime` configured per query
   - Smart invalidation (only what changed)
   - Automatic background refetching

2. **Component Structure**:
   - Memoization where needed
   - Lazy loading for charts
   - Skeleton loading (no spinners)

3. **Data Fetching**:
   - Single metrics call instead of 4 separate calls
   - Reuse existing endpoints where possible
   - Minimal over-fetching

---

## DEPLOYMENT CHECKLIST

### Pre-Deployment

- [ ] All backend routes implemented and tested
- [ ] All frontend components wired up
- [ ] TypeScript errors resolved
- [ ] Zod schemas validated
- [ ] Query keys properly defined
- [ ] Loading/error states implemented
- [ ] Empty states implemented
- [ ] Responsive design verified
- [ ] Dark mode support verified

### Post-Deployment Monitoring

- [ ] Monitor API response times (especially heatmap endpoint)
- [ ] Check query invalidation working correctly
- [ ] Verify real-time updates across features
- [ ] Monitor database query performance
- [ ] Check for N+1 query issues
- [ ] Verify caching behavior

---

## FUTURE ENHANCEMENTS

### Short-term (v1.1)

1. **Weekly/Monthly View**: Toggle between daily/weekly/monthly aggregations
2. **Export Data**: CSV/JSON export of productivity data
3. **Customizable Metrics**: User-selected metric cards
4. **Goal Setting**: Set daily/weekly productivity goals

### Medium-term (v1.2)

1. **Insights Panel**: AI-generated productivity insights
2. **Comparison View**: Compare current week to previous weeks
3. **Filters**: Filter dashboard by project/category/tags
4. **Widgets**: Draggable/resizable dashboard widgets

### Long-term (v2.0)

1. **Team Dashboard**: Aggregated team productivity view
2. **Integrations**: Calendar, Slack, GitHub integration
3. **Reports**: Automated weekly/monthly email reports
4. **Gamification**: Badges, achievements, leaderboards

---

## CONCLUSION

This implementation plan transforms the dashboard from a static mockup into a fully functional, data-driven productivity overview. The plan follows established patterns from Tasks, Habits, and Focus features while introducing optimized aggregation endpoints for dashboard-specific needs.

**Key Principles**:

- Type-safe end-to-end
- Server-side aggregation for expensive calculations
- Reuse existing infrastructure where efficient
- Real-time updates via query invalidation
- Proper loading/error/empty states
- Performance-optimized with caching

**Implementation Order**:

1. Phase 1 (Backend): Complete all API routes and services first
2. Phase 2 (Frontend): Wire up components with real data
3. Testing: Comprehensive testing before deployment
4. Deployment: Monitor and optimize based on usage

The dashboard will provide users with a comprehensive, real-time view of their productivity across all three pillars: Focus, Tasks, and Habits.
