'use client';

import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/utils/utils';
import { useAtom, useSetAtom } from 'jotai';
import { ArrowDownUpIcon, FilterIcon, PlusIcon } from 'lucide-react';
import { createDialogOpenAtom } from '../atoms/dialog-atoms';
import { sortByAtom, statusFilterAtom } from '../atoms/habit-atoms';

export const HabitListActions = () => {
  const [sortBy, setSortBy] = useAtom(sortByAtom);
  const [statusFilter, setStatusFilter] = useAtom(statusFilterAtom);
  const setCreateDialogOpen = useSetAtom(createDialogOpenAtom);

  const hasActiveFilters = statusFilter !== 'all';

  return (
    <ButtonGroup>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon-sm"
            variant="outline"
            tooltip="Filter habits"
            className={cn(
              'relative',
              hasActiveFilters && 'bg-foreground/20! text-foreground'
            )}
          >
            <FilterIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuCheckboxItem
            checked={statusFilter === 'all'}
            onCheckedChange={() => setStatusFilter('all')}
          >
            All habits
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={statusFilter === 'completed'}
            onCheckedChange={() => setStatusFilter('completed')}
          >
            Completed today
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={statusFilter === 'pending'}
            onCheckedChange={() => setStatusFilter('pending')}
          >
            Pending today
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon-sm" variant="outline" tooltip="Sort habits">
            <ArrowDownUpIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuCheckboxItem
            checked={sortBy === 'streak'}
            onCheckedChange={() => setSortBy('streak')}
          >
            Sort by streak
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={sortBy === 'title'}
            onCheckedChange={() => setSortBy('title')}
          >
            Sort by title
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        size="icon-sm"
        variant="outline"
        tooltip="Add new habit"
        onClick={() => setCreateDialogOpen(true)}
      >
        <PlusIcon />
      </Button>
    </ButtonGroup>
  );
};
