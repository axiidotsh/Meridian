'use client';

import { PageHeading } from '@/components/page-heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChartConfig } from '@/components/ui/chart';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAtomValue } from 'jotai';
import {
  CheckCircle2Icon,
  ClipboardCheckIcon,
  EllipsisIcon,
  ListChecksIcon,
  PencilIcon,
  Settings2Icon,
  Trash2Icon,
  TrendingUpIcon,
} from 'lucide-react';
import { useState } from 'react';
import { ContentCard } from '../components/content-card';
import { GenericAreaChart } from '../components/generic-area-chart';
import { MetricCard } from '../components/metric-card';
import type { SortOption } from './components/task-atoms';
import {
  searchQueryAtom,
  selectedTagsAtom,
  sortByAtom,
} from './components/task-atoms';
import { TaskListActions } from './components/task-list-actions';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  tags?: string[];
}

const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Review pull requests and merge updates',
    completed: false,
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    priority: 'high',
    tags: ['development', 'code-review'],
  },
  {
    id: '2',
    title: 'Design new dashboard components',
    completed: false,
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    priority: 'medium',
    tags: ['design', 'ui'],
  },
  {
    id: '3',
    title: 'Update project documentation',
    completed: true,
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    priority: 'low',
    tags: ['documentation'],
  },
  {
    id: '4',
    title: 'Fix authentication bug in production',
    completed: false,
    priority: 'high',
    tags: ['bug', 'urgent'],
  },
  {
    id: '5',
    title: 'Implement dark mode toggle',
    completed: false,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    priority: 'medium',
    tags: ['feature', 'ui'],
  },
  {
    id: '6',
    title: 'Optimize database queries',
    completed: true,
    priority: 'high',
    tags: ['performance', 'database'],
  },
  {
    id: '7',
    title: 'Setup CI/CD pipeline',
    completed: false,
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    priority: 'medium',
    tags: ['devops'],
  },
  {
    id: '8',
    title: 'Write unit tests for new features',
    completed: false,
    priority: 'low',
    tags: ['testing'],
  },
  {
    id: '9',
    title: 'Refactor API endpoints for better performance',
    completed: false,
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    priority: 'high',
    tags: ['development', 'performance'],
  },
  {
    id: '10',
    title: 'Update dependencies to latest versions',
    completed: false,
    dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    priority: 'low',
    tags: ['development'],
  },
  {
    id: '11',
    title: 'Create user onboarding flow',
    completed: false,
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    priority: 'medium',
    tags: ['design', 'feature', 'ui'],
  },
  {
    id: '12',
    title: 'Fix mobile responsiveness issues',
    completed: false,
    priority: 'high',
    tags: ['bug', 'ui'],
  },
  {
    id: '13',
    title: 'Implement data export functionality',
    completed: false,
    dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    priority: 'medium',
    tags: ['feature', 'development'],
  },
  {
    id: '14',
    title: 'Add logging and monitoring',
    completed: true,
    priority: 'high',
    tags: ['devops'],
  },
  {
    id: '15',
    title: 'Research new UI framework options',
    completed: false,
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    priority: 'low',
    tags: ['design', 'ui'],
  },
  {
    id: '16',
    title: 'Configure automated backups',
    completed: false,
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    priority: 'high',
    tags: ['devops', 'database', 'urgent'],
  },
  {
    id: '17',
    title: 'Write integration tests',
    completed: false,
    priority: 'medium',
    tags: ['testing', 'development'],
  },
  {
    id: '18',
    title: 'Update API documentation',
    completed: true,
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    priority: 'low',
    tags: ['documentation'],
  },
  {
    id: '19',
    title: 'Implement webhook support',
    completed: false,
    dueDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
    priority: 'medium',
    tags: ['feature', 'development'],
  },
  {
    id: '20',
    title: 'Fix memory leak in worker processes',
    completed: false,
    priority: 'high',
    tags: ['bug', 'performance', 'urgent'],
  },
  {
    id: '21',
    title: 'Add email notification system',
    completed: false,
    dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    priority: 'medium',
    tags: ['feature', 'development'],
  },
  {
    id: '22',
    title: 'Conduct security audit',
    completed: false,
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    priority: 'high',
    tags: ['devops', 'urgent'],
  },
  {
    id: '23',
    title: 'Create admin dashboard',
    completed: false,
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    priority: 'medium',
    tags: ['feature', 'ui', 'design'],
  },
  {
    id: '24',
    title: 'Optimize image loading',
    completed: true,
    priority: 'medium',
    tags: ['performance', 'ui'],
  },
  {
    id: '25',
    title: 'Add search functionality',
    completed: false,
    dueDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
    priority: 'high',
    tags: ['feature', 'development'],
  },
];

