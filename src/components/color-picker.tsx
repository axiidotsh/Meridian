'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useForwardedRef } from '@/hooks/use-forwarded-ref';
import { cn } from '@/utils/utils';
import { forwardRef, useMemo, useState } from 'react';
import { HexColorPicker } from 'react-colorful';

const PRESET_COLORS = [
  '#3b82f6',
  '#22c55e',
  '#a855f7',
  '#f97316',
  '#14b8a6',
  '#ec4899',
  '#facc15',
  '#ef4444',
] as const;

interface ColorPickerProps {
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  presetColors?: readonly string[];
  disabled?: boolean;
  name?: string;
  className?: string;
}

const ColorPicker = forwardRef<HTMLInputElement, ColorPickerProps>(
  (
    {
      disabled,
      presetColors = PRESET_COLORS,
      value,
      onChange,
      onBlur,
      name,
      className,
    },
    forwardedRef
  ) => {
    const ref = useForwardedRef(forwardedRef);
    const [open, setOpen] = useState(false);

    const parsedValue = useMemo(() => {
      return value || '#FFFFFF';
    }, [value]);

    return (
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild disabled={disabled} onBlur={onBlur}>
          <Button
            className={cn(className)}
            name={name}
            onClick={() => {
              setOpen(true);
            }}
            style={{
              backgroundColor: parsedValue,
            }}
          >
            <div />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full" align="end">
          <div className="space-y-3">
            <HexColorPicker
              color={parsedValue}
              onChange={onChange}
              className="w-full!"
            />
            <Input
              maxLength={7}
              onChange={(e) => {
                onChange(e?.currentTarget?.value);
              }}
              ref={ref}
              value={parsedValue}
            />
            <div className="space-y-1.5">
              <p className="text-muted-foreground text-xs font-medium">
                Presets
              </p>
              <div className="flex flex-wrap gap-1.5">
                {presetColors.map((presetColor) => (
                  <Button
                    key={presetColor}
                    size="icon"
                    className="size-6 rounded!"
                    style={{ backgroundColor: presetColor }}
                    onClick={() => onChange(presetColor)}
                  />
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);
ColorPicker.displayName = 'ColorPicker';

export { ColorPicker };
