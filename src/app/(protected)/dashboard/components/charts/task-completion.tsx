'use client';

import { GenericAreaChart } from '@/app/(protected)/components/generic-area-chart';
import type { ChartConfig } from '@/components/ui/chart';
import { chartDomains, chartFormatters, createGradientId } from '@/utils/chart';

const chartData = [
  { day: 'Mon', percentage: 83 },
  { day: 'Tue', percentage: 67 },
  { day: 'Wed', percentage: 100 },
  { day: 'Thu', percentage: 75 },
  { day: 'Fri', percentage: 92 },
  { day: 'Sat', percentage: 50 },
  { day: 'Sun', percentage: 60 },
];

const chartConfig = {
  percentage: {
    label: 'Tasks Done',
    color: '#10b981',
  },
} satisfies ChartConfig;

export const TaskCompletionAreaChart = () => {
  return (
    <GenericAreaChart
      title="Tasks"
      data={chartData}
      xAxisKey="day"
      yAxisKey="percentage"
      chartConfig={chartConfig}
      color="#10b981"
      gradientId={createGradientId('taskPercentage')}
      yAxisFormatter={chartFormatters.percentage.yAxis}
      tooltipFormatter={chartFormatters.percentage.tooltip}
      yAxisDomain={chartDomains.percentage}
    />
  );
};
