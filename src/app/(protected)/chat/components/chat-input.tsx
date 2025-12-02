import { Button } from '@/components/ui/button';
import { ArrowUpIcon, PlusIcon } from 'lucide-react';

export const ChatInput = () => {
  return (
    <div className="bg-muted flex flex-col rounded-lg border p-2">
      <div className="px-1">
        <textarea
          rows={1}
          placeholder="Type a message..."
          className="min-h-0 w-full resize-none ring-0 outline-none"
        />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <Button size="icon-sm" variant="outline">
          <PlusIcon />
        </Button>
        <Button size="icon-sm">
          <ArrowUpIcon />
        </Button>
      </div>
    </div>
  );
};
