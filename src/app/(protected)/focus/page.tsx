'use client';

import { PageHeading } from '@/components/page-heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SELECT_TRIGGER_STYLES } from '@/utils/chart';
import { cn } from '@/utils/utils';
import {
  ClockPlusIcon,
  FlameIcon,
  PlayIcon,
  RotateCcwIcon,
  TimerIcon,
  TrophyIcon,
} from 'lucide-react';
import { useState } from 'react';
import { DashboardCard } from '../dashboard/components/card';
import { DashboardMetricCard } from '../dashboard/components/metric-card';

const PRESET_TIMES = [
  { label: '15 min', minutes: 15 },
  { label: '30 min', minutes: 30 },
  { label: '45 min', minutes: 45 },
  { label: '60 min', minutes: 60 },
  { label: '120 min', minutes: 120 },
];

interface FocusSession {
  duration: number;
  task?: string;
  startedAt: Date;
  completedAt?: Date;
}

const MOCK_SESSIONS: FocusSession[] = [
  {
    duration: 45,
    task: 'Review pull requests and merge updates',
    startedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 2.25 * 60 * 60 * 1000),
  },
  {
    duration: 30,
    task: 'Design new dashboard components',
    startedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 4.5 * 60 * 60 * 1000),
  },
  {
    duration: 60,
    startedAt: new Date(Date.now() - 7 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
];

export default function FocusPage() {
  const [selectedMinutes, setSelectedMinutes] = useState(45);
  const [customMinutes, setCustomMinutes] = useState('');
  const [sessionTask, setSessionTask] = useState('');
  const [sessions] = useState<FocusSession[]>(MOCK_SESSIONS);
  const [selectValue, setSelectValue] = useState('45');

  const formatTimePreview = (minutes: number) => {
    const mins = minutes % 60;
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:00`;
    }
    return `${mins}:00`;
  };

  const formatSessionTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getTodaysSessions = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return sessions.filter((session) => {
      const sessionDate = new Date(session.startedAt);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === today.getTime() && session.completedAt;
    });
  };

  const getTotalFocusTime = () => {
    const todaysSessions = getTodaysSessions();
    const totalMinutes = todaysSessions.reduce(
      (acc, session) => acc + session.duration,
      0
    );
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const handleSelectChange = (value: string) => {
    setSelectValue(value);
    if (value === 'custom') {
      return;
    }
    const minutes = parseInt(value);
    if (!isNaN(minutes)) {
      setSelectedMinutes(minutes);
    }
  };

  const handleCustomSubmit = () => {
    const minutes = parseInt(customMinutes);
    if (!isNaN(minutes) && minutes > 0 && minutes <= 999) {
      setSelectedMinutes(minutes);
      setSelectValue(minutes.toString());
      setCustomMinutes('');
    }
  };

  const handleCustomKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCustomSubmit();
    } else if (e.key === 'Escape') {
      setCustomMinutes('');
      setSelectValue(selectedMinutes.toString());
    }
  };

  const todaysSessions = getTodaysSessions();

  return (
    <div className="flex flex-col">
      <PageHeading>Focus</PageHeading>
      <div className="mt-4 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardMetricCard
            title="Sessions Today"
            icon={TimerIcon}
            content={todaysSessions.length.toString()}
            footer="Personal Best: 8 sessions"
          />
          <DashboardMetricCard
            title="Total Time Today"
            icon={ClockPlusIcon}
            content={getTotalFocusTime()}
            footer="+45m from yesterday"
          />
          <DashboardMetricCard
            title="Highest Ever"
            icon={TrophyIcon}
            content="6h 30m"
            footer="Achieved 3 days ago"
          />
          <DashboardMetricCard
            title="Current Streak"
            icon={FlameIcon}
            content="3 days"
            footer="Personal Best: 12 days"
          />
        </div>
        <DashboardCard
          title="Start a new focus session"
          action={
            selectValue === 'custom' ? (
              <div className="flex items-center gap-1.5">
                <Input
                  type="number"
                  placeholder="Min"
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(e.target.value)}
                  onKeyDown={handleCustomKeyDown}
                  onBlur={() => {
                    if (!customMinutes) {
                      setCustomMinutes('');
                      setSelectValue(selectedMinutes.toString());
                    }
                  }}
                  min="1"
                  max="999"
                  className="h-8 w-20 font-mono text-sm"
                  autoFocus
                />
                <Button
                  size="sm"
                  variant="default"
                  onClick={handleCustomSubmit}
                  disabled={!customMinutes}
                  className="h-8"
                >
                  Set
                </Button>
              </div>
            ) : (
              <Select value={selectValue} onValueChange={handleSelectChange}>
                <SelectTrigger
                  size="sm"
                  className={cn(SELECT_TRIGGER_STYLES, 'font-mono')}
                >
                  <SelectValue>
                    {PRESET_TIMES.find(
                      (p) => p.minutes.toString() === selectValue
                    )?.label || `${selectedMinutes} min`}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Presets</SelectLabel>
                    {PRESET_TIMES.map((preset) => (
                      <SelectItem
                        key={preset.minutes}
                        value={preset.minutes.toString()}
                      >
                        {preset.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectItem value="custom">Custom...</SelectItem>
                </SelectContent>
              </Select>
            )
          }
        >
          <div className="flex flex-col items-center justify-center gap-8 py-12">
            <span className="font-mono text-7xl font-bold">
              {formatTimePreview(selectedMinutes)}
            </span>
            <div className="w-full max-w-md">
              <Input
                placeholder="What are you focusing on? (optional)"
                value={sessionTask}
                onChange={(e) => setSessionTask(e.target.value)}
                className="resize-none rounded-none border-0 border-b bg-transparent! text-center shadow-none focus-visible:ring-0"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button size="icon-lg" variant="ghost" tooltip="Play">
                <PlayIcon />
              </Button>
              <Button
                size="icon-lg"
                variant="ghost"
                tooltip="Reset timer"
                onClick={() => {
                  setSelectedMinutes(45);
                  setSelectValue('45');
                }}
              >
                <RotateCcwIcon />
              </Button>
            </div>
          </div>
        </DashboardCard>
        <DashboardCard title="Recent Sessions">
          <ul className="mt-4 space-y-4">
            {sessions.slice(0, 5).map((session, index) => (
              <li
                key={index}
                className="border-border flex items-center justify-between gap-4 border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="flex-1">
                  {session.task ? (
                    <p className="text-sm">{session.task}</p>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      Focus session
                    </p>
                  )}
                  <p className="text-muted-foreground mt-1 font-mono text-xs">
                    {formatSessionTime(session.startedAt)}
                    {session.completedAt && (
                      <> - {formatSessionTime(session.completedAt)}</>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-medium">
                    {session.duration} min
                  </span>
                  {session.completedAt && (
                    <div className="size-2 rounded-full bg-green-500" />
                  )}
                </div>
              </li>
            ))}
          </ul>
        </DashboardCard>
      </div>
    </div>
  );
}
