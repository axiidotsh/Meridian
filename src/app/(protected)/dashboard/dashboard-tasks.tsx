import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDueDate, getDueDateUrgency } from '@/lib/date';
import { cn } from '@/lib/utils';
import { PlusIcon } from 'lucide-react';

interface DashboardTaskProps {
  task: string;
  completed: boolean;
  dueDate?: Date;
}

interface DashboardTasksProps {
  tasks: DashboardTaskProps[];
}

export const DashboardTasks = ({ tasks }: DashboardTasksProps) => {
  return (
    <div className="bg-dashboard-card rounded-sm border px-6 py-5">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-sm">Tasks</h2>
        <Button size="icon-sm" variant="ghost" className="size-6">
          <PlusIcon />
        </Button>
      </div>
      <ul className="mt-5 space-y-5">
        {tasks.map((task) => (
          <li
            key={task.task}
            className="flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2">
              <Checkbox checked={task.completed} />
              <p
                className={cn(
                  'text-muted-foreground text-sm',
                  task.completed && 'line-through'
                )}
              >
                {task.task}
              </p>
            </div>
            {task.dueDate && (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-mono text-xs">
                  {formatDueDate(task.dueDate)}
                </span>
                <div
                  className={cn('size-1.5 rounded-xs', {
                    'bg-red-500': getDueDateUrgency(task.dueDate) === 'today',
                    'bg-orange-500': getDueDateUrgency(task.dueDate) === 'soon',
                    'bg-green-500': getDueDateUrgency(task.dueDate) === 'later',
                  })}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
