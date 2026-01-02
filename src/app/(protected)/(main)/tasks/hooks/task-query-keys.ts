export const TASK_QUERY_KEYS = {
  tasks: ['tasks'] as const,
  stats: ['tasks', 'stats'] as const,
  chart: ['tasks', 'chart'] as const,
  chartWithDays: (days: number) => ['tasks', 'chart', days] as const,
  projects: ['projects'] as const,
};
