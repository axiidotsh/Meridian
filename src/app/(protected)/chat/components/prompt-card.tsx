import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface PromptCardProps {
  prompt: string;
  icon: LucideIcon;
}

export const PromptCard = ({ prompt, icon: Icon }: PromptCardProps) => {
  return (
    <Button
      variant="ghost"
      className="text-foreground/80 justify-start px-3 text-base font-normal"
      size="lg"
    >
      {/* <Icon /> */}
      <span>{prompt}</span>
    </Button>
  );
};
