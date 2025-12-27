'use client';

import { GenericAreaChart } from '@/app/(protected)/(main)/components/generic-area-chart';
import type { ChartConfig } from '@/components/ui/chart';
import { createGradientId } from '@/utils/chart';

interface TaskChartDataPoint {
  date: string;
  completionRate: number;
}

interface TaskCompletionChartProps {
  data: TaskChartDataPoint[] | undefined;
  isLoading: boolean;
  period: number;
  onPeriodChange: (days: number) => void;
}

const chartConfig = {
  completionRate: {
    label: 'Completion Rate',
    color: '#10b981',
  },
} satisfies ChartConfig;

export function TaskCompletionChart({
  data,
  isLoading,
  onPeriodChange,
}: TaskCompletionChartProps) {
  return (
    <GenericAreaChart
      title="Task Completion"
      data={data || []}
      xAxisKey="date"
      yAxisKey="completionRate"
      chartConfig={chartConfig}
      color="#10b981"
      gradientId={createGradientId('taskCompletionRate')}
      xAxisFormatter={(value) => String(value)}
      yAxisFormatter={(value) => `${value}%`}
      tooltipFormatter={(value) => `${value}%`}
      tooltipLabelFormatter={(value) => String(value)}
      yAxisDomain={[0, 100]}
      isLoading={isLoading}
      onPeriodChange={onPeriodChange}
    />
  );
}
