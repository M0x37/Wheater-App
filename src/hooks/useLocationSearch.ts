import { useState, useEffect, useCallback, useRef } from 'react';
import type { Location } from '../types/location';
import { searchLocation, getDefaultLocation } from '../api/geocoding';

const STORAGE_KEY = 'weather-app-location';

const validateLocation = (data: any): data is Location => {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.name === 'string' &&
    typeof data.latitude === 'number' &&
    typeof data.longitude === 'number' &&
    data.latitude >= -90 &&
    data.latitude <= 90 &&
    data.longitude >= -180 &&
    data.longitude <= 180
  );
};

const isLocalStorageAvailable = (): boolean => {
  try {
    const test = '__test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

interface UseLocationSearchState {
  location: Location | null;
  searchQuery: string;
  searchResults: Location[];
  loading: boolean;
  searchLoading: boolean;
  error: string | null;
}

export const useLocationSearch = () => {
  const [state, setState] = useState<UseLocationSearchState>({
    location: null,
    searchQuery: '',
    searchResults: [],
    loading: true,
    searchLoading: false,
    error: null
  });

  // Load saved location from localStorage or get default
  useEffect(() => {
    const loadLocation = async () => {
      try {
        if (isLocalStorageAvailable()) {
          const savedLocation = localStorage.getItem(STORAGE_KEY);
          
          if (savedLocation) {
            try {
              const parsedLocation = JSON.parse(savedLocation);
              if (validateLocation(parsedLocation)) {
                setState(prev => ({
                  ...prev,
                  location: parsedLocation,
                  searchQuery: parsedLocation.name,
                  searchResults: [],
                  loading: false
                }));
                return;
              }
            } catch {
              // Invalid JSON, continue to fallback
            }
          }
        }

        // Get default location (Berlin)
        const defaultLocation = await getDefaultLocation();
        setState(prev => ({
          ...prev,
          location: defaultLocation,
          searchQuery: defaultLocation.name,
          searchResults: [],
          loading: false
        }));
      } catch (err) {
        // Fallback to default location on error
        try {
          const defaultLocation = await getDefaultLocation();
          setState(prev => ({
            ...prev,
            location: defaultLocation,
            searchQuery: defaultLocation.name,
            searchResults: [],
            loading: false,
            error: 'Failed to load saved location'
          }));
        } catch (fallbackErr) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: 'Failed to initialize location'
          }));
        }
      }
    };

    loadLocation();
  }, []);

  const saveLocation = useCallback((location: Location) => {
    try {
      if (isLocalStorageAvailable()) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
      }
      setState(prev => ({
        ...prev,
        location,
        searchQuery: location.name,
        searchResults: [],
        searchLoading: false,
        error: null
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: 'Failed to save location'
      }));
    }
  }, []);

  const searchSeqRef = useRef(0);

  const search = useCallback(async (query: string) => {
    const seq = ++searchSeqRef.current;

    if (!query.trim()) {
      setState(prev => ({
        ...prev,
        searchQuery: query,
        searchResults: [],
        searchLoading: false,
        error: null
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      searchQuery: query,
      searchLoading: true,
      error: null
    }));

    try {
      const results = await searchLocation(query);
      if (seq !== searchSeqRef.current) return;
      setState(prev => ({
        ...prev,
        searchResults: results,
        searchLoading: false
      }));
    } catch (err) {
      if (seq !== searchSeqRef.current) return;
      setState(prev => ({
        ...prev,
        searchResults: [],
        searchLoading: false,
        error: 'Search failed'
      }));
    }
  }, []);

  const clearSearch = useCallback(() => {
    setState(prev => ({
      ...prev,
      searchQuery: '',
      searchResults: [],
      searchLoading: false,
      error: null
    }));
  }, []);

  return {
    ...state,
    saveLocation,
    search,
    clearSearch
  };
};
