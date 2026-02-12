import { Logo } from '@/components/icons';
import Link from 'next/link';
import { GITHUB_URL } from './constants';

export const Footer = () => (
  <footer className="border-t px-6 py-12">
    <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
      <div className="flex items-center gap-2.5">
        <Logo className="size-7" />
        <span className="font-semibold">Meridian</span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6">
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          GitHub
        </a>
        <Link
          href="/sign-in"
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/sign-up"
          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          Sign Up
        </Link>
      </div>

      <p className="text-muted-foreground text-xs">
        &copy; {new Date().getFullYear()} Meridian. Open source under MIT.
      </p>
    </div>
  </footer>
);
