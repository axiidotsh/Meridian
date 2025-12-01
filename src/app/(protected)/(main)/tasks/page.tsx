'use client';

import { PageHeading } from '@/components/page-heading';
import { Button } from '@/components/ui/button';
import { ChartConfig } from '@/components/ui/chart';
import { useAtomValue } from 'jotai';
import {
  CheckCircle2Icon,
  CircleDashed,
  ListTodoIcon,
  Settings2Icon,
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
import { type Task, TasksList } from './components/tasks-list';

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

  // Generate chart data for task completion over last 7 days
  const generateCompletionChartData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const chartData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Mock data for completion percentage per day
      const completionRate = Math.floor(Math.random() * 40) + 60; // 60-100%

      chartData.push({
        date: days[date.getDay()],
        completionRate,
      });
    }

    return chartData;
  };

  const chartData = generateCompletionChartData();

  const chartConfig = {
    completionRate: {
      label: 'Completion Rate',
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
            icon={ListTodoIcon}
            content={getTotalTasks().toString()}
            footer="This week"
          />
          <MetricCard
            title="Completed"
            icon={CheckCircle2Icon}
            content={getCompletedTasks().toString()}
            footer="This week"
          />
          <MetricCard
            title="Pending"
            icon={CircleDashed}
            content={getPendingTasks().toString()}
            footer="This week"
          />
          <MetricCard
            title="Completion Rate"
            icon={TrendingUpIcon}
            content="87%"
            footer="+5% from last week"
          />
        </div>
        <ContentCard
          title="Task List"
          action={<TaskListActions tasks={tasks} />}
        >
          <TasksList tasks={tasks} sortedTasks={sortedTasks} />
        </ContentCard>
        <GenericAreaChart
          title="Task Completion Trend"
          data={chartData}
          xAxisKey="date"
          yAxisKey="completionRate"
          chartConfig={chartConfig}
          color="#3b82f6"
          gradientId="taskCompletionGradient"
          yAxisFormatter={(value) => `${value}%`}
          tooltipFormatter={(value) => `${value}%`}
          yAxisDomain={[0, 100]}
        />
      </div>
    </div>
  );
}
