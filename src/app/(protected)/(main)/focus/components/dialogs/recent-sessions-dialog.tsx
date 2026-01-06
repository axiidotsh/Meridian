'use client';

import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/ui/responsive-dialog';
import { useRecentSessions } from '../../hooks/queries/use-recent-sessions';
import { SessionsTable } from '../sessions-table';

interface RecentSessionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RecentSessionsDialog = ({
  open,
  onOpenChange,
}: RecentSessionsDialogProps) => {
  const { data: recentSessions = [], isLoading } = useRecentSessions(20);

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-3xl!">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Recent Sessions</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          <SessionsTable sessions={recentSessions} isLoading={isLoading} />
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
};
