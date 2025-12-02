import { PlaceholderLogo } from '@/components/icons';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="mb-8">
        <PlaceholderLogo className="size-12" />
      </Link>
      {children}
    </div>
  );
}
