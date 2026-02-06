import { Button } from '@/components/ui/button';
import { cn } from '@/utils/utils';
import { Plus } from 'lucide-react';

interface KanbanColumnHeaderProps {
  label: string;
  count: number;
  colorClass: string;
  onAdd?: () => void;
}

export const KanbanColumnHeader = ({
  label,
  count,
  colorClass,
  onAdd,
}: KanbanColumnHeaderProps) => (
  <div className="flex items-center gap-2 px-1 pb-3">
    <div className={cn('h-4 w-1 rounded-full', colorClass)} />
    <span className="inline-flex text-sm font-medium">{label}</span>
    <span className="text-muted-foreground text-xs">{count}</span>
    {onAdd && (
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-foreground/10 dark:hover:bg-foreground/10 ml-auto size-6"
        onClick={onAdd}
      >
        <Plus className="size-3.5" />
      </Button>
    )}
  </div>
);
