'use client';

import { ContentCard } from '@/app/(protected)/(main)/components/content-card';
import { createDialogOpenAtom } from '@/app/(protected)/(main)/habits/atoms/dialog-atoms';
import { useToggleHabit } from '@/app/(protected)/(main)/habits/hooks/mutations/use-toggle-habit';
import { useHabits } from '@/app/(protected)/(main)/habits/hooks/queries/use-habits';
import { enrichHabitsWithMetrics } from '@/app/(protected)/(main)/habits/utils/habit-calculations';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils/utils';
import { useAtom } from 'jotai';
import { Flame, Plus } from 'lucide-react';

export function DashboardHabitsCard() {
  const [, setCreateDialogOpen] = useAtom(createDialogOpenAtom);
  const { data: habits, isLoading } = useHabits(7);
  const { toggleToday } = useToggleHabit();

  const enrichedHabits = habits ? enrichHabitsWithMetrics(habits) : [];

  if (isLoading) {
    return (
      <ContentCard title="Habits" contentClassName="mt-5">
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
      action={
        <Button
          size="icon-sm"
          variant="ghost"
          className="size-6"
          onClick={() => setCreateDialogOpen(true)}
        >
          <Plus />
        </Button>
      }
      contentClassName="mt-5"
    >
      {enrichedHabits.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-muted-foreground text-sm">No habits</p>
          <p className="text-muted-foreground text-xs">
            Create a habit to get started
          </p>
        </div>
      ) : (
        <ScrollArea className="h-[300px]">
          <div>
            {enrichedHabits.slice(0, 10).map((habit, index) => {
              const streakColor = getStreakColor(habit.currentStreak);

              return (
                <div key={habit.id}>
                  <div className="flex items-start gap-3 py-3 transition-colors">
                    <Checkbox
                      checked={habit.completed}
                      onCheckedChange={() =>
                        toggleToday.mutate({ param: { id: habit.id } })
                      }
                    />

                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          'truncate text-sm font-medium',
                          habit.completed &&
                            'text-muted-foreground line-through'
                        )}
                      >
                        {habit.title}
                      </p>
                      {habit.category && (
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {habit.category}
                        </Badge>
                      )}
                    </div>

                    {habit.currentStreak > 0 && (
                      <div className="flex shrink-0 items-center gap-1">
                        <Flame className={cn('size-4', streakColor)} />
                        <span className="text-xs font-medium">
                          {habit.currentStreak}
                        </span>
                      </div>
                    )}
                  </div>
                  {index < enrichedHabits.slice(0, 10).length - 1 && (
                    <Separator />
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
