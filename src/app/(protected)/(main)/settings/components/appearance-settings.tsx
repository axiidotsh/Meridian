'use client';

import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/utils/utils';
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { useUpdateSettings } from '../hooks/mutations/use-update-settings';
import { useSettings } from '../hooks/queries/use-settings';
import { SettingSection } from './setting-section';

type CommandMenuPosition = 'top' | 'center';

const TopPositionPreview = () => (
  <div className="bg-muted/50 flex aspect-video w-full flex-col gap-1.5 rounded-md border p-2">
    <div className="bg-muted flex items-center gap-1.5 rounded-sm px-1.5 py-1">
      <div className="bg-muted-foreground/30 size-2 rounded-full" />
      <div className="bg-muted-foreground/20 h-1.5 flex-1 rounded-full" />
    </div>
    <div className="bg-background/50 flex h-1/2 flex-col gap-1 rounded-sm border p-1.5 shadow-sm">
      <div className="bg-muted-foreground/15 h-1.5 w-3/4 rounded-full" />
      <div className="bg-muted-foreground/15 h-1.5 w-1/2 rounded-full" />
      <div className="bg-muted-foreground/15 h-1.5 w-2/3 rounded-full" />
    </div>
  </div>
);

const CenterPositionPreview = () => (
  <div className="bg-muted/50 flex aspect-video w-full items-center justify-center rounded-md border p-2">
    <div className="bg-background/50 flex h-1/2 w-3/5 flex-col gap-1 rounded-sm border p-1.5 shadow-sm">
      <div className="bg-muted mb-0.5 flex items-center gap-1 rounded-sm px-1 py-0.5">
        <div className="bg-muted-foreground/30 size-1.5 rounded-full" />
        <div className="bg-muted-foreground/20 h-1 flex-1 rounded-full" />
      </div>
      <div className="bg-muted-foreground/15 h-1.5 w-3/4 rounded-full" />
      <div className="bg-muted-foreground/15 h-1.5 w-1/2 rounded-full" />
      <div className="bg-muted-foreground/15 h-1.5 w-2/3 rounded-full" />
    </div>
  </div>
);

interface OptionCardProps {
  title: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
  preview?: React.ReactNode;
}

const OptionCard = ({
  title,
  description,
  selected,
  onSelect,
  preview,
}: OptionCardProps) => (
  <button
    type="button"
    onClick={onSelect}
    className={cn(
      'flex cursor-pointer flex-col gap-2 rounded-lg border p-4 text-left transition-colors duration-300',
      selected
        ? 'bg-primary/5 border-primary/15'
        : 'border-input hover:bg-muted/50'
    )}
  >
    {preview}
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium">{title}</span>
      <span className="text-muted-foreground text-xs">{description}</span>
    </div>
  </button>
);

const THEME_OPTIONS = [
  { value: 'light', label: 'Light', icon: SunIcon },
  { value: 'dark', label: 'Dark', icon: MoonIcon },
  { value: 'system', label: 'System', icon: MonitorIcon },
];

export const AppearanceSettings = () => {
  const { theme, setTheme } = useTheme();
  const { data: settings } = useSettings();
  const { mutate: updateSettings, isPending } = useUpdateSettings();
  const [optimisticReduceMotion, setOptimisticReduceMotion] = useState<
    boolean | null
  >(null);

  const reduceMotion = optimisticReduceMotion ?? settings?.reduceMotion;

  function handlePositionChange(position: CommandMenuPosition) {
    updateSettings({ json: { commandMenuPosition: position } });
  }

  function handleReduceMotionChange(value: boolean) {
    const prev = optimisticReduceMotion;
    setOptimisticReduceMotion(value);
    updateSettings(
      { json: { reduceMotion: value } },
      {
        onError: () => setOptimisticReduceMotion(prev),
        onSuccess: (data) => setOptimisticReduceMotion(data.reduceMotion),
      }
    );
  }

  if (!settings) return null;

  return (
    <div className="space-y-6">
      <SettingSection
        title="Theme"
        description="Choose your preferred color theme"
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {THEME_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setTheme(option.value)}
              className={cn(
                'flex cursor-pointer items-center gap-2 rounded-lg border p-4 text-left transition-colors duration-300',
                theme === option.value
                  ? 'bg-primary/5 border-primary/15'
                  : 'border-input hover:bg-muted/50'
              )}
            >
              <option.icon className="size-4" />
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </SettingSection>
      <Separator />
      <SettingSection
        title="Reduce Motion"
        description="Disable animations across the app for reduced visual motion"
      >
        <div className="flex items-center justify-between">
          <Label htmlFor="reduce-motion" className="cursor-pointer">
            Reduce all animations
          </Label>
          <Switch
            id="reduce-motion"
            checked={reduceMotion ?? false}
            onCheckedChange={handleReduceMotionChange}
            disabled={isPending}
          />
        </div>
      </SettingSection>
      <Separator />
      <SettingSection
        title="Command Menu Position"
        description="Choose where the command menu appears"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <OptionCard
            title="Top"
            description="Opens as a dropdown below the search bar"
            selected={settings.commandMenuPosition === 'top'}
            onSelect={() => handlePositionChange('top')}
            preview={<TopPositionPreview />}
          />
          <OptionCard
            title="Center"
            description="Opens as a centered modal dialog"
            selected={settings.commandMenuPosition === 'center'}
            onSelect={() => handlePositionChange('center')}
            preview={<CenterPositionPreview />}
          />
        </div>
      </SettingSection>
    </div>
  );
};
