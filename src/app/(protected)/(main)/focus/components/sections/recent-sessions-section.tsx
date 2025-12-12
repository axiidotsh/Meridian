'use client';

import { ContentCard } from '@/app/(protected)/(main)/components/content-card';
import { ErrorState } from '@/components/error-state';
import { useState } from 'react';
import { useRecentSessions } from '../../hooks/queries/use-recent-sessions';
import type { FocusSession } from '../../hooks/types';
import { SessionDeleteDialog } from '../sessions/session-delete-dialog';
import { SessionEditDialog } from '../sessions/session-edit-dialog';
import { SessionListItem } from '../sessions/session-list-item';
import { RecentSessionsSkeleton } from '../skeletons/recent-sessions-skeleton';

export const RecentSessionsSection = () => {
  const {
    data: recentSessions = [],
    isLoading,
    isError,
    refetch,
  } = useRecentSessions(20);

  const [editingSession, setEditingSession] = useState<FocusSession | null>(
    null
  );
  const [deletingSession, setDeletingSession] = useState<FocusSession | null>(
    null
  );

  if (isError) {
    return (
      <ErrorState
        onRetry={refetch}
        title="Failed to load recent sessions"
        description="Unable to fetch recent sessions. Please try again."
      />
    );
  }

  if (isLoading) {
    return (
      <ContentCard title="Recent Sessions">
        <RecentSessionsSkeleton />
      </ContentCard>
    );
  }

  if (recentSessions.length === 0) {
    return (
      <ContentCard title="Recent Sessions">
        <p className="text-muted-foreground py-8 text-center text-sm">
          No sessions yet. Start your first focus session!
        </p>
      </ContentCard>
    );
  }

  return (
    <>
      <ContentCard title="Recent Sessions">
        <ul className="mt-4 space-y-4">
          {recentSessions.slice(0, 5).map((session) => (
            <SessionListItem
              key={session.id}
              session={session}
              onEdit={setEditingSession}
              onDelete={setDeletingSession}
            />
          ))}
        </ul>
      </ContentCard>
      <SessionEditDialog
        session={editingSession}
        open={!!editingSession}
        onOpenChange={(open) => !open && setEditingSession(null)}
      />
      <SessionDeleteDialog
        session={deletingSession}
        open={!!deletingSession}
        onOpenChange={(open) => !open && setDeletingSession(null)}
      />
    </>
  );
};
