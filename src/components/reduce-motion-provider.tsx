'use client';

import { useSettings } from '@/app/(protected)/(main)/settings/hooks/queries/use-settings';
import { MotionConfig } from 'motion/react';
import { useEffect } from 'react';

interface ReduceMotionProviderProps {
  children: React.ReactNode;
}

export const ReduceMotionProvider = ({
  children,
}: ReduceMotionProviderProps) => {
  const { data: settings } = useSettings();
  const reduceMotion = settings?.reduceMotion ?? false;

  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reduceMotion);
    return () => {
      document.documentElement.classList.remove('reduce-motion');
    };
  }, [reduceMotion]);

  return (
    <MotionConfig reducedMotion={reduceMotion ? 'always' : 'user'}>
      {children}
    </MotionConfig>
  );
};
