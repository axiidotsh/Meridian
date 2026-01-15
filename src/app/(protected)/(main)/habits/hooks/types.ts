import type { api } from '@/lib/rpc';
import type { InferResponseType } from 'hono/client';

type HabitsResponse = InferResponseType<typeof api.habits.$get>;
export type Habit = HabitsResponse['habits'][number];

type StatsResponse = InferResponseType<typeof api.habits.stats.$get>;
export type HabitStats = StatsResponse['stats'];

export interface CompletionRecord {
  date: Date | string;
  completed: boolean;
}

export interface HabitWithMetrics extends Habit {
  currentStreak: number;
  bestStreak: number;
  totalCompletions: number;
  completed: boolean;
  completionHistory: CompletionRecord[];
}
