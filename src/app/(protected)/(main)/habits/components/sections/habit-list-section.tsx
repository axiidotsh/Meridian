'use client';

import { ContentCard } from '@/app/(protected)/(main)/components/content-card';
import { HabitListActions } from '../habit-list-actions';
import { HabitsList } from '../habits-list';

interface HabitListSectionProps {
  isDashboard?: boolean;
}

export const HabitListSection = ({
  isDashboard = false,
}: HabitListSectionProps) => {
  return (
    <ContentCard
      title="Habit Tracker"
      action={<HabitListActions isDashboard={isDashboard} />}
      headerClassName="max-sm:!flex-col max-sm:!items-start max-sm:!justify-start"
      isDashboard={isDashboard}
    >
      <HabitsList />
    </ContentCard>
  );
};
