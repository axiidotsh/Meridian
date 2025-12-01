'use client';

import { GenericAreaChart } from '@/app/(protected)/(main)/components/generic-area-chart';
import type { ChartConfig } from '@/components/ui/chart';
import { chartDomains, chartFormatters, createGradientId } from '@/utils/chart';

const chartData = [
  { day: 'Mon', percentage: 67 },
  { day: 'Tue', percentage: 75 },
  { day: 'Wed', percentage: 83 },
  { day: 'Thu', percentage: 92 },
  { day: 'Fri', percentage: 100 },
  { day: 'Sat', percentage: 58 },
  { day: 'Sun', percentage: 67 },
];

const chartConfig = {
  percentage: {
    label: 'Habits Done',
    color: '#f59e0b',
  },
} satisfies ChartConfig;

export const HabitCompletionAreaChart = () => {
  return (
    <GenericAreaChart
      title="Habits"
      data={chartData}
      xAxisKey="day"
      yAxisKey="percentage"
      chartConfig={chartConfig}
      color="#f59e0b"
      gradientId={createGradientId('habitPercentage')}
      yAxisFormatter={chartFormatters.percentage.yAxis}
      tooltipFormatter={chartFormatters.percentage.tooltip}
      yAxisDomain={chartDomains.percentage}
    />
  );
};
