export const PROJECT_COLORS = [
  {
    name: 'Blue',
    value: 'blue',
    class: 'bg-blue-500 text-white border-blue-600',
  },
  {
    name: 'Green',
    value: 'green',
    class: 'bg-green-500 text-white border-green-600',
  },
  {
    name: 'Purple',
    value: 'purple',
    class: 'bg-purple-500 text-white border-purple-600',
  },
  {
    name: 'Orange',
    value: 'orange',
    class: 'bg-orange-500 text-white border-orange-600',
  },
  {
    name: 'Teal',
    value: 'teal',
    class: 'bg-teal-500 text-white border-teal-600',
  },
  {
    name: 'Pink',
    value: 'pink',
    class: 'bg-pink-500 text-white border-pink-600',
  },
  {
    name: 'Yellow',
    value: 'yellow',
    class: 'bg-yellow-400 text-black border-yellow-500',
  },
  {
    name: 'Red',
    value: 'red',
    class: 'bg-red-500 text-white border-red-600',
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
