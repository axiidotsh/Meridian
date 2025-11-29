import { LucideIcon } from 'lucide-react';
import { ContentCard } from './content-card';

interface MetricCardProps {
  title: string;
  icon: LucideIcon;
  content: string;
  footer?: string;
}

export const MetricCard = ({
  title,
  icon,
  content,
  footer,
}: MetricCardProps) => {
  return (
    <ContentCard
      title={title}
      icon={icon}
      contentClassName="mt-3"
      footer={
        footer ? (
          <p className="text-muted-foreground text-xs">{footer}</p>
        ) : null
      }
    >
      <p className="text-2xl font-semibold">{content}</p>
    </ContentCard>
  );
};
