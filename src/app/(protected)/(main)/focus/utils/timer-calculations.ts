export function calculateRemainingSeconds(
  startedAt: string,
  durationMinutes: number,
  totalPausedSeconds: number,
  pausedAt: string | null
): number {
  const startTime = new Date(startedAt).getTime();
  const durationMs = durationMinutes * 60 * 1000;
  const pausedMs = totalPausedSeconds * 1000;

  let elapsed: number;
  if (pausedAt) {
    elapsed = new Date(pausedAt).getTime() - startTime - pausedMs;
  } else {
    elapsed = Date.now() - startTime - pausedMs;
  }

  const remaining = durationMs - elapsed;
  return Math.floor(remaining / 1000);
}

export function formatTime(seconds: number): string {
  const absSeconds = Math.abs(seconds);
  const hours = Math.floor(absSeconds / 3600);
  const mins = Math.floor((absSeconds % 3600) / 60);
  const secs = absSeconds % 60;
  const sign = seconds < 0 ? '+' : '';

  if (hours > 0) {
    return `${sign}${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${sign}${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatTimePreview(minutes: number): string {
  const mins = minutes % 60;
  const hours = Math.floor(minutes / 60);
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:00`;
  }
  return `${mins}:00`;
}
