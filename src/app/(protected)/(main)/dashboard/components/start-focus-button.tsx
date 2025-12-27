'use client';

import { createCustomSessionAtom } from '@/app/(protected)/(main)/focus/atoms/session-dialogs';
import { Button } from '@/components/ui/button';
import { useAtom } from 'jotai';
import { Timer } from 'lucide-react';

export function StartFocusButton() {
  const [, setCreateCustomSessionOpen] = useAtom(createCustomSessionAtom);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setCreateCustomSessionOpen(true)}
      tooltip="Start new focus session"
    >
      <Timer />
    </Button>
  );
}
