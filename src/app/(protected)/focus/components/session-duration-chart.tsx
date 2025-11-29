'use client';

import type { ChartConfig } from '@/components/ui/chart';
import { chartFormatters, createGradientId } from '@/utils/chart';
import { GenericAreaChart } from '../../dashboard/components/charts/generic-area-chart';

interface SessionData extends Record<string, unknown> {
  date: string;
  duration: number;
}

interface SessionDurationChartProps {
  data: SessionData[];
}

const chartConfig = {
  duration: {
    label: 'Session Duration',
    color: '#3b82f6',
  },
} satisfies ChartConfig;

export const SessionDurationChart = ({ data }: SessionDurationChartProps) => {
  return (
    <GenericAreaChart
      title="Session Duration Timeline"
      data={data}
      xAxisKey="date"
      yAxisKey="duration"
      chartConfig={chartConfig}
      color="#3b82f6"
      gradientId={createGradientId('duration')}
      xAxisFormatter={(value) => String(value)}
      yAxisFormatter={chartFormatters.time.yAxis}
      tooltipFormatter={chartFormatters.time.tooltip}
      tooltipLabelFormatter={(value) => String(value)}
    />
  );
};
