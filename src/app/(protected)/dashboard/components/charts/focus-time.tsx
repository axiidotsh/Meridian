'use client';

import type { ChartConfig } from '@/components/ui/chart';
import { chartFormatters, createGradientId } from '@/utils/chart';
import { GenericAreaChart } from './generic-area-chart';

const chartData = [
  { date: 'Mon', minutes: 120 },
  { date: 'Tue', minutes: 95 },
  { date: 'Wed', minutes: 145 },
  { date: 'Thu', minutes: 110 },
  { date: 'Fri', minutes: 155 },
  { date: 'Sat', minutes: 85 },
  { date: 'Sun', minutes: 130 },
];

const chartConfig = {
  minutes: {
    label: 'Focus Time',
    color: '#8b5cf6',
  },
} satisfies ChartConfig;

export const FocusTimeAreaChart = () => {
  return (
    <GenericAreaChart
      title="Focus Time"
      data={chartData}
      xAxisKey="date"
      yAxisKey="minutes"
      chartConfig={chartConfig}
      color="#8b5cf6"
      gradientId={createGradientId('minutes')}
      xAxisFormatter={(value) => String(value)}
      yAxisFormatter={chartFormatters.time.yAxis}
      tooltipFormatter={chartFormatters.time.tooltip}
      tooltipLabelFormatter={(value) => String(value)}
    />
  );
};
