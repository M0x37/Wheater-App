import type { Location, GeocodingResult } from '../types/location';
import { CapacitorHttp, Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';

const validateGeocodingResponse = (data: any): data is GeocodingResult => {
  return (
    data &&
    typeof data === 'object' &&
    (data.results === undefined || Array.isArray(data.results)) &&
    (data.generationtime_ms === undefined || typeof data.generationtime_ms === 'number')
  );
};

const validateLocation = (location: any): location is Location => {
  return (
    location &&
    typeof location === 'object' &&
    typeof location.name === 'string' &&
    typeof location.latitude === 'number' &&
    typeof location.longitude === 'number' &&
    location.latitude >= -90 &&
    location.latitude <= 90 &&
    location.longitude >= -180 &&
    location.longitude <= 180
  );
};

export const searchLocation = async (name: string): Promise<Location[]> => {
  // Validate input
  if (typeof name !== 'string' || name.trim().length === 0) {
    throw new Error('Invalid location name provided');
  }
  
  if (name.trim().length > 100) {
    throw new Error('Location name too long');
  }

  const params = new URLSearchParams({
    name: name.trim().substring(0, 100),
    count: '10',
    language: 'en',
    format: 'json'
  });

  const controller = new AbortController();
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  try {
    const requestPromise = CapacitorHttp.request({
      url: `${GEOCODING_API_URL}?${params}`,
      method: 'GET',
      connectTimeout: 8000,
      readTimeout: 8000,
      webFetchExtra: {
        signal: controller.signal
      }
    });

    const response = await Promise.race([
      requestPromise,
      new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => {
          controller.abort();
          reject(new Error('Geocoding API request timeout'));
        }, 8000);
      })
    ]);

    requestPromise.catch(() => {});
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (response.status < 200 || response.status >= 300) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const data = response.data;
    
    if (!validateGeocodingResponse(data)) {
      throw new Error('Invalid geocoding API response structure');
    }
    
    if (!data.results) {
      return [];
    }
    
    return data.results.filter(validateLocation);
  } catch (error) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Geocoding API request timeout');
    }
    throw error instanceof Error ? error : new Error('Unknown error occurred');
  }
};

export const getDefaultLocation = async (): Promise<Location> => {
  // Berlin as default location
  const berlinLocations = await searchLocation('Berlin, Germany');
  if (berlinLocations.length > 0) {
    return berlinLocations[0];
  }
  
  // Fallback to hardcoded Berlin coordinates
  return {
    name: 'Berlin',
    latitude: 52.5200,
    longitude: 13.4050,
    country: 'Germany',
    admin1: 'Berlin'
  };
};

export const reverseGeocode = async (latitude: number, longitude: number): Promise<Location | null> => {
  const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';
  const params = new URLSearchParams({
    lat: latitude.toString(),
    lon: longitude.toString(),
    format: 'json',
    zoom: '10'
  });

  const controller = new AbortController();
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  try {
    const requestPromise = CapacitorHttp.request({
      url: `${NOMINATIM_URL}?${params}`,
      method: 'GET',
      connectTimeout: 8000,
      readTimeout: 8000,
      headers: {
        'User-Agent': 'WeatherApp/1.0'
      },
      webFetchExtra: {
        signal: controller.signal
      }
    });

    const response = await Promise.race([
      requestPromise,
      new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => {
          controller.abort();
          reject(new Error('Reverse geocoding request timeout'));
        }, 8000);
      })
    ]);

    requestPromise.catch(() => {});
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (response.status < 200 || response.status >= 300) {
      return null;
    }

    const data = response.data;
    if (!data || typeof data !== 'object') {
      return null;
    }

    const name = data.address?.city || data.address?.town || data.address?.village || data.name;
    if (typeof name !== 'string' || name.length === 0) {
      return null;
    }

    const location: Location = {
      name,
      latitude,
      longitude,
      country: typeof data.address?.country === 'string' ? data.address.country : undefined,
      admin1: typeof data.address?.state === 'string' ? data.address.state : undefined
    };

    return validateLocation(location) ? location : null;
  } catch {
    return null;
  }
};

const isNativePlatform = (): boolean => {
  try {
    const platform = Capacitor.getPlatform();
    return platform !== 'web';
  } catch (error) {
    console.warn('Failed to detect platform, defaulting to web:', error);
    return false;
  }
};

const validateCoordinates = (latitude: number, longitude: number): boolean => {
  return (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    !isNaN(latitude) &&
    !isNaN(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
};

const requestNativeLocationPermission = async (): Promise<void> => {
  const status = await Geolocation.checkPermissions();
  if (status.location === 'granted') {
    return;
  }

  const requestStatus = await Geolocation.requestPermissions();
  if (requestStatus.location !== 'granted') {
    throw new Error('Location permission denied');
  }
};

export const getDeviceCoordinates = async (): Promise<{ latitude: number; longitude: number }> => {
  const native = isNativePlatform();

  if (!native && typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'geolocation' in navigator) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          if (!validateCoordinates(latitude, longitude)) {
            reject(new Error('Invalid coordinates received from device'));
            return;
          }
          resolve({
            latitude,
            longitude
          });
        },
        err => reject(new Error(err.message || 'Failed to access device location')),
        { enableHighAccuracy: true, timeout: 15000 }
      );
    });
  }

  if (native) {
    try {
      await requestNativeLocationPermission();
      const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 15000 });
      const { latitude, longitude } = position.coords;
      
      if (!validateCoordinates(latitude, longitude)) {
        throw new Error('Invalid coordinates received from device');
      }
      
      return {
        latitude,
        longitude
      };
    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid coordinates received from device') {
        throw error;
      }
      throw error instanceof Error ? error : new Error('Failed to access device geolocation');
    }
  }

  throw new Error('Geolocation is not available in this environment');
};
