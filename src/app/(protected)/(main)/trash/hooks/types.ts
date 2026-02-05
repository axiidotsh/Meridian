import type { api } from '@/lib/rpc';
import type { InferResponseType } from 'hono/client';

export type TrashCountsResponse = InferResponseType<
  typeof api.trash.counts.$get
>;

export type TrashTasksResponse = InferResponseType<typeof api.trash.tasks.$get>;

export type TrashHabitsResponse = InferResponseType<
  typeof api.trash.habits.$get
>;

export type TrashSessionsResponse = InferResponseType<
  typeof api.trash.sessions.$get
>;

export type TrashTask = TrashTasksResponse['tasks'][number];
export type TrashHabit = TrashHabitsResponse['habits'][number];
export type TrashSession = TrashSessionsResponse['sessions'][number];
