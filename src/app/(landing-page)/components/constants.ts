export const GITHUB_URL = 'https://github.com/axiidotsh/meridian';

export interface ShowcaseItem {
  title: string;
  description: string;
  imageSrc: string;
}

export const SHOWCASES: ShowcaseItem[] = [
  {
    title: 'Task Management',
    description:
      'Organize your work with list and Kanban views, projects, priorities, and drag & drop reordering.',
    imageSrc: '/tasks',
  },
  {
    title: 'Habit Tracking',
    description:
      'Build better habits with daily tracking, streaks, completion history, and progress insights.',
    imageSrc: '/habits',
  },
  {
    title: 'Focus Timer',
    description:
      'Stay in the zone with Pomodoro sessions, session history, and productivity metrics.',
    imageSrc: '/focus',
  },
  {
    title: 'Command Menu',
    description:
      'Cmd+K quick actions to navigate, create tasks, and control the entire app instantly.',
    imageSrc: '/command-menu',
  },
];

export const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#open-source', label: 'Open Source' },
] as const;
