import type { WeatherApiResponse } from '../types/weather';
import { CapacitorHttp } from '@capacitor/core';

const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';
const RATE_LIMIT_MS = 500;
let lastRequestTime = 0;

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
    (typeof data.current.time === 'string' || typeof data.current.time === 'undefined') &&
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
  const now = Date.now();
  if (now - lastRequestTime < RATE_LIMIT_MS) {
    throw new Error('Too many requests. Please try again later.');
  }
  lastRequestTime = now;

  if (typeof latitude !== 'number' || typeof longitude !== 'number' ||
      latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    throw new Error('Invalid coordinates');
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
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  try {
    const requestPromise = CapacitorHttp.request({
      url: `${WEATHER_API_URL}?${params}`,
      method: 'GET',
      connectTimeout: 7000,
      readTimeout: 7000,
      webFetchExtra: {
        signal: controller.signal
      }
    });

    const response = await Promise.race([
      requestPromise,
      new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => {
          controller.abort();
          reject(new Error('Weather API request timeout'));
        }, 7000);
      })
    ]);

    requestPromise.catch(() => {});
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (response.status < 200 || response.status >= 300) {
      throw new Error('API request failed');
    }

    const data = response.data;
    
    if (!validateWeatherResponse(data)) {
      throw new Error('Invalid response');
    }
    
    return data;
  } catch (error) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error instanceof Error ? error : new Error('Request failed');
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
