import { useState, useEffect, useCallback } from 'react';
import type { WeatherData } from '../types/weather';
import { fetchWeatherData, normalizeWeatherData } from '../api/weather';

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

interface UseWeatherState {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
}

export const useWeather = (latitude: number, longitude: number) => {
  const [state, setState] = useState<UseWeatherState>({
    data: null,
    loading: true,
    error: null
  });

  const fetchWeather = useCallback(async () => {
    // Improved coordinate validation
    if (!isValidCoordinate(latitude, longitude)) {
      setState(prev => ({ ...prev, loading: false, error: 'Invalid coordinates' }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const apiData = await fetchWeatherData(latitude, longitude);
      const normalizedData = normalizeWeatherData(apiData);
      
      setState({
        data: normalizedData,
        loading: false,
        error: null
      });
    } catch (err) {
      setState({
        data: null,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch weather data'
      });
    }
  }, [latitude, longitude]);

  useEffect(() => {
    fetchWeather();
  }, [latitude, longitude]);

  const refetch = useCallback(() => {
    fetchWeather();
  }, [fetchWeather]);

  return {
    ...state,
    refetch
  };
};
