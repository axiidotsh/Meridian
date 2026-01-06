import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/utils/utils';
import { CircularProgress } from './circular-progress';

interface TimerDisplayProps {
  progress: number;
  displayTime: string;
  isPaused: boolean;
  isCompleted: boolean;
}

export const TimerDisplay = ({
  progress,
  displayTime,
  isPaused,
  isCompleted,
}: TimerDisplayProps) => {
  const isMobile = useIsMobile();

  return (
    <CircularProgress
      size={isMobile ? 280 : 340}
      progress={progress}
      isPaused={isPaused}
      isCompleted={isCompleted}
    >
      <span
        className={cn(
          'font-mono text-4xl font-bold tabular-nums sm:text-6xl',
          isPaused && !isCompleted && 'animate-pulse'
        )}
      >
        {displayTime}
      </span>
    </CircularProgress>
  );
};
