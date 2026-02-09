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
    <ContentCard
      title={<Skeleton className="h-4 w-24" />}
      action={<Skeleton className="size-4" />}
      contentClassName="mt-3"
      footerClassName="mt-1.5"
      footer={<Skeleton className="h-3 w-32" />}
    >
      <Skeleton className="h-8 w-16" />
    </ContentCard>
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
        <div className="text-muted-foreground text-xs">
          {footer ?? '\u00A0'}
        </div>
      }
    >
      <div className="text-2xl font-semibold">{content}</div>
    </ContentCard>
  );
};
