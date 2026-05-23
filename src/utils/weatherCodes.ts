import type { WeatherCode } from '../types/weather';

export const weatherCodes: Record<number, WeatherCode> = {
  0:  { label: "Clear Sky",            icon: "☀" },
  1:  { label: "Mainly Clear",         icon: "🌤" },
  2:  { label: "Partly Cloudy",        icon: "⛅" },
  3:  { label: "Overcast",             icon: "☁" },
  45: { label: "Foggy",                icon: "🌫" },
  48: { label: "Icy Fog",              icon: "🌫" },
  51: { label: "Light Drizzle",        icon: "🌦" },
  53: { label: "Moderate Drizzle",     icon: "🌦" },
  55: { label: "Dense Drizzle",        icon: "🌧" },
  56: { label: "Light Freezing Drizzle", icon: "🌧" },
  57: { label: "Dense Freezing Drizzle", icon: "🌧" },
  61: { label: "Light Rain",           icon: "🌧" },
  63: { label: "Rain",                 icon: "🌧" },
  65: { label: "Heavy Rain",           icon: "🌧" },
  66: { label: "Light Freezing Rain",  icon: "🌧" },
  67: { label: "Heavy Freezing Rain",  icon: "🌧" },
  71: { label: "Light Snow",           icon: "🌨" },
  73: { label: "Snow",                 icon: "❄" },
  75: { label: "Heavy Snow",           icon: "❄" },
  77: { label: "Snow Grains",          icon: "❄" },
  80: { label: "Light Showers",        icon: "🌦" },
  81: { label: "Moderate Showers",     icon: "🌦" },
  82: { label: "Violent Showers",      icon: "🌧" },
  85: { label: "Light Snow Showers",   icon: "🌨" },
  86: { label: "Heavy Snow Showers",   icon: "🌨" },
  95: { label: "Thunderstorm",         icon: "⛈" },
  96: { label: "Thunderstorm w/ Hail", icon: "⛈" },
  99: { label: "Thunderstorm w/ Heavy Hail", icon: "⛈" },
};

export const getWeatherCode = (code: number): WeatherCode => {
  return weatherCodes[code] || { label: "Unknown", icon: "?" };
};
