import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAtom } from 'jotai';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import {
  customMinutesAtom,
  isCustomDurationAtom,
  selectedMinutesAtom,
} from '../../atoms/duration';
import { DURATION_PRESETS, MAX_DURATION, MIN_DURATION } from '../../constants';

function formatDurationLabel(minutes: number) {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
  return `${minutes}m`;
}

interface DurationDropdownProps {
  hasActiveSession: boolean;
}

export const DurationDropdown = ({
  hasActiveSession,
}: DurationDropdownProps) => {
  const [selectedMinutes, setSelectedMinutes] = useAtom(selectedMinutesAtom);
  const [customMinutes, setCustomMinutes] = useAtom(customMinutesAtom);
  const [isCustomDuration, setIsCustomDuration] = useAtom(isCustomDurationAtom);

  const handleSelectPreset = (minutes: number) => {
    setSelectedMinutes(minutes);
    setIsCustomDuration(false);
    setCustomMinutes('');
  };

  const handleCustomMinutesChange = (value: string) => {
    const numValue = value.replace(/\D/g, '');
    setCustomMinutes(numValue);
    if (numValue) {
      const mins = Math.min(
        Math.max(parseInt(numValue, 10), MIN_DURATION),
        MAX_DURATION
      );
      setSelectedMinutes(mins);
    }
  };

  const handleCustomMinutesSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customMinutes) {
      const mins = Math.min(
        Math.max(parseInt(customMinutes, 10), MIN_DURATION),
        MAX_DURATION
      );
      setSelectedMinutes(mins);
      setCustomMinutes(mins.toString());
    }
  };

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1"
                disabled={hasActiveSession}
              >
                {formatDurationLabel(selectedMinutes)}
                <ChevronDownIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
          </span>
        </TooltipTrigger>
        {hasActiveSession && (
          <TooltipContent>A session is active</TooltipContent>
        )}
      </Tooltip>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>Duration</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {DURATION_PRESETS.map((minutes) => (
          <DropdownMenuItem
            key={minutes}
            onClick={() => handleSelectPreset(minutes)}
          >
            <span className="flex-1">{formatDurationLabel(minutes)}</span>
            {selectedMinutes === minutes && !isCustomDuration && (
              <CheckIcon className="size-4" />
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <div>
          <Input
            placeholder="Custom (min)..."
            value={customMinutes}
            onChange={(e) => {
              setIsCustomDuration(true);
              handleCustomMinutesChange(e.target.value);
            }}
            onKeyDown={handleCustomMinutesSubmit}
            className="h-8 border-0 bg-transparent! ring-0!"
            type="text"
            inputMode="numeric"
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
