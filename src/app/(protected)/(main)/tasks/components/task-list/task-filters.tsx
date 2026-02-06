'use client';

import { SortingMenu } from '@/components/sorting-menu';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/utils/utils';
import { useAtom } from 'jotai';
import { ArrowDownUpIcon, FilterIcon } from 'lucide-react';
import {
  selectedProjectsAtom,
  selectedTagsAtom,
  sortByAtom,
  sortOrderAtom,
} from '../../atoms/task-atoms';
import { useProjects } from '../../hooks/queries/use-projects';
import { useTaskTags } from '../../hooks/queries/use-task-tags';
import type { Project } from '../../hooks/types';
import { ProjectFilterMenu } from '../project-filter-menu';
import { TagFilterMenu } from '../tag-filter-menu';

export const TaskFilters = () => {
  const [selectedTags, setSelectedTags] = useAtom(selectedTagsAtom);
  const [selectedProjects, setSelectedProjects] = useAtom(selectedProjectsAtom);
  const [sortBy, setSortBy] = useAtom(sortByAtom);
  const [sortOrder, setSortOrder] = useAtom(sortOrderAtom);

  const { data: projects = [] } = useProjects() as {
    data: Project[] | undefined;
  };
  const { data: allTags = [] } = useTaskTags();

  const hasActiveFilters =
    selectedTags.length > 0 || selectedProjects.length > 0;
  const hasActiveSorting = sortBy !== 'dueDate' || sortOrder !== 'asc';

  return (
    <ButtonGroup>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon-sm"
            variant="outline"
            tooltip="Filter tasks"
            className={cn(
              hasActiveFilters &&
                'bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary dark:bg-primary/15 dark:hover:bg-primary/20'
            )}
          >
            <FilterIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <ProjectFilterMenu
            projects={projects}
            selectedProjects={selectedProjects}
            onToggleProject={(projectId) =>
              setSelectedProjects((prev) =>
                prev.includes(projectId)
                  ? prev.filter((p) => p !== projectId)
                  : [...prev, projectId]
              )
            }
            onClearFilters={() => setSelectedProjects([])}
          />
          <TagFilterMenu
            tags={allTags}
            selectedTags={selectedTags}
            onToggleTag={(tag) =>
              setSelectedTags((prev) =>
                prev.includes(tag)
                  ? prev.filter((t) => t !== tag)
                  : [...prev, tag]
              )
            }
            onClearFilters={() => setSelectedTags([])}
          />
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon-sm"
            variant="outline"
            tooltip="Sort tasks"
            className={cn(
              hasActiveSorting &&
                'bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary dark:bg-primary/15 dark:hover:bg-primary/20'
            )}
          >
            <ArrowDownUpIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <SortingMenu
            title="Due date"
            sortKey="dueDate"
            currentSortBy={sortBy}
            currentSortOrder={sortOrder}
            onChange={(by, order) => {
              setSortBy(by);
              setSortOrder(order);
            }}
            options={[
              { label: 'Earliest → Latest', order: 'asc' },
              { label: 'Latest → Earliest', order: 'desc' },
            ]}
          />
          <SortingMenu
            title="Priority"
            sortKey="priority"
            currentSortBy={sortBy}
            currentSortOrder={sortOrder}
            onChange={(by, order) => {
              setSortBy(by);
              setSortOrder(order);
            }}
            options={[
              { label: 'High → Low', order: 'asc' },
              { label: 'Low → High', order: 'desc' },
            ]}
          />
          <SortingMenu
            title="Created"
            sortKey="createdAt"
            currentSortBy={sortBy}
            currentSortOrder={sortOrder}
            onChange={(by, order) => {
              setSortBy(by);
              setSortOrder(order);
            }}
            options={[
              { label: 'Newest → Oldest', order: 'desc' },
              { label: 'Oldest → Newest', order: 'asc' },
            ]}
          />
          <SortingMenu
            title="Status"
            sortKey="completed"
            currentSortBy={sortBy}
            currentSortOrder={sortOrder}
            onChange={(by, order) => {
              setSortBy(by);
              setSortOrder(order);
            }}
            options={[
              { label: 'Incomplete first', order: 'asc' },
              { label: 'Complete first', order: 'desc' },
            ]}
          />
          <SortingMenu
            title="Title"
            sortKey="title"
            currentSortBy={sortBy}
            currentSortOrder={sortOrder}
            onChange={(by, order) => {
              setSortBy(by);
              setSortOrder(order);
            }}
            options={[
              { label: 'A → Z', order: 'asc' },
              { label: 'Z → A', order: 'desc' },
            ]}
          />
          {hasActiveSorting && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => {
                  setSortBy('dueDate');
                  setSortOrder('asc');
                }}
                className="justify-center"
              >
                Reset sorting
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
};
