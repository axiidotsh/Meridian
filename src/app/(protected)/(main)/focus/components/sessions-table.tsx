'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useSetAtom } from 'jotai';
import { EllipsisIcon, PencilIcon, TimerIcon, Trash2Icon } from 'lucide-react';
import {
  deletingSessionAtom,
  editingSessionAtom,
} from '../atoms/session-dialogs';
import type { FocusSession } from '../hooks/types';
import { formatSessionDateTime } from '../utils/session-metrics';

interface SessionsTableProps {
  sessions: FocusSession[];
  isLoading?: boolean;
}

export const SessionsTable = ({ sessions, isLoading }: SessionsTableProps) => {
  if (isLoading) {
    return (
      <div className="text-muted-foreground flex items-center justify-center py-24 text-center">
        <p className="text-sm">Loading sessions...</p>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 py-24 text-center">
        <TimerIcon className="mb-2 size-12 stroke-1 opacity-50" />
        <p className="text-sm font-medium">No sessions yet</p>
        <p className="text-xs">Start your first focus session above</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Table>
        <TableHeader className="bg-background sticky top-0 z-10">
          <TableRow>
            <TableHead className="text-muted-foreground max-w-[400px] min-w-[250px] text-xs font-normal">
              Task
            </TableHead>
            <TableHead className="text-muted-foreground w-[200px] text-xs font-normal">
              Started At
            </TableHead>
            <TableHead className="text-muted-foreground w-[120px] text-xs font-normal">
              Duration
            </TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session) => (
            <SessionTableRow key={session.id} session={session} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

interface SessionTableRowProps {
  session: FocusSession;
}

const SessionTableRow = ({ session }: SessionTableRowProps) => {
  const setEditingSession = useSetAtom(editingSessionAtom);
  const setDeletingSession = useSetAtom(deletingSessionAtom);

  return (
    <TableRow>
      <TableCell className="max-w-[400px]">
        <span className="text-sm">{session.task || 'Focus session'}</span>
      </TableCell>
      <TableCell>
        <span className="text-muted-foreground text-xs">
          {formatSessionDateTime(session.startedAt)}
        </span>
      </TableCell>
      <TableCell>
        <span className="font-mono text-sm font-medium">
          {session.durationMinutes} min
        </span>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon-sm"
              variant="ghost"
              aria-label="Session options"
              tooltip="Session options"
            >
              <EllipsisIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setEditingSession(session)}>
              <PencilIcon />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => setDeletingSession(session)}
            >
              <Trash2Icon />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
