import { Button } from '@/components/ui/button';
import { notFoundRedirect } from '@/lib/config/redirects.config';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center gap-6 text-center">
        <p className="text-foreground/10 text-8xl font-bold tracking-tighter sm:text-9xl">
          404
        </p>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Page not found
          </h1>
          <p className="text-muted-foreground text-sm">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
        </div>

        <Button variant="outline" asChild>
          <Link href={notFoundRedirect}>
            <ArrowLeft />
            Go home
          </Link>
        </Button>
      </div>
    </div>
  );
}
