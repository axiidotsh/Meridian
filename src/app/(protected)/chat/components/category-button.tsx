import { Button } from '@/components/ui/button';

interface CategoryButtonProps {
  content: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const CategoryButton = ({
  content,
  isActive = false,
  onClick,
}: CategoryButtonProps) => {
  return (
    <Button
      variant={isActive ? 'default' : 'outline'}
      className="rounded-full transition-colors"
      onClick={onClick}
    >
      <span>{content}</span>
    </Button>
  );
};
