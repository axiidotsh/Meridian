import { MetricCard } from '@/app/(protected)/(main)/components/metric-card';
import { CheckCircle2, Clock, Flame, Target } from 'lucide-react';
import type { DashboardMetrics as DashboardMetricsType } from '../hooks/types';

interface DashboardMetricsProps {
  metrics: DashboardMetricsType;
}

export function DashboardMetrics({ metrics }: DashboardMetricsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Focus"
        icon={Clock}
        content={formatMinutesToTime(metrics.focus.todayMinutes)}
        footer={metrics.focus.timeDiffLabel}
      />

      <MetricCard
        title="Tasks"
        icon={CheckCircle2}
        content={`${metrics.tasks.completedToday}/${metrics.tasks.totalToday}`}
        footer={
          metrics.tasks.overdue > 0
            ? `${metrics.tasks.overdue} overdue`
            : metrics.tasks.comparisonLabel
        }
      />

      <MetricCard
        title="Habits"
        icon={Target}
        content={`${metrics.habits.completedToday}/${metrics.habits.totalActive}`}
        footer={metrics.habits.comparisonLabel}
      />

      <MetricCard
        title="Overall Streak"
        icon={Flame}
        content={`${metrics.streak.currentStreak} days`}
        footer={metrics.streak.comparisonLabel}
      />
    </div>
  );
}

function formatMinutesToTime(minutes: number): string {
  if (minutes === 0) return '0m';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}
