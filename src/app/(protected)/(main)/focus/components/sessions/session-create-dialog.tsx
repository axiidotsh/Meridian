'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { MAX_DURATION, MIN_DURATION } from '../../constants';
import { useFocusSession } from '../../hooks/mutations/use-focus-session';

interface SessionCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SessionCreateDialog = ({
  open,
  onOpenChange,
}: SessionCreateDialogProps) => {
  const { start } = useFocusSession();
  const router = useRouter();
  const [task, setTask] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');

  function handleCreate() {
    const duration = parseInt(durationMinutes, 10);
    if (isNaN(duration) || duration < MIN_DURATION || duration > MAX_DURATION)
      return;

    start.mutate(
      {
        json: {
          task: task || undefined,
          durationMinutes: duration,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setTask('');
          setDurationMinutes('');
          router.push('/focus');
        },
      }
    );
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            Start Custom Focus Session
          </ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Set a custom duration and task name for your focus session.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="task">Task (optional)</Label>
            <Input
              id="task"
              placeholder="What will you work on?"
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              min={MIN_DURATION}
              max={MAX_DURATION}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
            />
          </div>
        </div>
        <ResponsiveDialogFooter>
          <ResponsiveDialogClose asChild>
            <Button variant="outline" disabled={start.isPending}>
              Cancel
            </Button>
          </ResponsiveDialogClose>
          <Button
            onClick={handleCreate}
            disabled={start.isPending || durationMinutes.length === 0}
            isLoading={start.isPending}
            loadingContent="Starting..."
          >
            Start Session
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
