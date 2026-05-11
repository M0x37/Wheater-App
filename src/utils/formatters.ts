export const formatTemperature = (temp: number): string => {
  return `${Math.round(temp)}°`;
};

export const formatWindSpeed = (speed: number): string => {
  return `${Math.round(speed)} km/h`;
};

export const formatHumidity = (humidity: number): string => {
  return `${Math.round(humidity)}%`;
};

export const formatTime = (timeString: string, timezone?: string): string => {
  const date = new Date(timeString);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false,
    timeZone: timezone || 'UTC'
  });
};

export const formatHour = (timeString: string, timezone?: string): string => {
  const date = new Date(timeString);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit',
    hour12: false,
    timeZone: timezone || 'UTC'
  });
};

export const formatDay = (timeString: string, timezone?: string): string => {
  const date = new Date(timeString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: timezone || 'UTC'
  });
};

export const formatWeekday = (timeString: string, timezone?: string): string => {
  const date = new Date(timeString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short',
    timeZone: timezone || 'UTC'
  });
};
