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
import { useAtom } from 'jotai';
import { deletingTaskAtom } from '../../atoms/task-dialogs';
import { useDeleteTask } from '../../hooks/mutations/use-delete-task';

export const DeleteTaskDialog = () => {
  const [task, setTask] = useAtom(deletingTaskAtom);
  const deleteTask = useDeleteTask();

  const handleClose = () => {
    setTask(null);
  };

  const handleDelete = () => {
    if (!task) return;

    deleteTask.mutate({ param: { id: task.id } }, { onSuccess: handleClose });
  };

  return (
    <ResponsiveDialog
      open={!!task}
      onOpenChange={(open) => !open && handleClose()}
    >
      <ResponsiveDialogContent showCloseButton={false}>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Delete Task</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Are you sure you want to delete &quot;{task?.title}&quot;? This
            action cannot be undone.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <ResponsiveDialogFooter>
          <ResponsiveDialogClose asChild>
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={deleteTask.isPending}
            >
              Cancel
            </Button>
          </ResponsiveDialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteTask.isPending}
            isLoading={deleteTask.isPending}
            loadingContent="Deleting..."
          >
            Delete
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
