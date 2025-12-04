import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { AlertCircleIcon, RefreshCwIcon } from 'lucide-react';

interface FocusErrorStateProps {
  onRetry: () => void;
}

export function FocusErrorState({ onRetry }: FocusErrorStateProps) {
  return (
    <div className="mt-4">
      <Empty className="border py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertCircleIcon className="text-destructive" />
          </EmptyMedia>
          <EmptyTitle>Failed to load focus data</EmptyTitle>
          <EmptyDescription>
            Something went wrong while fetching your focus sessions. Please try
            again.
          </EmptyDescription>
        </EmptyHeader>
        <Button onClick={onRetry} variant="outline">
          <RefreshCwIcon />
          Retry
        </Button>
      </Empty>
    </div>
  );
}
