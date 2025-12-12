import { AlertCircleIcon, type LucideIcon } from 'lucide-react';
import { Button } from './ui/button';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from './ui/empty';

interface ErrorStateProps {
  onRetry: () => void;
  title?: string;
  description?: string;
  icon?: LucideIcon;
}

export const ErrorState = ({
  onRetry,
  title = 'Something went wrong',
  description = 'Failed to load data. Please try again.',
  icon: Icon = AlertCircleIcon,
}: ErrorStateProps) => {
  return (
    <Empty className="bg-dashboard-card border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon className="text-destructive" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <Button onClick={onRetry} variant="outline">
        Retry
      </Button>
    </Empty>
  );
};
