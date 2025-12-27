'use client';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/utils/utils';

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  triggerClassName?: string;
  contentClassName?: string;
}

export function DatePicker({
  date,
  setDate,
  triggerClassName,
  contentClassName,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className={cn(
            'data-[empty=true]:text-muted-foreground justify-start text-left font-normal',
            triggerClassName
          )}
        >
          <CalendarIcon />
          <span className="truncate">
            {date ? format(date, 'PPP') : 'Pick a date'}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('w-auto p-0', contentClassName)}>
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </PopoverContent>
    </Popover>
  );
}
