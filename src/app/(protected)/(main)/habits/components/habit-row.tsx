'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/utils/utils';
import { useSetAtom } from 'jotai';
import { EllipsisIcon, FlameIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import { deletingHabitIdAtom, editingHabitIdAtom } from '../atoms/dialog-atoms';
import { useToggleHabit } from '../hooks/mutations/use-toggle-habit';
import type { HabitWithMetrics } from '../hooks/types';
import { getStreakColor } from '../utils/streak-helpers';
import { WeekDayToggle } from './week-day-toggle';

interface HabitRowProps {
  habit: HabitWithMetrics;
}

export const HabitRow = ({ habit }: HabitRowProps) => {
  const setEditingHabitId = useSetAtom(editingHabitIdAtom);
  const setDeletingHabitId = useSetAtom(deletingHabitIdAtom);
  const { toggleDate } = useToggleHabit(habit.id);

  function handleToggleDay(date: Date) {
    const localYear = date.getFullYear();
    const localMonth = date.getMonth();
    const localDay = date.getDate();
    const utcDate = new Date(Date.UTC(localYear, localMonth, localDay));
    toggleDate.mutate({
      param: { id: habit.id },
      json: { date: utcDate.toISOString() },
    });
  }

  return (
    <li className="border-border flex items-center gap-3 border-b pb-3 last:border-0 last:pb-0">
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            'text-sm',
            habit.completed && 'text-muted-foreground line-through'
          )}
        >
          {habit.title}
        </p>
        {habit.currentStreak > 0 && (
          <div className="mt-0.5">
            <span
              className={cn(
                'flex items-center gap-1 font-mono text-xs',
                getStreakColor(habit.currentStreak)
              )}
            >
              <FlameIcon className="size-3" />
              {habit.currentStreak} day{habit.currentStreak !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
      <WeekDayToggle
        completionHistory={habit.completionHistory}
        onToggleDay={handleToggleDay}
        disabled={toggleDate.isPending}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon-sm"
            variant="ghost"
            className="shrink-0"
            aria-label="Habit options"
          >
            <EllipsisIcon className="text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditingHabitId(habit.id)}>
            <PencilIcon />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeletingHabitId(habit.id)}
          >
            <Trash2Icon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  );
};
