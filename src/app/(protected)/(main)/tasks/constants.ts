export const PROJECT_COLORS = [
  {
    name: 'Blue',
    value: 'blue',
    class: 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30',
  },
  {
    name: 'Green',
    value: 'green',
    class:
      'bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30',
  },
  {
    name: 'Purple',
    value: 'purple',
    class:
      'bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30',
  },
  {
    name: 'Orange',
    value: 'orange',
    class:
      'bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30',
  },
  {
    name: 'Teal',
    value: 'teal',
    class: 'bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-500/30',
  },
  {
    name: 'Pink',
    value: 'pink',
    class: 'bg-pink-500/20 text-pink-700 dark:text-pink-300 border-pink-500/30',
  },
  {
    name: 'Yellow',
    value: 'yellow',
    class:
      'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30',
  },
  {
    name: 'Red',
    value: 'red',
    class: 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30',
  },
] as const;

export const DEFAULT_PROJECT_COLOR =
  'bg-zinc-500/20 text-zinc-700 dark:text-zinc-300 border-zinc-500/30';

export function getProjectColorClass(color: string | null | undefined): string {
  if (!color) return DEFAULT_PROJECT_COLOR;
  const found = PROJECT_COLORS.find((c) => c.value === color);
  return found?.class ?? DEFAULT_PROJECT_COLOR;
}

export const PRIORITY_OPTIONS = [
  { label: 'Low', value: 'LOW' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'High', value: 'HIGH' },
] as const;
