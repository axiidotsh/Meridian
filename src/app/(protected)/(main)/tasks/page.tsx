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
  selectedProjectsAtom,
  selectedTagsAtom,
  sortByAtom,
} from './components/task-atoms';
import { TaskListActions } from './components/task-list-actions';
import { type Task, TasksList } from './components/tasks-list';

const MOCK_TASKS: Task[] = [
  // Overdue tasks (2)
  {
    id: '1',
    title: 'Update API documentation',
    completed: false,
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    priority: 'high',
    tags: ['documentation', 'urgent'],
    projectId: '2',
    projectName: 'Backend Infrastructure',
  },
  {
    id: '2',
    title: 'Submit expense reports',
    completed: false,
    priority: 'medium',
    tags: ['personal', 'admin'],
  },
  // Due today (3)
  {
    id: '3',
    title: 'Complete code review for authentication module',
    completed: false,
    dueDate: new Date(),
    priority: 'high',
    tags: ['code-review', 'urgent'],
    projectId: '2',
    projectName: 'Backend Infrastructure',
  },
  {
    id: '4',
    title: 'Deploy hotfix to production',
    completed: false,
    dueDate: new Date(),
    priority: 'high',
  },
  {
    id: '5',
    title: 'Review design mockups with team',
    completed: false,
    priority: 'medium',
    projectId: '1',
    projectName: 'Website Redesign',
  },
  // Due this week (3)
  {
    id: '6',
    title: 'Setup CI/CD pipeline',
    completed: false,
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    priority: 'high',
    projectId: '4',
    projectName: 'DevOps & Automation',
  },
  {
    id: '7',
    title: 'Implement dark mode toggle',
    completed: false,
    priority: 'medium',
    tags: ['feature', 'ui'],
  },
  {
    id: '8',
    title: 'Write unit tests for new features',
    completed: false,
    priority: 'low',
  },
  // Upcoming (2)
  {
    id: '9',
    title: 'Create user onboarding flow',
    completed: false,
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    priority: 'medium',
    tags: ['design', 'feature', 'ui'],
    projectId: '3',
    projectName: 'Mobile App',
  },
  {
    id: '10',
    title: 'Research new UI framework options',
    completed: false,
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    priority: 'low',
    tags: ['research', 'ui'],
  },
];

export default function TasksPage() {
  const [tasks] = useState<Task[]>(MOCK_TASKS);
  const sortBy = useAtomValue(sortByAtom);
  const searchQuery = useAtomValue(searchQueryAtom);
  const selectedTags = useAtomValue(selectedTagsAtom);
  const selectedProjects = useAtomValue(selectedProjectsAtom);

  const getTotalTasks = () => tasks.length;
  const getCompletedTasks = () => tasks.filter((t) => t.completed).length;
  const getPendingTasks = () => tasks.filter((t) => !t.completed).length;

  const filterTasks = (
    tasks: Task[],
    query: string,
    tagFilters: string[],
    projectFilters: string[]
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
        const projectMatch = task.projectName
          ?.toLowerCase()
          .includes(lowerQuery);
        return titleMatch || tagsMatch || projectMatch;
      });
    }

    // Filter by selected tags
    if (tagFilters.length > 0) {
      filtered = filtered.filter((task) =>
        tagFilters.some((tag) => task.tags?.includes(tag))
      );
    }

    // Filter by selected projects
    if (projectFilters.length > 0) {
      filtered = filtered.filter((task) =>
        task.projectId ? projectFilters.includes(task.projectId) : false
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

  const filteredTasks = filterTasks(
    tasks,
    searchQuery,
    selectedTags,
    selectedProjects
  );
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
