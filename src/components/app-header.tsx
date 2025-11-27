import { SearchIcon } from 'lucide-react';
import { Input } from './ui/input';

export const AppHeader = () => {
  return (
    <div className="bg-sidebar/30 sticky top-0 z-10 flex h-16 items-center border-b px-4 backdrop-blur-2xl">
      <div className="mx-auto flex w-full max-w-7xl items-center">
        <SearchIcon className="text-muted-foreground size-4" />
        <Input
          className="border-none bg-transparent! shadow-none ring-0! outline-0!"
          placeholder="Search for items..."
        />
      </div>
    </div>
  );
};
