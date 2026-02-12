'use client';

import { Button } from '@/components/ui/button';
import { notFoundRedirect } from '@/lib/config/redirects.config';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center gap-6 text-center">
        <p className="text-foreground/10 text-8xl font-bold tracking-tighter sm:text-9xl">
          500
        </p>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Something went wrong
          </h1>
          <p className="text-muted-foreground text-sm">
            An unexpected error occurred. Please try again.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RotateCcw />
            Try again
          </Button>
          <Button variant="outline" asChild>
            <Link href={notFoundRedirect}>
              <ArrowLeft />
              Go home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
