import React, { useState, lazy, Suspense } from 'react';
import type { Location } from './types/location';
import type { TabType } from './types/common';
import { useWeather } from './hooks/useWeather';
import { useLocationSearch } from './hooks/useLocationSearch';
import { NavBar } from './components/NavBar';
import { LocationHeader } from './components/LocationHeader';
import { GeoLocationIcon } from './components/GeoLocationIcon';
import { getDeviceCoordinates, reverseGeocode } from './api/geocoding';
import './styles/globals.css';

const NowScreen = lazy(() => import('./screens/NowScreen'));
const TodayScreen = lazy(() => import('./screens/TodayScreen'));
const WeekScreen = lazy(() => import('./screens/WeekScreen'));

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('now');
  const [geoError, setGeoError] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);

  const {
    location,
    searchQuery,
    searchResults,
    loading: locationLoading,
    searchLoading,
    error: locationError,
    saveLocation,
    search,
    clearSearch
  } = useLocationSearch();

  const { data: weatherData, loading: weatherLoading, error: weatherError, warning: weatherWarning } = useWeather(
    location?.latitude,
    location?.longitude
  );

  const handleUseDeviceLocation = React.useCallback(async () => {
    if (geoLoading) return;
    setGeoLoading(true);
    setGeoError(null);

    try {
      const { latitude, longitude } = await getDeviceCoordinates();

      let deviceLocation: Location | null = null;
      try {
        deviceLocation = await reverseGeocode(latitude, longitude);
      } catch {
      }

      if (deviceLocation) {
        saveLocation(deviceLocation);
      } else {
        saveLocation({
          name: 'Current Location',
          latitude,
          longitude
        });
      }
    } catch (error) {
      setGeoError(error instanceof Error ? error.message : 'Failed to determine device location');
    } finally {
      setGeoLoading(false);
    }
  }, [geoLoading, saveLocation]);

  const handleLocationChange = React.useCallback((newLocation: Location) => {
    saveLocation(newLocation);
  }, [saveLocation]);

  const renderScreen = React.useCallback(() => {
    if (locationLoading) {
      return (
        <div className="loading-text">
          LOADING LOCATION...
        </div>
      );
    }

    if (!location) {
      return (
        <div className="error-text">
          {locationError || 'LOCATION NOT AVAILABLE'}
        </div>
      );
    }

    if (weatherLoading && !weatherData) {
      return (
        <div className="loading-text">
          FETCHING WEATHER...
        </div>
      );
    }

    if (!weatherData && weatherError) {
      return (
        <div className="error-text">
          {weatherError}
        </div>
      );
    }

    if (!weatherData) {
      return (
        <div className="error-text">
          WEATHER DATA UNAVAILABLE
        </div>
      );
    }

    switch (activeTab) {
      case 'now':
        return <NowScreen weatherData={weatherData} />;
      case 'today':
        return <TodayScreen weatherData={weatherData} />;
      case 'week':
        return <WeekScreen weatherData={weatherData} />;
      default:
        return <NowScreen weatherData={weatherData} />;
    }
  }, [locationLoading, location, locationError, weatherLoading, weatherData, weatherError, activeTab]);

  return (
    <div className="app-container">
      <NavBar activeTab={activeTab} onTabChange={setActiveTab} />
      <LocationHeader
        location={location}
        searchQuery={searchQuery}
        searchResults={searchResults}
        searchLoading={searchLoading}
        error={locationError}
        onLocationChange={handleLocationChange}
        onSearch={search}
        clearSearch={clearSearch}
      />
      {weatherData && weatherWarning && (
        <div className="warning-text">{weatherWarning}</div>
      )}
      {geoError && (
        <div className="error-text">{geoError}</div>
      )}
      <Suspense fallback={<div className="loading-text">LOADING...</div>}>
        {renderScreen()}
      </Suspense>

      <button
        className="geo-locate-button"
        onClick={handleUseDeviceLocation}
        type="button"
        title="Use device location"
        disabled={geoLoading}
      >
        <GeoLocationIcon />
      </button>
    </div>
  );
};

export default App;
