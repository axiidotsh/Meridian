'use client';

import { GenericAreaChart } from '@/app/(protected)/(main)/components/generic-area-chart';
import type { FocusSession } from '@/app/(protected)/(main)/focus/hooks/types';
import type { ChartConfig } from '@/components/ui/chart';
import { chartFormatters, createGradientId } from '@/utils/chart';
import { useMemo } from 'react';

interface FocusTimeChartProps {
  data: FocusSession[] | undefined;
  isLoading: boolean;
  period: number;
  onPeriodChange: (days: number) => void;
}

const chartConfig = {
  duration: {
    label: 'Focus Time',
    color: '#8b5cf6',
  },
} satisfies ChartConfig;

function generateChartData(sessions: FocusSession[], days: number) {
  const chartData = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const dateKey = date.toISOString().split('T')[0];

    const daySessions = sessions.filter((session) => {
      if (session.status !== 'COMPLETED') return false;
      const sessionDate = new Date(session.startedAt);
      sessionDate.setHours(0, 0, 0, 0);
      const sessionKey = sessionDate.toISOString().split('T')[0];
      return sessionKey === dateKey;
    });

    const totalDuration = daySessions.reduce(
      (acc, session) => acc + session.durationMinutes,
      0
    );

    const dateLabel =
      days <= 7
        ? date.toLocaleDateString('en-US', { weekday: 'short' })
        : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    chartData.push({
      date: dateLabel,
      duration: totalDuration,
    });
  }

  return chartData;
}

export function FocusTimeChart({
  data,
  isLoading,
  period,
  onPeriodChange,
}: FocusTimeChartProps) {
  const chartData = useMemo(() => {
    if (!data) return [];
    return generateChartData(data, period);
  }, [data, period]);

  return (
    <GenericAreaChart
      title="Focus Time"
      data={chartData}
      xAxisKey="date"
      yAxisKey="duration"
      chartConfig={chartConfig}
      color="#8b5cf6"
      gradientId={createGradientId('focusDuration')}
      xAxisFormatter={(value) => String(value)}
      yAxisFormatter={chartFormatters.time.yAxis}
      tooltipFormatter={chartFormatters.time.tooltip}
      tooltipLabelFormatter={(value) => String(value)}
      isLoading={isLoading}
      onPeriodChange={onPeriodChange}
    />
  );
}
