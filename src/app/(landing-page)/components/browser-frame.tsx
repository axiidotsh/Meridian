export const BrowserFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-card hover:border-primary/20 overflow-hidden rounded-xl border shadow-sm transition-all duration-300 hover:shadow-md">
    <div className="bg-muted/30 flex items-center gap-2 border-b px-3 py-2.5">
      <div className="flex gap-1.5">
        <div className="size-2.5 rounded-full bg-red-400/60" />
        <div className="size-2.5 rounded-full bg-yellow-400/60" />
        <div className="size-2.5 rounded-full bg-green-400/60" />
      </div>
      <div className="bg-muted/50 ml-1.5 flex h-5 w-full items-center rounded-md px-2">
        <div className="bg-muted-foreground/20 h-1.5 w-12 rounded-full" />
      </div>
    </div>
    {children}
  </div>
);
