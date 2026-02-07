'use client';

import { type EmptyTrashTarget, emptyTrashDialogAtom } from '@/atoms/ui-atoms';
import { useAtom } from 'jotai';
import { useRef } from 'react';
import {
  useEmptyAllTrash,
  useEmptyTrashHabits,
  useEmptyTrashSessions,
  useEmptyTrashTasks,
} from '../hooks/mutations/use-empty-trash';
import { EmptyTrashDialog } from './empty-trash-dialog';

const DIALOG_CONFIG: Record<
  Exclude<EmptyTrashTarget, null>,
  { title: string; description: string }
> = {
  tasks: {
    title: 'Clear trashed tasks?',
    description:
      'This action cannot be undone. All trashed tasks will be permanently deleted.',
  },
  habits: {
    title: 'Clear trashed habits?',
    description:
      'This action cannot be undone. All trashed habits will be permanently deleted.',
  },
  sessions: {
    title: 'Clear trashed sessions?',
    description:
      'This action cannot be undone. All trashed focus sessions will be permanently deleted.',
  },
  all: {
    title: 'Empty entire trash?',
    description:
      'This action cannot be undone. All trashed items will be permanently deleted.',
  },
};

export function EmptyTrashCommandDialog() {
  const [target, setTarget] = useAtom(emptyTrashDialogAtom);

  const emptyAll = useEmptyAllTrash();
  const emptyTasks = useEmptyTrashTasks();
  const emptyHabits = useEmptyTrashHabits();
  const emptySessions = useEmptyTrashSessions();

  const lastTargetRef = useRef(target);
  if (target) lastTargetRef.current = target;

  const activeTarget = target ?? lastTargetRef.current;
  const config = activeTarget ? DIALOG_CONFIG[activeTarget] : null;
  const mutationMap = {
    tasks: emptyTasks,
    habits: emptyHabits,
    sessions: emptySessions,
    all: emptyAll,
  };
  const mutation = activeTarget ? mutationMap[activeTarget] : null;

  return (
    <EmptyTrashDialog
      open={!!target}
      onOpenChange={(open) => {
        if (!open) setTarget(null);
      }}
      title={config?.title ?? ''}
      description={config?.description ?? ''}
      onConfirm={() =>
        mutation?.mutate({}, { onSuccess: () => setTarget(null) })
      }
      isPending={mutation?.isPending}
    />
  );
}
