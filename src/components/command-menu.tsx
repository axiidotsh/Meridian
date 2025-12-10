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
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@/components/ui/popover';
import { signOut } from '@/lib/auth-client';
import {
  BrainIcon,
  CheckSquareIcon,
  ClockPlusIcon,
  GoalIcon,
  LayoutDashboardIcon,
  LayoutListIcon,
  LogOutIcon,
  MessageCirclePlusIcon,
  MonitorIcon,
  MoonIcon,
  PlusIcon,
  SunIcon,
  TimerIcon,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

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

const accountActions = [
  {
    name: 'Sign out',
    action: 'sign-out',
    icon: LogOutIcon,
  },
];

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { setTheme } = useTheme();

  const reset = useCallback((shouldBlur = true) => {
    setOpen(false);
    setValue('');
    if (shouldBlur) {
      inputRef.current?.blur();
    }
  }, []);

  useHotkeys(
    'mod+k',
    (e) => {
      e.preventDefault();
      setOpen((prev) => {
        if (!prev) inputRef.current?.focus();
        return !prev;
      });
    },
    { enableOnFormTags: true }
  );

  useHotkeys(
    'escape',
    () => {
      reset();
    },
    { enableOnFormTags: true }
  );

  const handleSelect = (callback: () => void) => {
    callback();
    reset();
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      reset();
    } else {
      setOpen(true);
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <Command
        className="bg-transparent **:data-[slot=command-input-wrapper]:flex-1 **:data-[slot=command-input-wrapper]:border-0 **:data-[slot=command-input-wrapper]:px-0"
        shouldFilter={true}
      >
        <PopoverAnchor asChild>
          <div className="flex w-full items-center">
            <CommandInput
              ref={inputRef}
              placeholder="Search for items and commands..."
              onFocus={() => setOpen(true)}
              value={value}
              onValueChange={setValue}
            />
            <Kbd>⌘K</Kbd>
          </div>
        </PopoverAnchor>
        <PopoverContent
          className="dark:bg-popover/70 bg-popover/50 w-(--radix-popover-trigger-width) p-0 shadow-lg backdrop-blur-xl backdrop-saturate-150"
          align="start"
          sideOffset={20}
          onOpenAutoFocus={(e) => e.preventDefault()}
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
            <CommandGroup heading="Account">
              {accountActions.map((action) => (
                <CommandItem
                  key={action.action}
                  value={action.name}
                  onSelect={() => {
                    handleSelect(() => {
                      if (action.action === 'sign-out') {
                        signOut();
                      }
                    });
                  }}
                >
                  <action.icon className="size-3.5" />
                  <span>{action.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </PopoverContent>
      </Command>
    </Popover>
  );
}
