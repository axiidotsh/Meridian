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
import { deletingHabitAtom } from '../../atoms/dialog-atoms';
import { useDeleteHabit } from '../../hooks/mutations/use-delete-habit';

export const DeleteHabitDialog = () => {
  const [habit, setDeletingHabit] = useAtom(deletingHabitAtom);

  const deleteHabit = useDeleteHabit();

  const handleDelete = () => {
    if (!habit) return;

    deleteHabit.mutate(
      { param: { id: habit.id } },
      {
        onSuccess: () => {
          setDeletingHabit(null);
        },
      }
    );
  };

  return (
    <ResponsiveDialog
      open={!!habit}
      onOpenChange={(open) => !open && setDeletingHabit(null)}
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
            onClick={() => setDeletingHabit(null)}
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
