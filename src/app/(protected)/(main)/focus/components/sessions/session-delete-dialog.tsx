'use client';

import { Button } from '@/components/ui/button';
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';
import { useDeleteSession } from '../../hooks/mutations/use-delete-session';
import type { FocusSession } from '../../hooks/types';

interface SessionDeleteDialogProps {
  session: FocusSession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SessionDeleteDialog = ({
  session,
  open,
  onOpenChange,
}: SessionDeleteDialogProps) => {
  const deleteSession = useDeleteSession();

  const handleDelete = () => {
    if (!session) return;

    deleteSession.mutate(
      { param: { id: session.id } },
      {
        onSuccess: () => onOpenChange(false),
      }
    );
  };

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent showCloseButton={false}>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Delete Session?</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Are you sure you want to delete this session
            {session?.task ? ` "${session.task}"` : ''}? This action cannot be
            undone.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <ResponsiveDialogFooter>
          <ResponsiveDialogClose asChild>
            <Button variant="outline" disabled={deleteSession.isPending}>
              Cancel
            </Button>
          </ResponsiveDialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteSession.isPending}
            isLoading={deleteSession.isPending}
            loadingContent="Deleting..."
          >
            Delete Session
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
