export function calculateCurrentStreak(
  completions: { date: Date | string }[]
): number {
  if (completions.length === 0) return 0;

  const sorted = [...completions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const today = new Date();
  const todayUTC = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  );

  let streak = 0;
  let checkDate = new Date(todayUTC);

  for (const completion of sorted) {
    const compDate = new Date(completion.date);
    const compDateUTC = new Date(
      Date.UTC(
        compDate.getUTCFullYear(),
        compDate.getUTCMonth(),
        compDate.getUTCDate()
      )
    );

    if (compDateUTC.getTime() === checkDate.getTime()) {
      streak++;
      checkDate = new Date(checkDate.getTime() - 24 * 60 * 60 * 1000);
    } else if (compDateUTC.getTime() < checkDate.getTime()) {
      break;
    }
  }

  return streak;
}

export function calculateBestStreak(
  completions: { date: Date | string }[]
): number {
  if (completions.length === 0) return 0;

  const sorted = [...completions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let maxStreak = 0;
  let currentStreak = 0;
  let previousDate: Date | null = null;

  for (const completion of sorted) {
    const compDate = new Date(completion.date);
    const currentDate = new Date(
      Date.UTC(
        compDate.getUTCFullYear(),
        compDate.getUTCMonth(),
        compDate.getUTCDate()
      )
    );

    if (previousDate === null) {
      currentStreak = 1;
    } else {
      const expectedDate = new Date(
        previousDate.getTime() + 24 * 60 * 60 * 1000
      );

      if (currentDate.getTime() === expectedDate.getTime()) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
    }

    maxStreak = Math.max(maxStreak, currentStreak);
    previousDate = currentDate;
  }

  return maxStreak;
}
