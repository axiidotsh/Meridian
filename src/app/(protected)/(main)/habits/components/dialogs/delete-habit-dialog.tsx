'use client';

import { Button } from '@/components/ui/button';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';
import { useDeleteHabit } from '../../hooks/mutations/use-delete-habit';
import type { HabitWithMetrics } from '../../hooks/types';

interface DeleteHabitDialogProps {
  habit: HabitWithMetrics | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeleteHabitDialog = ({
  habit,
  open,
  onOpenChange,
}: DeleteHabitDialogProps) => {
  const deleteHabit = useDeleteHabit();

  const handleDelete = () => {
    if (!habit) return;

    deleteHabit.mutate(
      { param: { id: habit.id } },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent showCloseButton={false}>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Delete Habit</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Are you sure you want to delete &ldquo;{habit?.title}&rdquo;? This
            will archive the habit but keep your completion history.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <ResponsiveDialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteHabit.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteHabit.isPending}
            isLoading={deleteHabit.isPending}
            loadingContent="Deleting..."
          >
            Delete
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
