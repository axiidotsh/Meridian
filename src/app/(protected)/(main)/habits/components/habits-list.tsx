import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useAtomValue } from 'jotai';
import { ListChecksIcon, TargetIcon } from 'lucide-react';
import { useMemo } from 'react';
import {
  searchQueryAtom,
  sortByAtom,
  statusFilterAtom,
} from '../atoms/habit-atoms';
import { useHabits } from '../hooks/queries/use-habits';
import {
  enrichHabitsWithMetrics,
  filterHabits,
  sortHabits,
} from '../utils/habit-calculations';
import { HabitRow } from './habit-row';
import { WeekDayHeader } from './week-day-header';

function HabitTrackerSkeleton() {
  return (
    <div className="my-4 space-y-3 pr-4">
      <div className="border-border mb-2 flex items-center gap-3 border-b pb-2">
        <div className="flex-1" />
        <div className="flex gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="size-3.5" />
          ))}
        </div>
        <div className="w-8 shrink-0" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="border-border flex items-center gap-3 border-b pb-3"
        >
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-20" />
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 7 }).map((_, j) => (
              <Skeleton key={j} className="size-3.5 rounded-full" />
            ))}
          </div>
          <Skeleton className="size-8 shrink-0" />
        </div>
      ))}
    </div>
  );
}

export const HabitsList = () => {
  const { data: rawHabits = [], isLoading } = useHabits();
  const sortBy = useAtomValue(sortByAtom);
  const searchQuery = useAtomValue(searchQueryAtom);
  const statusFilter = useAtomValue(statusFilterAtom);

  const habits = useMemo(() => enrichHabitsWithMetrics(rawHabits), [rawHabits]);

  const filteredHabits = useMemo(
    () => filterHabits(habits, searchQuery, statusFilter),
    [habits, searchQuery, statusFilter]
  );

  const sortedHabits = useMemo(
    () => sortHabits(filteredHabits, sortBy),
    [filteredHabits, sortBy]
  );

  if (isLoading) {
    return <HabitTrackerSkeleton />;
  }

  return (
    <ScrollArea className="my-4">
      <div className="max-h-[600px]">
        {habits.length === 0 ? (
          <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 py-20 text-center">
            <TargetIcon className="mb-2 size-12 stroke-1 opacity-50" />
            <p className="text-sm font-medium">No habits yet</p>
            <p className="text-xs">Create your first habit to get started</p>
          </div>
        ) : sortedHabits.length === 0 ? (
          <div className="text-muted-foreground flex h-[600px] flex-col items-center justify-center gap-2 py-20 text-center">
            <ListChecksIcon className="mb-2 size-12 stroke-1 opacity-50" />
            <p className="text-sm font-medium">No habits found</p>
            <p className="text-xs">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="pr-4">
            <div className="border-border mb-2 flex items-center gap-3 border-b pb-2">
              <span className="text-muted-foreground font-mono text-xs font-medium">
                {sortedHabits.length}{' '}
                {sortedHabits.length === 1 ? 'Habit' : 'Habits'}
              </span>
              <div className="flex-1" />
              <WeekDayHeader />
              <div className="w-8 shrink-0" />
            </div>
            <ul className="space-y-3">
              {sortedHabits.map((habit) => (
                <HabitRow key={habit.id} habit={habit} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};
