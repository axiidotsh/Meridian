'use client';

import { ChartConfig } from '@/components/ui/chart';
import { GenericAreaChart } from '../../../components/generic-area-chart';
import { useTaskChart } from '../../hooks/queries/use-task-chart';

const chartConfig = {
  completionRate: {
    label: 'Completion Rate',
    color: '#3b82f6',
  },
} satisfies ChartConfig;

export const TaskChartSection = () => {
  const { data: chartData, isLoading } = useTaskChart();

  return (
    <GenericAreaChart
      title="Task Completion Trend"
      data={chartData ?? []}
      xAxisKey="date"
      yAxisKey="completionRate"
      chartConfig={chartConfig}
      color="#3b82f6"
      gradientId="taskCompletionGradient"
      yAxisFormatter={(value) => `${value}%`}
      tooltipFormatter={(value) => `${value}%`}
      yAxisDomain={[0, 100]}
      isLoading={isLoading}
    />
  );
};