export default function TasksPage() {
  const [tasks] = useState<Task[]>(MOCK_TASKS);
  const sortBy = useAtomValue(sortByAtom);
  const searchQuery = useAtomValue(searchQueryAtom);
  const selectedTags = useAtomValue(selectedTagsAtom);

  const getTotalTasks = () => tasks.length;
  const getCompletedTasks = () => tasks.filter((t) => t.completed).length;
  const getPendingTasks = () => tasks.filter((t) => !t.completed).length;
  const getCompletionRate = () => {
    if (tasks.length === 0) return '0%';
    return `${Math.round((getCompletedTasks() / getTotalTasks()) * 100)}%`;
  };

  const filterTasks = (
    tasks: Task[],
    query: string,
    tagFilters: string[]
  ): Task[] => {
    let filtered = tasks;

    // Filter by search query
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter((task) => {
        const titleMatch = task.title.toLowerCase().includes(lowerQuery);
        const tagsMatch = task.tags?.some((tag) =>
          tag.toLowerCase().includes(lowerQuery)
        );
        return titleMatch || tagsMatch;
      });
    }

    // Filter by selected tags
    if (tagFilters.length > 0) {
      filtered = filtered.filter((task) =>
        tagFilters.some((tag) => task.tags?.includes(tag))
      );
    }

    return filtered;
  };

  const sortTasks = (tasks: Task[], sortBy: SortOption): Task[] => {
    return [...tasks].sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.getTime() - b.dueDate.getTime();
        case 'priority': {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        case 'title':
          return a.title.localeCompare(b.title);
        case 'completed':
          return a.completed === b.completed ? 0 : a.completed ? 1 : -1;
        default:
          return 0;
      }
    });
  };

  const filteredTasks = filterTasks(tasks, searchQuery, selectedTags);
  const sortedTasks = sortTasks(filteredTasks, sortBy);

  const formatDueDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(date);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else if (diffDays <= 7) {
      return `Due in ${diffDays} days`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const isOverdue = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(date);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  // Generate chart data for task completion over last 7 days
  const generateCompletionChartData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const chartData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Mock data for completed tasks per day
      const completed = Math.floor(Math.random() * 5) + 1;

      chartData.push({
        date: days[date.getDay()],
        completed,
      });
    }

    return chartData;
  };

  const chartData = generateCompletionChartData();

  const chartConfig = {
    completed: {
      label: 'Completed Tasks',
      color: '#3b82f6',
    },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between gap-2">
        <PageHeading>Tasks</PageHeading>
        <Button
          size="icon-sm"
          variant="ghost"
          tooltip="Configure dashboard cards"
        >
          <Settings2Icon />
        </Button>
      </div>
      <div className="mt-4 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Tasks"
            icon={ClipboardCheckIcon}
            content={getTotalTasks().toString()}
            footer="+2 from last week"
          />
          <MetricCard
            title="Completed"
            icon={CheckCircle2Icon}
            content={getCompletedTasks().toString()}
            footer={`${getCompletionRate()} completion rate`}
          />
          <MetricCard
            title="Pending"
            icon={ListChecksIcon}
            content={getPendingTasks().toString()}
            footer="3 due this week"
          />
          <MetricCard
            title="Productivity Score"
            icon={TrendingUpIcon}
            content="87%"
            footer="+5% from last week"
          />
        </div>
        <ContentCard
          title="Task List"
          action={<TaskListActions tasks={tasks} />}
        >
          <ScrollArea className="my-4 h-[600px]">
            {tasks.length === 0 ? (
              <div className="text-muted-foreground flex h-[600px] flex-col items-center justify-center gap-2 text-center">
                <ClipboardCheckIcon className="size-12 opacity-20" />
                <p className="text-sm font-medium">No tasks yet</p>
                <p className="text-xs">Create your first task to get started</p>
              </div>
            ) : sortedTasks.length === 0 ? (
              <div className="text-muted-foreground flex h-[600px] flex-col items-center justify-center gap-2 text-center">
                <ListChecksIcon className="size-12 opacity-20" />
                <p className="text-sm font-medium">No tasks found</p>
                <p className="text-xs">Try adjusting your search or filters</p>
              </div>
            ) : (
              <ul className="space-y-3 pr-4">
                {sortedTasks.map((task) => (
                  <li
                    key={task.id}
                    className="border-border flex items-start gap-3 border-b pb-3 last:border-0 last:pb-0"
                  >
                    <Checkbox
                      checked={task.completed}
                      className="mt-0.5"
                      aria-label={`Mark task "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
                    />
                    <div className="flex-1">
                      <p
                        className={`text-sm ${task.completed ? 'text-muted-foreground line-through' : ''}`}
                      >
                        {task.title}
                      </p>
                      {(task.dueDate || task.tags) && (
                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                          {task.dueDate && (
                            <span
                              className={`font-mono text-xs ${
                                isOverdue(task.dueDate) && !task.completed
                                  ? 'text-destructive'
                                  : 'text-muted-foreground'
                              }`}
                            >
                              {formatDueDate(task.dueDate)}
                            </span>
                          )}
                          {task.tags?.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="h-5 text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          className="shrink-0"
                          aria-label="Task options"
                        >
                          <EllipsisIcon />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <PencilIcon />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive">
                          <Trash2Icon />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </ContentCard>
        <GenericAreaChart
          title="Task Completion Trend"
          data={chartData}
          xAxisKey="date"
          yAxisKey="completed"
          chartConfig={chartConfig}
          color="#3b82f6"
          gradientId="taskCompletionGradient"
          tooltipFormatter={(value) => `${value} tasks`}
        />
      </div>
    </div>
  );
}
