'use client';

import { MetallicButton } from '@/components/metallic-button';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon, GithubIcon } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { GITHUB_URL } from './constants';

export const OpenSource = () => (
  <section id="open-source" className="px-6 py-20 md:py-28">
    <div className="mx-auto max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
        className="bg-card flex flex-col items-center rounded-2xl border p-8 text-center sm:p-12 lg:p-16"
      >
        <div className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full">
          <GithubIcon className="size-6" />
        </div>
        <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
          Open Source
        </h2>
        <p className="text-muted-foreground mt-4 max-w-xl text-lg">
          Meridian is fully open source. Star us on GitHub, contribute, or
          self-host your own instance.
        </p>
        <div className="mt-8 flex gap-3">
          <Button asChild size="lg" variant="outline">
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
              <GithubIcon />
              GitHub
            </a>
          </Button>
          <MetallicButton asChild size="lg">
            <Link href="/sign-in">
              Get Started
              <ArrowRightIcon />
            </Link>
          </MetallicButton>
        </div>
      </motion.div>
    </div>
  </section>
);
