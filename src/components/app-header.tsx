import { SearchBar } from './search-bar';

export const AppHeader = () => {
  return (
    <div className="bg-sidebar/30 sticky top-0 z-10 flex h-16 items-center border-b px-4 backdrop-blur-2xl">
      <div className="mx-auto flex w-full max-w-7xl items-center">
        <SearchBar
          placeholder="Search for items and commands..."
          className="w-full"
        />
      </div>
    </div>
  );
};
