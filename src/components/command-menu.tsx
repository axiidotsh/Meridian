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
  CheckSquare,
  Clock,
  LayoutDashboard,
  ListTodo,
  MessageSquarePlus,
  Plus,
  Repeat,
  Timer,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const pages = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Tasks',
    href: '/tasks',
    icon: ListTodo,
  },
  {
    name: 'Habits',
    href: '/habits',
    icon: Repeat,
  },
  {
    name: 'Focus',
    href: '/focus',
    icon: Clock,
  },
  {
    name: 'Chat',
    href: '/chat',
    icon: MessageSquarePlus,
  },
];

const commands = [
  {
    name: 'Add new task',
    action: 'add-task',
    icon: Plus,
  },
  {
    name: 'Add new habit',
    action: 'add-habit',
    icon: CheckSquare,
  },
  {
    name: 'Start focus session',
    action: 'start-focus',
    icon: Timer,
  },
  {
    name: 'Create new chat',
    action: 'new-chat',
    icon: MessageSquarePlus,
  },
];

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

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
        onValueChange={setValue}
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
            'bg-popover absolute top-full right-0 left-0 z-50 mt-5 overflow-hidden rounded-md border shadow-md',
            open ? 'block' : 'hidden'
          )}
        >
          <CommandList>
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
                  <page.icon className="size-4" />
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
                  <command.icon className="size-4" />
                  <span>{command.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </div>
      </Command>
    </div>
  );
}
