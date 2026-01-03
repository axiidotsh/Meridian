'use client';

import { settingsAtom } from '@/atoms/settings-atoms';
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
import { cn } from '@/utils/utils';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { toast } from 'sonner';
import { customDurationSettingsDialogAtom } from '../../atoms/session-dialogs';
import { MAX_DURATION, MIN_DURATION } from '../../constants';

export const CustomDurationSettingsDialog = () => {
  const [open, setOpen] = useAtom(customDurationSettingsDialogAtom);
  const [settings, setSettings] = useAtom(settingsAtom);
  const [durationMinutes, setDurationMinutes] = useState(
    settings.defaultFocusDuration.toString()
  );
  const [error, setError] = useState('');

  function handleDurationChange(value: string) {
    setDurationMinutes(value);

    const numValue = parseInt(value, 10);

    if (!value || isNaN(numValue)) {
      setError('');
      return;
    }

    if (numValue < MIN_DURATION) {
      setError(`Duration must be at least ${MIN_DURATION} minute`);
      return;
    }

    if (numValue > MAX_DURATION) {
      setError(`Duration cannot exceed ${MAX_DURATION / 60} hours`);
      return;
    }

    setError('');
  }

  function handleSave() {
    const duration = parseInt(durationMinutes, 10);
    if (isNaN(duration) || duration < MIN_DURATION || duration > MAX_DURATION)
      return;

    setSettings((prev) => ({
      ...prev,
      defaultFocusDuration: duration,
    }));

    const displayValue =
      duration >= 60
        ? `${duration / 60} hour${duration > 60 ? 's' : ''}`
        : `${duration} minutes`;
    toast.success(`Default focus duration set to ${displayValue}`);

    setOpen(false);
  }

  function handleOpenChange(newOpen: boolean) {
    if (!newOpen) {
      setDurationMinutes(settings.defaultFocusDuration.toString());
      setError('');
    }
    setOpen(newOpen);
  }

  const isValid =
    durationMinutes.length > 0 &&
    !error &&
    !isNaN(parseInt(durationMinutes, 10));

  return (
    <ResponsiveDialog open={open} onOpenChange={handleOpenChange}>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Set Custom Duration</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Enter a custom default duration for focus sessions.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <div className="space-y-2 py-4">
          <Label htmlFor="custom-duration">Duration (minutes)</Label>
          <Input
            id="custom-duration"
            placeholder="45"
            inputMode="numeric"
            type="number"
            min={MIN_DURATION}
            max={MAX_DURATION}
            value={durationMinutes}
            onChange={(e) => handleDurationChange(e.target.value)}
            className={cn(error && 'border-destructive')}
          />
          {error && <p className="text-destructive text-sm">{error}</p>}
          <p className="text-muted-foreground text-xs">
            Range: {MIN_DURATION} - {MAX_DURATION} minutes ({MIN_DURATION} min -{' '}
            {MAX_DURATION / 60} hours)
          </p>
        </div>
        <ResponsiveDialogFooter>
          <ResponsiveDialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </ResponsiveDialogClose>
          <Button onClick={handleSave} disabled={!isValid}>
            Save
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
