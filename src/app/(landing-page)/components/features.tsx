'use client';

import { cn } from '@/utils/utils';
import { motion } from 'motion/react';
import Image from 'next/image';
import { BrowserFrame } from './browser-frame';
import { type ShowcaseItem, SHOWCASES } from './constants';

const ScreenFrame = ({ showcase }: { showcase: ShowcaseItem }) => (
  <BrowserFrame>
    <div className="relative">
      <Image
        src={`${showcase.imageSrc}-light.jpeg`}
        alt={`${showcase.title} light`}
        width={2560}
        height={1445}
        quality={100}
        className="block w-full dark:hidden"
      />
      <Image
        src={`${showcase.imageSrc}-dark.jpeg`}
        alt={`${showcase.title} dark`}
        width={2560}
        height={1445}
        quality={100}
        className="hidden w-full dark:block"
      />
    </div>
  </BrowserFrame>
);

export const Features = () => (
  <section id="features" className="px-6 py-20 md:py-28">
    <div className="mx-auto max-w-6xl">
      <div className="mb-14 text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
          A look inside
        </h2>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          Powerful tools that work together to keep you focused and organized.
        </p>
      </div>

      <div className="space-y-20">
        {SHOWCASES.map((showcase, index) => (
          <motion.div
            key={showcase.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className={cn(
              'flex flex-col items-center gap-10 md:gap-14',
              index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            )}
          >
            <div className="flex-1 space-y-3">
              <h3 className="text-2xl font-semibold">{showcase.title}</h3>
              <p className="text-muted-foreground text-base leading-relaxed">
                {showcase.description}
              </p>
            </div>
            <div className="w-full flex-[1.2]">
              <ScreenFrame showcase={showcase} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
