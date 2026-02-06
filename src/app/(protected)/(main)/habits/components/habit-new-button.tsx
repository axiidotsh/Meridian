'use client';

import { Button } from '@/components/ui/button';
import { useSetAtom } from 'jotai';
import { PlusIcon } from 'lucide-react';
import { createDialogOpenAtom } from '../atoms/dialog-atoms';

export const HabitNewButton = () => {
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
