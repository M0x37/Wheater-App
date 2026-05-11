import type { WeatherApiResponse } from '../types/weather';

const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

const validateWeatherResponse = (data: any): data is WeatherApiResponse => {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.latitude === 'number' &&
    typeof data.longitude === 'number' &&
    typeof data.timezone === 'string' &&
    data.current &&
    typeof data.current.temperature_2m === 'number' &&
    typeof data.current.weathercode === 'number' &&
    typeof data.current.windspeed_10m === 'number' &&
    typeof data.current.apparent_temperature === 'number' &&
    typeof data.current.relative_humidity_2m === 'number' &&
    data.hourly &&
    Array.isArray(data.hourly.time) &&
    Array.isArray(data.hourly.temperature_2m) &&
    Array.isArray(data.hourly.apparent_temperature) &&
    Array.isArray(data.hourly.weathercode) &&
    data.daily &&
    Array.isArray(data.daily.time) &&
    Array.isArray(data.daily.temperature_2m_max) &&
    Array.isArray(data.daily.temperature_2m_min) &&
    Array.isArray(data.daily.weathercode) &&
    Array.isArray(data.daily.precipitation_sum)
  );
};

export const fetchWeatherData = async (
  latitude: number,
  longitude: number
): Promise<WeatherApiResponse> => {
  // Validate coordinates
  if (typeof latitude !== 'number' || typeof longitude !== 'number' ||
      latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    throw new Error('Invalid coordinates provided');
  }

  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: 'temperature_2m,weathercode,windspeed_10m,apparent_temperature,relative_humidity_2m',
    hourly: 'temperature_2m,apparent_temperature,weathercode',
    daily: 'temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum',
    timezone: 'auto',
    forecast_days: '7'
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  try {
    const response = await fetch(`${WEATHER_API_URL}?${params}`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!validateWeatherResponse(data)) {
      throw new Error('Invalid weather API response structure');
    }
    
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Weather API request timeout');
    }
    throw error instanceof Error ? error : new Error('Unknown error occurred');
  }
};

export const normalizeWeatherData = (apiData: WeatherApiResponse) => {
  const { current, hourly, daily, timezone } = apiData;

  return {
    current: {
      ...current,
      temperature_2m: Math.round(current.temperature_2m),
      apparent_temperature: Math.round(current.apparent_temperature),
      windspeed_10m: Math.round(current.windspeed_10m),
      relative_humidity_2m: Math.round(current.relative_humidity_2m)
    },
    hourly: {
      time: hourly.time,
      temperature_2m: hourly.temperature_2m.map(temp => Math.round(temp)),
      apparent_temperature: hourly.apparent_temperature.map(temp => Math.round(temp)),
      weathercode: hourly.weathercode
    },
    daily: {
      time: daily.time,
      temperature_2m_max: daily.temperature_2m_max.map(temp => Math.round(temp)),
      temperature_2m_min: daily.temperature_2m_min.map(temp => Math.round(temp)),
      weathercode: daily.weathercode,
      precipitation_sum: daily.precipitation_sum
    },
    timezone
  };
};
