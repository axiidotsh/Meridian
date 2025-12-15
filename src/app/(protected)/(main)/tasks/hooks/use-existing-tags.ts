import { useMemo } from 'react';
import { useTasks } from './queries/use-tasks';

export function useExistingTags() {
  const { data: tasks = [] } = useTasks();

  return useMemo(
    () => Array.from(new Set(tasks.flatMap((t) => t.tags ?? []))).sort(),
    [tasks]
  );
}
