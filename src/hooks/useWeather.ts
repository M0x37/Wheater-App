import { useState, useEffect, useCallback } from 'react';
import type { WeatherData } from '../types/weather';
import { fetchWeatherData, normalizeWeatherData } from '../api/weather';

const CACHE_KEY_PREFIX = 'weather-cache';
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes

const isValidCoordinate = (lat: number, lon: number): boolean => {
  return (
    typeof lat === 'number' &&
    typeof lon === 'number' &&
    !isNaN(lat) &&
    !isNaN(lon) &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180 &&
    !(lat === 0 && lon === 0)
  );
};

const getCacheKey = (latitude: number, longitude: number): string => {
  return `${CACHE_KEY_PREFIX}:${latitude.toFixed(4)}:${longitude.toFixed(4)}`;
};

const isWeatherData = (data: any): data is WeatherData => {
  return (
    data &&
    typeof data === 'object' &&
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
    Array.isArray(data.daily.precipitation_sum) &&
    typeof data.timezone === 'string'
  );
};

const loadCachedWeather = (latitude: number, longitude: number): WeatherData | null => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }

  try {
    const cachedPayload = localStorage.getItem(getCacheKey(latitude, longitude));
    if (!cachedPayload) {
      return null;
    }

    const parsed = JSON.parse(cachedPayload);
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      typeof parsed.timestamp !== 'number' ||
      Date.now() - parsed.timestamp > CACHE_TTL_MS ||
      !isWeatherData(parsed.data)
    ) {
      return null;
    }

    return parsed.data;
  } catch {
    return null;
  }
};

const saveCachedWeather = (latitude: number, longitude: number, data: WeatherData) => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    localStorage.setItem(
      getCacheKey(latitude, longitude),
      JSON.stringify({ timestamp: Date.now(), data })
    );
  } catch {
    // Ignore localStorage failures silently.
  }
};

interface UseWeatherState {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
  warning: string | null;
}

export const useWeather = (latitude?: number, longitude?: number) => {
  const [state, setState] = useState<UseWeatherState>({
    data: null,
    loading: false,
    error: null,
    warning: null
  });

  const fetchWeather = useCallback(async () => {
    if (latitude === undefined || longitude === undefined || !isValidCoordinate(latitude, longitude)) {
      setState({ data: null, loading: false, error: null, warning: null });
      return;
    }

    const cachedData = loadCachedWeather(latitude, longitude);
    if (cachedData) {
      setState({ data: cachedData, loading: true, error: null, warning: 'Using cached weather data while refreshing from the network.' });
    } else {
      setState(prev => ({ ...prev, loading: true, error: null, warning: null }));
    }

    try {
      const apiData = await fetchWeatherData(latitude, longitude);
      const normalizedData = normalizeWeatherData(apiData);
      saveCachedWeather(latitude, longitude, normalizedData);

      setState({
        data: normalizedData,
        loading: false,
        error: null,
        warning: null
      });
    } catch (err) {
      const cachedDataFallback = cachedData || loadCachedWeather(latitude, longitude);
      if (cachedDataFallback) {
        setState({
          data: cachedDataFallback,
          loading: false,
          error: null,
          warning: err instanceof Error
            ? `${err.message}. Displaying cached weather data.`
            : 'Failed to fetch weather data. Displaying cached weather data.'
        });
        return;
      }

      setState({
        data: null,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch weather data',
        warning: null
      });
    }
  }, [latitude, longitude]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  const refetch = useCallback(() => {
    fetchWeather();
  }, [fetchWeather]);

  return {
    ...state,
    refetch
  };
};
