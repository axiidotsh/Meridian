'use client';

import { useActiveSession } from '@/app/(protected)/(main)/focus/hooks/use-active-session';
import { useFocusSession } from '@/app/(protected)/(main)/focus/hooks/use-focus-session';
import { useTimerLogic } from '@/app/(protected)/(main)/focus/hooks/use-timer-logic';
import { formatTime } from '@/app/(protected)/(main)/focus/utils/timer-calculations';
import { SessionDialogs } from '@/components/session-dialogs';
import { cn } from '@/utils/utils';
import {
  CheckIcon,
  PauseIcon,
  PlayIcon,
  SquareIcon,
  TimerIcon,
  XIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function FocusTimerWidget() {
  const { data: session, isLoading } = useActiveSession();
  const {
    pauseSession,
    resumeSession,
    cancelSession,
    completeSession,
    endSessionEarly,
  } = useFocusSession();
  const { remainingSeconds } = useTimerLogic(session);

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [showEndEarlyDialog, setShowEndEarlyDialog] = useState(false);

  if (isLoading || !session) {
    return null;
  }

  const isPaused = session.status === 'PAUSED';
  const isOvertime = remainingSeconds <= 0;
  const totalSeconds = session.durationMinutes * 60;
  const elapsedSeconds = totalSeconds - remainingSeconds;
  const progress = Math.min(100, (elapsedSeconds / totalSeconds) * 100);

  const handlePauseResume = () => {
    if (isPaused) {
      resumeSession.mutate({ param: { id: session.id } });
    } else {
      pauseSession.mutate({ param: { id: session.id } });
    }
  };

  const handleCancel = () => {
    cancelSession.mutate({ param: { id: session.id } });
    setShowCancelDialog(false);
  };

  const handleEndEarly = () => {
    endSessionEarly.mutate({ param: { id: session.id } });
    setShowEndEarlyDialog(false);
  };

  const handleComplete = () => {
    completeSession.mutate({ param: { id: session.id } });
  };

  const handleDiscard = () => {
    cancelSession.mutate({ param: { id: session.id } });
    setShowDiscardDialog(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            'relative flex h-8 items-center gap-2 overflow-hidden rounded-md border px-2 font-mono text-sm font-medium transition-colors',
            'hover:bg-accent focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
            isPaused && 'animate-pulse border-amber-500/50',
            isOvertime &&
              'border-green-500/50 text-green-600 dark:text-green-500'
          )}
        >
          <div
            className={cn(
              'absolute inset-0 origin-left transition-transform duration-1000',
              isPaused ? 'bg-amber-500/40' : 'bg-green-500/40',
              isOvertime && 'bg-green-500/20'
            )}
            style={{ transform: `scaleX(${progress / 100})` }}
          />
          <TimerIcon className="relative size-4" />
          <span className="relative">{formatTime(remainingSeconds)}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Link href="/focus" className="cursor-pointer">
              <TimerIcon />
              Go to Focus
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {isOvertime ? (
            <>
              <DropdownMenuItem
                onClick={handleComplete}
                disabled={completeSession.isPending}
              >
                <CheckIcon />
                Save Session
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setShowDiscardDialog(true)}
              >
                <XIcon />
                Discard Session
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem
                onClick={handlePauseResume}
                disabled={pauseSession.isPending || resumeSession.isPending}
              >
                {isPaused ? (
                  <>
                    <PlayIcon />
                    Resume
                  </>
                ) : (
                  <>
                    <PauseIcon />
                    Pause
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowEndEarlyDialog(true)}>
                <SquareIcon />
                End Session
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setShowCancelDialog(true)}
              >
                <XIcon />
                Cancel Session
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <SessionDialogs
        dialogs={{
          showCancel: showCancelDialog,
          showEndEarly: showEndEarlyDialog,
          showDiscard: showDiscardDialog,
        }}
        onOpenChange={(dialog, open) => {
          if (dialog === 'cancel') setShowCancelDialog(open);
          if (dialog === 'endEarly') setShowEndEarlyDialog(open);
          if (dialog === 'discard') setShowDiscardDialog(open);
        }}
        handlers={{
          onCancel: handleCancel,
          onEndEarly: handleEndEarly,
          onDiscard: handleDiscard,
        }}
        isPending={{
          cancel: cancelSession.isPending,
          endEarly: endSessionEarly.isPending,
        }}
      />
    </>
  );
}
