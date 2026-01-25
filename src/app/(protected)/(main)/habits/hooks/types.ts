import type { api } from '@/lib/rpc';
import type { InferResponseType } from 'hono/client';

type HabitsResponse = InferResponseType<typeof api.habits.$get>;
export type Habit = HabitsResponse['habits'][number];

type StatsResponse = InferResponseType<typeof api.habits.stats.$get>;
export type HabitStats = StatsResponse['stats'];
