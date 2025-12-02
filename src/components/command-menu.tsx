'use client';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Kbd } from '@/components/ui/kbd';
import { cn } from '@/utils/utils';
import {
  BrainIcon,
  CheckSquareIcon,
  ClockPlusIcon,
  GoalIcon,
  LayoutDashboardIcon,
  LayoutListIcon,
  MessageCirclePlusIcon,
  MonitorIcon,
  MoonIcon,
  PlusIcon,
  SunIcon,
  TimerIcon,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const pages = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboardIcon,
  },
  {
    name: 'Chat',
    href: '/chat',
    icon: BrainIcon,
  },
  {
    name: 'Focus',
    href: '/focus',
    icon: ClockPlusIcon,
  },
  {
    name: 'Tasks',
    href: '/tasks',
    icon: LayoutListIcon,
  },
  {
    name: 'Habits',
    href: '/habits',
    icon: GoalIcon,
  },
];

const commands = [
  {
    name: 'Add new task',
    action: 'add-task',
    icon: PlusIcon,
  },
  {
    name: 'Add new habit',
    action: 'add-habit',
    icon: CheckSquareIcon,
  },
  {
    name: 'Start focus session',
    action: 'start-focus',
    icon: TimerIcon,
  },
  {
    name: 'Create new chat',
    action: 'new-chat',
    icon: MessageCirclePlusIcon,
  },
];

const themes = [
  {
    name: 'Light',
    value: 'light',
    icon: SunIcon,
  },
  {
    name: 'Dark',
    value: 'dark',
    icon: MoonIcon,
  },
  {
    name: 'System',
    value: 'system',
    icon: MonitorIcon,
  },
];

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { setTheme } = useTheme();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }

      // Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setOpen((prev) => !prev);
        inputRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelect = (callback: () => void) => {
    callback();
    setOpen(false);
    setValue('');
  };

  return (
    <div ref={containerRef} className="relative flex w-full items-center">
      <Command
        className="bg-transparent **:data-[slot=command-input-wrapper]:flex-1 **:data-[slot=command-input-wrapper]:border-0 **:data-[slot=command-input-wrapper]:px-0"
        shouldFilter={true}
        value={value}
        onValueChange={(newValue) => {
          setValue(newValue);
          setOpen(true);
        }}
      >
        <div className="flex w-full items-center">
          <CommandInput
            ref={inputRef}
            placeholder="Search for items and commands..."
            onFocus={() => setOpen(true)}
          />
          <Kbd>⌘K</Kbd>
        </div>
        <div
          className={cn(
            'bg-popover absolute inset-x-0 top-full z-50 mt-5 overflow-hidden rounded-md border shadow-lg saturate-150 backdrop-blur-3xl',
            open ? 'block' : 'hidden'
          )}
        >
          <CommandList className="max-h-96">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Pages">
              {pages.map((page) => (
                <CommandItem
                  key={page.href}
                  value={page.name}
                  onSelect={() => {
                    handleSelect(() => {
                      router.push(page.href);
                    });
                  }}
                >
                  <page.icon className="size-3.5" />
                  <span>{page.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Commands">
              {commands.map((command) => (
                <CommandItem
                  key={command.action}
                  value={command.name}
                  onSelect={() => {
                    handleSelect(() => {
                      // TODO: Execute command
                      console.log('Execute:', command.action);
                    });
                  }}
                >
                  <command.icon className="size-3.5" />
                  <span>{command.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Theme">
              {themes.map((theme) => (
                <CommandItem
                  key={theme.value}
                  value={`theme ${theme.name}`}
                  onSelect={() => {
                    handleSelect(() => {
                      setTheme(theme.value);
                    });
                  }}
                >
                  <theme.icon className="size-3.5" />
                  <span>{theme.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </div>
      </Command>
    </div>
  );
}
