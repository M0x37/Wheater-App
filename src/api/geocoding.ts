import type { Location, GeocodingResult } from '../types/location';

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
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

  try {
    const response = await fetch(`${GEOCODING_API_URL}?${params}`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!validateGeocodingResponse(data)) {
      throw new Error('Invalid geocoding API response structure');
    }
    
    if (!data.results) {
      return [];
    }
    
    return data.results.filter(validateLocation);
  } catch (error) {
    clearTimeout(timeoutId);
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
