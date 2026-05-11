export const getCurrentHour = (): number => {
  return new Date().getHours();
};

export const getTodayDateString = (): string => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

export const isToday = (dateString: string): boolean => {
  const today = getTodayDateString();
  const date = new Date(dateString);
  const dateStr = date.toISOString().split('T')[0];
  return today === dateStr;
};

export const isNightTime = (hour: number): boolean => {
  return hour >= 20 || hour < 6;
};

export const getDayPeriod = (hour: number): 'morning' | 'afternoon' | 'evening' | 'night' => {
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 20) return 'evening';
  return 'night';
};
