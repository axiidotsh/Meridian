import { Button } from '@/components/ui/button';
import { useSetAtom } from 'jotai';
import { PlusIcon } from 'lucide-react';
import { createTaskDialogAtom } from '../../tasks/atoms/task-dialogs';

export const DashboardTaskListActions = () => {
  const setCreateTaskDialog = useSetAtom(createTaskDialogAtom);

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => setCreateTaskDialog(true)}
    >
      <PlusIcon />
      New
    </Button>
  );
};
