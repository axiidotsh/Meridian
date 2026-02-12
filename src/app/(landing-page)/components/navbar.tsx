'use client';

import { Logo } from '@/components/icons';
import { MetallicButton } from '@/components/metallic-button';
import { Button } from '@/components/ui/button';
import { MenuIcon, MoonStarIcon, SunIcon, XIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useState } from 'react';
import { NAV_LINKS } from './constants';

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      <SunIcon className="size-4 scale-100 dark:scale-0" />
      <MoonStarIcon className="absolute size-4 scale-0 dark:scale-100" />
    </Button>
  );
};

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-background/80 sticky top-0 z-50 border-b backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:grid md:grid-cols-[1fr_auto_1fr]">
        <div className="flex justify-start">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo className="size-7" />
            <span className="text-lg font-semibold tracking-tight">
              Meridian
            </span>
          </Link>
        </div>

        <nav className="hidden items-center justify-center gap-8 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-3">
          <ThemeToggle />
          <MetallicButton asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/sign-in">Get Started</Link>
          </MetallicButton>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-muted-foreground hover:text-foreground md:hidden"
          >
            {mobileOpen ? (
              <XIcon className="size-5" />
            ) : (
              <MenuIcon className="size-5" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border-t md:hidden"
        >
          <div className="flex flex-col gap-1 px-6 py-4">
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="text-muted-foreground hover:text-foreground rounded-md px-3 py-2 text-sm font-medium transition-colors"
              >
                {label}
              </a>
            ))}
            <MetallicButton asChild size="sm" className="mt-2">
              <Link href="/sign-in">Get Started</Link>
            </MetallicButton>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};
