import {
  CheckCircleIcon,
  GitGraphIcon,
  TrendingUpIcon,
  TrophyIcon,
} from 'lucide-react';
import { DashboardCard } from './dashboard-card';

const dashboardMetrics = [
  {
    title: 'Efficiency',
    icon: TrendingUpIcon,
    content: '90%',
    footer: '+4% from yesterday',
  },
  {
    title: 'Tasks',
    icon: CheckCircleIcon,
    content: '1/6',
    footer: 'Personal Best: 3/6',
  },
  {
    title: 'Habits',
    icon: GitGraphIcon,
    content: '4/6',
    footer: 'Personal Best: 12/12',
  },
  {
    title: 'Streak',
    icon: TrophyIcon,
    content: '12 days',
    footer: 'Personal Best: 15 days',
  },
];

export default function Dashboard() {
  return (
    <div className="flex flex-col">
      <h1 className="text-muted-foreground font-mono text-sm">Dashboard</h1>
      <div className="mt-4 grid grid-cols-4 gap-4">
        {dashboardMetrics.map((metric) => (
          <DashboardCard key={metric.title} {...metric} />
        ))}
      </div>
    </div>
  );
}
