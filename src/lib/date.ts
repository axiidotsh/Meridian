export const getTodayAt = (hours: number, minutes: number = 0) => {
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

export const getDaysFromNowAt = (
  days: number,
  hours: number,
  minutes: number = 0
) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

export const formatDueDate = (date: Date): string => {
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    // Show only time for today's tasks
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  // Show date + time for other days
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const getDueDateUrgency = (date: Date): 'today' | 'soon' | 'later' => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const daysDiff = Math.floor(
    (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysDiff === 0) return 'today';
  if (daysDiff > 0 && daysDiff <= 3) return 'soon';
  return 'later';
};
