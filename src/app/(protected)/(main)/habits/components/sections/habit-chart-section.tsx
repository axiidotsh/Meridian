'use client';

import { ChartConfig } from '@/components/ui/chart';
import { useState } from 'react';
import { GenericAreaChart } from '../../../components/generic-area-chart';
import { useHabitChart } from '../../hooks/queries/use-habit-chart';

export const HabitChartSection = () => {
  const [period, setPeriod] = useState(7);
  const { data: chartData = [], isLoading } = useHabitChart(period);

  function handlePeriodChange(days: number) {
    setPeriod(days);
  }

  const chartConfig = {
    completionRate: {
      label: 'Completion Rate',
      color: '#10b981',
    },
  } satisfies ChartConfig;

  return (
    <GenericAreaChart
      title="Habit Completion"
      data={chartData}
      xAxisKey="date"
      yAxisKey="completionRate"
      chartConfig={chartConfig}
      color="#10b981"
      gradientId="habitCompletionGradient"
      yAxisFormatter={(value) => `${value}%`}
      tooltipFormatter={(value) => `${value}%`}
      yAxisDomain={[0, 100]}
      isLoading={isLoading}
      onPeriodChange={handlePeriodChange}
    />
  );
};
