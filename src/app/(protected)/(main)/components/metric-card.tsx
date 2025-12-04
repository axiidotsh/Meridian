import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { ContentCard } from './content-card';

interface MetricCardProps {
  title: string;
  icon: LucideIcon;
  content: ReactNode;
  footer?: ReactNode;
  isLoading?: boolean;
}

export const MetricCardSkeleton = () => {
  return (
    <Card className="bg-dashboard-card gap-0 rounded-sm shadow-none">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="size-4" />
      </CardHeader>
      <CardContent className="mt-3">
        <Skeleton className="h-8 w-16" />
      </CardContent>
      <CardFooter className="mt-1.5">
        <Skeleton className="h-3 w-32" />
      </CardFooter>
    </Card>
  );
};

export const MetricCard = ({
  title,
  icon,
  content,
  footer,
  isLoading = false,
}: MetricCardProps) => {
  if (isLoading) {
    return <MetricCardSkeleton />;
  }

  return (
    <ContentCard
      title={title}
      icon={icon}
      contentClassName="mt-3"
      footer={
        footer ? (
          <div className="text-muted-foreground text-xs">{footer}</div>
        ) : null
      }
    >
      <div className="text-2xl font-semibold">{content}</div>
    </ContentCard>
  );
};
