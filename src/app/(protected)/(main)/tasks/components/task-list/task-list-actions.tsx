'use client';

import { SearchBar } from '@/components/search-bar';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils/utils';
import { useAtom, useSetAtom } from 'jotai';
import {
  ArrowDownUpIcon,
  FilterIcon,
  FolderIcon,
  ListTodoIcon,
  PlusIcon,
  SparklesIcon,
} from 'lucide-react';
import {
  bulkAddTasksSheetAtom,
  createProjectDialogAtom,
  createTaskDialogAtom,
} from '../../atoms/task-dialogs';
import { useProjects } from '../../hooks/queries/use-projects';
import type { Project, Task } from '../../hooks/types';
import {
  projectSearchQueryAtom,
  searchQueryAtom,
  selectedProjectsAtom,
  selectedTagsAtom,
  sortByAtom,
  tagSearchQueryAtom,
} from '../task-atoms';

interface TaskListActionsProps {
  tasks: Task[];
}

export const TaskListActions = ({ tasks }: TaskListActionsProps) => {
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [selectedTags, setSelectedTags] = useAtom(selectedTagsAtom);
  const [selectedProjects, setSelectedProjects] = useAtom(selectedProjectsAtom);
  const [sortBy, setSortBy] = useAtom(sortByAtom);
  const [tagSearchQuery, setTagSearchQuery] = useAtom(tagSearchQueryAtom);
  const [projectSearchQuery, setProjectSearchQuery] = useAtom(
    projectSearchQueryAtom
  );
  const setCreateTaskDialog = useSetAtom(createTaskDialogAtom);
  const setCreateProjectDialog = useSetAtom(createProjectDialogAtom);
  const setBulkAddTasksSheet = useSetAtom(bulkAddTasksSheetAtom);

  const { data: projects = [] } = useProjects() as {
    data: Project[] | undefined;
  };

  const getAllTags = (): string[] => {
    const tagSet = new Set<string>();
    tasks.forEach((task) => {
      task.tags?.forEach((tag: string) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  };

  const getFilteredTags = (): string[] => {
    const allTags = getAllTags();
    if (!tagSearchQuery.trim()) return allTags;
    return allTags.filter((tag) =>
      tag.toLowerCase().includes(tagSearchQuery.toLowerCase())
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearTagFilters = () => {
    setSelectedTags([]);
  };

  const getFilteredProjects = () => {
    if (!projectSearchQuery.trim()) return projects;
    return projects.filter((project) =>
      project.name.toLowerCase().includes(projectSearchQuery.toLowerCase())
    );
  };

  const toggleProject = (projectId: string) => {
    setSelectedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((p) => p !== projectId)
        : [...prev, projectId]
    );
  };

  const clearProjectFilters = () => {
    setSelectedProjects([]);
  };

  const hasActiveFilters =
    selectedTags.length > 0 || selectedProjects.length > 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <SearchBar
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 mr-1 w-[200px] border shadow-xs focus:w-[250px]"
          expandOnFocus
        />
        <ButtonGroup>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon-sm"
                variant="outline"
                tooltip="Filter tasks"
                className={cn(
                  'relative',
                  hasActiveFilters && 'bg-foreground/20! text-foreground'
                )}
              >
                <FilterIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  Filter by projects
                  {selectedProjects.length > 0 && (
                    <span className="bg-primary text-primary-foreground ml-auto flex size-5 items-center justify-center rounded-full text-xs">
                      {selectedProjects.length}
                    </span>
                  )}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-56">
                  <div className="p-2">
                    <Input
                      type="text"
                      placeholder="Search projects..."
                      value={projectSearchQuery}
                      onChange={(e) => setProjectSearchQuery(e.target.value)}
                      className="h-8"
                    />
                  </div>
                  <DropdownMenuSeparator />
                  <div className="max-h-[200px] overflow-y-auto">
                    {getFilteredProjects().length === 0 ? (
                      <div className="text-muted-foreground px-2 py-6 text-center text-sm">
                        No projects found
                      </div>
                    ) : (
                      getFilteredProjects().map((project) => (
                        <DropdownMenuCheckboxItem
                          key={project.id}
                          checked={selectedProjects.includes(project.id)}
                          onCheckedChange={() => toggleProject(project.id)}
                        >
                          {project.name}
                        </DropdownMenuCheckboxItem>
                      ))
                    )}
                  </div>
                  {selectedProjects.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onSelect={clearProjectFilters}
                        className="justify-center"
                      >
                        Clear filters
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  Filter by tags
                  {selectedTags.length > 0 && (
                    <span className="bg-primary text-primary-foreground ml-auto flex size-5 items-center justify-center rounded-full text-xs">
                      {selectedTags.length}
                    </span>
                  )}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-56">
                  <div className="p-2">
                    <Input
                      type="text"
                      placeholder="Search tags..."
                      value={tagSearchQuery}
                      onChange={(e) => setTagSearchQuery(e.target.value)}
                      className="h-8"
                    />
                  </div>
                  <DropdownMenuSeparator />
                  <div className="max-h-[200px] overflow-y-auto">
                    {getFilteredTags().length === 0 ? (
                      <div className="text-muted-foreground px-2 py-6 text-center text-sm">
                        No tags found
                      </div>
                    ) : (
                      getFilteredTags().map((tag) => (
                        <DropdownMenuCheckboxItem
                          key={tag}
                          checked={selectedTags.includes(tag)}
                          onCheckedChange={() => toggleTag(tag)}
                        >
                          {tag}
                        </DropdownMenuCheckboxItem>
                      ))
                    )}
                  </div>
                  {selectedTags.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onSelect={clearTagFilters}
                        className="justify-center"
                      >
                        Clear filters
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon-sm" variant="outline" tooltip="Sort tasks">
                <ArrowDownUpIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={sortBy === 'dueDate'}
                onCheckedChange={() => setSortBy('dueDate')}
              >
                Sort by due date
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortBy === 'priority'}
                onCheckedChange={() => setSortBy('priority')}
              >
                Sort by priority
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortBy === 'title'}
                onCheckedChange={() => setSortBy('title')}
              >
                Sort by title
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={sortBy === 'completed'}
                onCheckedChange={() => setSortBy('completed')}
              >
                Sort by status
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon-sm" variant="outline" tooltip="Create new...">
                <PlusIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setCreateTaskDialog(true)}>
                <ListTodoIcon />
                Add a Task
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setBulkAddTasksSheet(true)}>
                <SparklesIcon />
                Bulk Add Tasks
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setCreateProjectDialog(true)}>
                <FolderIcon />
                Add a Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
      </div>
    </div>
  );
};
