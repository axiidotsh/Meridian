import { api } from '@/lib/rpc';
import type { InferResponseType } from 'hono/client';

type MetricsResponse = InferResponseType<typeof api.dashboard.metrics.$get>;
export type DashboardMetrics = MetricsResponse['metrics'];

type HeatmapResponse = InferResponseType<typeof api.dashboard.heatmap.$get>;
export type HeatmapData = HeatmapResponse['heatmap'];
export type HeatmapDay = HeatmapData[number];

type HabitChartResponse = InferResponseType<typeof api.habits.chart.$get>;
export type HabitChartData = HabitChartResponse['chartData'];
