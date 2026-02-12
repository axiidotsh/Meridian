import { Providers } from '@/components/providers';
import { env } from '@/lib/config/env/server';
import '@/styles/globals.css';
import { cn } from '@/utils/utils';
import type { Metadata, Viewport } from 'next';
import { Dancing_Script, Geist_Mono, Inter } from 'next/font/google';

const fontSans = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

const fontMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

const fontCursive = Dancing_Script({
  variable: '--font-cursive',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title:
    env.NODE_ENV === 'development'
      ? 'Meridian Dev'
      : env.NODE_ENV === 'test'
        ? 'Meridian Test'
        : 'Meridian',
  description: 'A productivity app.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          fontSans.variable,
          fontMono.variable,
          fontCursive.variable,
          process.env.NODE_ENV === 'development' && 'debug-screens',
          'antialiased'
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
