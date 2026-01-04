import { cn } from '@/utils/utils';
import { formatDayLabel, getLast7Days, isToday } from '../utils/date-helpers';

export const WeekDayHeader = () => {
  const days = getLast7Days();

  return (
    <div className="flex gap-1">
      {days.map((day, index) => (
        <span
          key={index}
          className={cn(
            'text-muted-foreground w-3.5 text-center text-[9px] font-medium',
            isToday(day) && 'text-foreground font-semibold'
          )}
        >
          {formatDayLabel(day)}
        </span>
      ))}
    </div>
  );
};
