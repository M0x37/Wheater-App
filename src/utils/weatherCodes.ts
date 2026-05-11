import type { WeatherCode } from '../types/weather';

export const weatherCodes: Record<number, WeatherCode> = {
  0:  { label: "Clear Sky",      icon: "☀" },
  1:  { label: "Mainly Clear",   icon: "🌤" },
  2:  { label: "Partly Cloudy",  icon: "⛅" },
  3:  { label: "Overcast",       icon: "☁" },
  45: { label: "Foggy",          icon: "🌫" },
  48: { label: "Icy Fog",        icon: "🌫" },
  51: { label: "Light Drizzle",  icon: "🌦" },
  61: { label: "Light Rain",     icon: "🌧" },
  63: { label: "Rain",           icon: "🌧" },
  65: { label: "Heavy Rain",     icon: "🌧" },
  71: { label: "Light Snow",     icon: "🌨" },
  73: { label: "Snow",           icon: "❄" },
  75: { label: "Heavy Snow",     icon: "❄" },
  80: { label: "Showers",        icon: "🌦" },
  95: { label: "Thunderstorm",   icon: "⛈" },
};

export const getWeatherCode = (code: number): WeatherCode => {
  return weatherCodes[code] || { label: "Unknown", icon: "?" };
};
