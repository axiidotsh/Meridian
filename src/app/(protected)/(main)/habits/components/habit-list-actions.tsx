'use client';

import { SearchBar } from '@/components/search-bar';
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
import type { FilterOption, SortOption } from '../atoms/habit-atoms';
import {
  searchQueryAtom,
  sortByAtom,
  statusFilterAtom,
} from '../atoms/habit-atoms';

interface HabitListActionsProps {
  isDashboard?: boolean;
}

const FilterDropdown = ({
  statusFilter,
  setStatusFilter,
  hasActiveFilters,
}: {
  statusFilter: FilterOption;
  setStatusFilter: (value: FilterOption) => void;
  hasActiveFilters: boolean;
}) => (
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
);

const SortDropdown = ({
  sortBy,
  setSortBy,
}: {
  sortBy: SortOption;
  setSortBy: (value: SortOption) => void;
}) => (
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
);

const AddHabitButton = ({
  setCreateDialogOpen,
}: {
  setCreateDialogOpen: (open: boolean) => void;
}) => (
  <Button
    size="icon-sm"
    variant="outline"
    tooltip="Add new habit"
    onClick={() => setCreateDialogOpen(true)}
  >
    <PlusIcon />
  </Button>
);

export const HabitListActions = ({
  isDashboard = false,
}: HabitListActionsProps = {}) => {
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [sortBy, setSortBy] = useAtom(sortByAtom);
  const [statusFilter, setStatusFilter] = useAtom(statusFilterAtom);
  const setCreateDialogOpen = useSetAtom(createDialogOpenAtom);

  const hasActiveFilters = statusFilter !== 'all';

  if (isDashboard) {
    return (
      <div className="flex w-full items-center gap-2">
        <SearchBar
          placeholder="Search habits..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={cn(
            'bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 w-full border shadow-xs sm:w-60',
            isDashboard && 'lg:w-full xl:w-60'
          )}
        />
        <ButtonGroup>
          <FilterDropdown
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            hasActiveFilters={hasActiveFilters}
          />
          <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
          <AddHabitButton setCreateDialogOpen={setCreateDialogOpen} />
        </ButtonGroup>
      </div>
    );
  }

  return (
    <ButtonGroup>
      <FilterDropdown
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        hasActiveFilters={hasActiveFilters}
      />
      <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
      <AddHabitButton setCreateDialogOpen={setCreateDialogOpen} />
    </ButtonGroup>
  );
};
