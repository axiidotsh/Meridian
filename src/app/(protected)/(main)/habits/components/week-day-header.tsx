import { formatDayLabel } from '@/utils/date-format';
import { getLast7DaysUTC, isTodayUTC } from '@/utils/date-utc';
import { cn } from '@/utils/utils';

export const WeekDayHeader = () => {
  const days = getLast7DaysUTC();

  return (
    <div className="flex gap-1">
      {days.map((day, index) => (
        <span
          key={index}
          className={cn(
            'text-muted-foreground w-3.5 text-center text-[9px] font-medium',
            isTodayUTC(day) && 'text-foreground font-semibold'
          )}
        >
          {formatDayLabel(day)}
        </span>
      ))}
    </div>
  );
};
