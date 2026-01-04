export function getStreakColor(streak: number): string {
  if (streak >= 30) return 'text-purple-500';
  if (streak >= 14) return 'text-yellow-500';
  if (streak >= 7) return 'text-orange-500';
  return 'text-muted-foreground';
}
