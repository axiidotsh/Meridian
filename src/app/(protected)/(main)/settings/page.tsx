'use client';

import { type CommandMenuPosition, settingsAtom } from '@/atoms/settings-atoms';
import { PageHeading } from '@/components/page-heading';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils/utils';
import { useAtom } from 'jotai';
import {
  AlignVerticalJustifyStartIcon,
  LayoutTemplateIcon,
} from 'lucide-react';

interface PositionOptionProps {
  value: CommandMenuPosition;
  selected: boolean;
  onSelect: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
}

const PositionOption = ({
  selected,
  onSelect,
  icon: Icon,
  label,
  description,
}: PositionOptionProps) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-colors',
        selected
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-muted-foreground/50'
      )}
    >
      <div className="flex items-center gap-2">
        <Icon className="size-4" />
        <span className="font-medium">{label}</span>
      </div>
      <span className="text-muted-foreground text-sm">{description}</span>
    </button>
  );
};

export default function SettingsPage() {
  const [settings, setSettings] = useAtom(settingsAtom);

  const handlePositionChange = (position: CommandMenuPosition) => {
    setSettings((prev) => ({ ...prev, commandMenuPosition: position }));
  };

  return (
    <div className="flex flex-col">
      <PageHeading>Settings</PageHeading>
      <div className="mt-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize how the app looks and behaves
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Command Menu Position</Label>
              <div className="grid gap-3 sm:grid-cols-2">
                <PositionOption
                  value="top"
                  selected={settings.commandMenuPosition === 'top'}
                  onSelect={() => handlePositionChange('top')}
                  icon={AlignVerticalJustifyStartIcon}
                  label="Top"
                  description="Aligned with the search bar at the top of the screen"
                />
                <PositionOption
                  value="center"
                  selected={settings.commandMenuPosition === 'center'}
                  onSelect={() => handlePositionChange('center')}
                  icon={LayoutTemplateIcon}
                  label="Center"
                  description="Centered in the middle of the screen"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
