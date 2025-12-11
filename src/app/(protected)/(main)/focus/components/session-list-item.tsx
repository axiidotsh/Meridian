import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontalIcon, PencilIcon, Trash2Icon } from 'lucide-react';
import type { FocusSession } from '../hooks/types';
import { formatSessionTime } from '../utils/session-metrics';

interface SessionListItemProps {
  session: FocusSession;
  onEdit: (session: FocusSession) => void;
  onDelete: (session: FocusSession) => void;
}

export function SessionListItem({
  session,
  onEdit,
  onDelete,
}: SessionListItemProps) {
  return (
    <li className="border-border flex items-center justify-between gap-4 border-b pb-4 last:border-0 last:pb-0">
      <div className="flex-1">
        {session.task ? (
          <p className="text-sm">{session.task}</p>
        ) : (
          <p className="text-muted-foreground text-sm">Focus session</p>
        )}
        <p className="text-muted-foreground mt-1 font-mono text-xs">
          {formatSessionTime(session.startedAt)}
          {session.completedAt && (
            <> - {formatSessionTime(session.completedAt)}</>
          )}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm font-medium">
          {session.durationMinutes} min
        </span>
        {session.status === 'COMPLETED' ? (
          <div className="size-2 rounded-full bg-green-500" />
        ) : session.status === 'CANCELLED' ? (
          <div className="size-2 rounded-full bg-red-500" />
        ) : null}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreHorizontalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(session)}>
              <PencilIcon />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete(session)}
            >
              <Trash2Icon />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </li>
  );
}
