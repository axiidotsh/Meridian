'use client';

import { MetallicButton } from '@/components/metallic-button';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';

const HeroImage = () => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    className="relative mt-16 md:mt-20"
  >
    <div className="from-primary/20 to-secondary/20 absolute -inset-x-4 -top-16 -bottom-10 -z-10 bg-gradient-to-t opacity-30 blur-3xl" />
    <div className="bg-card relative mx-auto overflow-hidden rounded-xl border shadow-2xl">
      <div className="bg-muted/30 flex items-center gap-2 border-b px-4 py-3">
        <div className="flex gap-1.5">
          <div className="size-3 rounded-full bg-red-400/80" />
          <div className="size-3 rounded-full bg-yellow-400/80" />
          <div className="size-3 rounded-full bg-green-400/80" />
        </div>
        <div className="bg-muted/50 ml-2 flex h-6 w-full max-w-md items-center rounded-md px-3">
          <div className="bg-muted-foreground/20 h-1.5 w-20 rounded-full" />
        </div>
      </div>
      <Image
        src="/dashboard-light.jpeg"
        alt="Meridian dashboard"
        width={2560}
        height={1445}
        quality={100}
        className="block w-full dark:hidden"
        priority
      />
      <Image
        src="/dashboard-dark.jpeg"
        alt="Meridian dashboard"
        width={2560}
        height={1445}
        quality={100}
        className="hidden w-full dark:block"
        priority
      />
    </div>
  </motion.div>
);

export const Hero = () => (
  <section className="relative overflow-hidden px-6 pt-24 pb-20 md:pt-36 md:pb-32">
    <div className="bg-primary/5 pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
    <div className="mx-auto max-w-4xl text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="text-muted-foreground mx-auto inline-flex items-center rounded-full border px-3.5 py-1.5 text-sm">
          Open source
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          The All-in-One{' '}
          <span className="whitespace-nowrap">Productivity Suite</span>
        </h1>

        <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed">
          Tasks, habits, focus sessions, and a unified dashboard — one app to
          manage your entire productivity workflow.
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          <MetallicButton asChild size="lg">
            <Link href="/sign-in" className="gap-2 font-semibold">
              Get Started Free
              <ArrowRightIcon className="size-4" />
            </Link>
          </MetallicButton>
          <Button asChild variant="outline" size="lg">
            <a href="#features">See Features</a>
          </Button>
        </div>
      </motion.div>

      <HeroImage />
    </div>
  </section>
);
