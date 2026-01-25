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
import { useAtom } from 'jotai';
import { deletingHabitIdAtom } from '../../atoms/dialog-atoms';
import { useDeleteHabit } from '../../hooks/mutations/use-delete-habit';
import { useInfiniteHabits } from '../../hooks/queries/use-infinite-habits';

export const DeleteHabitDialog = () => {
  const [deletingHabitId, setDeletingHabitId] = useAtom(deletingHabitIdAtom);

  const { habits } = useInfiniteHabits({ days: 7 });
  const habit = habits.find((h) => h.id === deletingHabitId) || null;

  const deleteHabit = useDeleteHabit();

  const handleDelete = () => {
    if (!habit) return;

    deleteHabit.mutate(
      { param: { id: habit.id } },
      {
        onSuccess: () => {
          setDeletingHabitId(null);
        },
      }
    );
  };

  return (
    <ResponsiveDialog
      open={!!deletingHabitId}
      onOpenChange={(open) => !open && setDeletingHabitId(null)}
    >
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
            onClick={() => setDeletingHabitId(null)}
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
