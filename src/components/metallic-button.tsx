import * as React from 'react';

import { cn } from '@/utils/utils';
import { Button } from './ui/button';

export const MetallicButton = ({
  className,
  ...props
}: React.ComponentProps<typeof Button>) => {
  return (
    <Button
      className={cn(
        'border border-zinc-500/50 bg-linear-to-b from-zinc-500 via-zinc-700 to-zinc-800 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),inset_0_-1px_2px_0_rgba(0,0,0,0.2),0_2px_6px_0_rgba(0,0,0,0.15)] hover:from-zinc-400 hover:via-zinc-600 hover:to-zinc-700 dark:border-0 dark:from-zinc-500 dark:via-zinc-700 dark:to-zinc-800 dark:text-zinc-100 dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_2px_6px_0_rgba(0,0,0,0.5)] dark:hover:from-zinc-400 dark:hover:via-zinc-600 dark:hover:to-zinc-700',
        className
      )}
      {...props}
    />
  );
};
