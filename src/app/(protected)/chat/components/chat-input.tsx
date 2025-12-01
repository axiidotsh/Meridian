import { Button } from '@/components/ui/button';
import { ArrowUpIcon, PlusIcon } from 'lucide-react';

export const ChatInput = () => {
  return (
    <div className="bg-muted flex items-center gap-2 rounded-lg border p-2">
      <Button size="icon-sm" variant="ghost">
        <PlusIcon />
      </Button>
      <textarea
        rows={1}
        placeholder="Type a message..."
        className="min-h-0 w-full resize-none ring-0 outline-none"
      />
      <Button size="icon-sm" variant="outline">
        <ArrowUpIcon />
      </Button>
    </div>
  );
};
