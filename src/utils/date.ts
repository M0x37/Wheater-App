export const getCurrentHour = (timezone?: string): number => {
  if (timezone) {
    try {
      const hour = parseInt(
        new Date().toLocaleString('en-US', { hour: 'numeric', hour12: false, timeZone: timezone }),
        10
      );
      return hour === 24 ? 0 : hour;
    } catch {
      // Fall back to local time if timezone is invalid
    }
  }
  return new Date().getHours();
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
