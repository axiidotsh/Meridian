'use client';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useSetAtom } from 'jotai';
import { PartyPopperIcon, PlusIcon } from 'lucide-react';
import { ContentCard } from '../../components/content-card';
import { createDialogOpenAtom } from '../../habits/atoms/dialog-atoms';
import { HabitRow } from '../../habits/components/habit-row';
import { WeekDayHeader } from '../../habits/components/week-day-header';
import { useDashboardHabits } from '../hooks/use-dashboard-habits';

function DashboardHabitListSkeleton() {
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

const DashboardHabitListActions = () => {
  const setCreateDialogOpen = useSetAtom(createDialogOpenAtom);

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => setCreateDialogOpen(true)}
    >
      <PlusIcon />
      New
    </Button>
  );
};

export const DashboardHabitList = () => {
  const { data: habits = [], isLoading } = useDashboardHabits();

  const renderContent = () => {
    if (isLoading) {
      return <DashboardHabitListSkeleton />;
    }

    if (habits.length === 0) {
      return (
        <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 py-16 text-center">
          <PartyPopperIcon className="mb-2 size-12 stroke-1 opacity-50" />
          <p className="text-sm font-medium">All caught up!</p>
          <p className="text-xs">All habits completed for today</p>
        </div>
      );
    }

    return (
      <div className="mt-6 pr-4">
        <div className="border-border mb-2 flex items-center gap-3 border-b pb-2">
          <div className="flex-1" />
          <WeekDayHeader />
          <div className="w-8 shrink-0" />
        </div>
        <ul className="space-y-3">
          {habits.map((habit) => (
            <HabitRow key={habit.id} habit={habit} />
          ))}
        </ul>
      </div>
    );
  };

  return (
    <ContentCard
      title="Keep the Streak"
      action={<DashboardHabitListActions />}
      isDashboard
    >
      {renderContent()}
    </ContentCard>
  );
};
