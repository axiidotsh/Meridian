'use client';

import { GenericAreaChart } from '@/app/(protected)/(main)/components/generic-area-chart';
import type { ChartConfig } from '@/components/ui/chart';
import { createGradientId } from '@/utils/chart';

interface HabitChartDataPoint {
  date: string;
  completionRate: number;
}

interface HabitCompletionChartProps {
  data: HabitChartDataPoint[] | undefined;
  isLoading: boolean;
  period: number;
  onPeriodChange: (days: number) => void;
}

const chartConfig = {
  completionRate: {
    label: 'Completion Rate',
    color: '#f59e0b',
  },
} satisfies ChartConfig;

export function HabitCompletionChart({
  data,
  isLoading,
  onPeriodChange,
}: HabitCompletionChartProps) {
  return (
    <GenericAreaChart
      title="Habit Completion"
      data={data || []}
      xAxisKey="date"
      yAxisKey="completionRate"
      chartConfig={chartConfig}
      color="#f59e0b"
      gradientId={createGradientId('habitCompletionRate')}
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
