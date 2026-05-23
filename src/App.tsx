import React, { useState } from 'react';
import type { Location } from './types/location';
import type { TabType } from './types/common';
import { useWeather } from './hooks/useWeather';
import { useLocationSearch } from './hooks/useLocationSearch';
import { NavBar } from './components/NavBar';
import { LocationHeader } from './components/LocationHeader';
import { NowScreen } from './screens/NowScreen';
import { TodayScreen } from './screens/TodayScreen';
import { WeekScreen } from './screens/WeekScreen';
import { getDeviceCoordinates, reverseGeocode } from './api/geocoding';
import './styles/globals.css';

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

  const handleUseDeviceLocation = async () => {
    if (geoLoading) return;
    setGeoLoading(true);
    setGeoError(null);

    try {
      const { latitude, longitude } = await getDeviceCoordinates();

      let deviceLocation: Location | null = null;
      try {
        deviceLocation = await reverseGeocode(latitude, longitude);
      } catch {
        // Reverse geocoding failed; fall through to use coordinates only
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
  };

  const handleLocationChange = (newLocation: Location) => {
    saveLocation(newLocation);
  };

  const renderScreen = () => {
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
  };

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
      {renderScreen()}

      <button
        className="geo-locate-button"
        onClick={handleUseDeviceLocation}
        type="button"
        title="Use device location"
        disabled={geoLoading}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0-6c-.44 0-.88.03-1.31.08l-.96.14-.27.04c-.16.03-.31.08-.45.14l-.24.11a.96.96 0 0 0-.22.14l-.2.17-.16.18-.12.16c-.05.08-.1.16-.13.24l-.06.13-.07.17-.06.16c-.03.09-.06.18-.07.27l-.02.17V6.5l-.01.23v.48l.05.47c.02.12.05.24.08.36l.08.3.1.28.14.26.15.25.18.22c.06.07.12.14.2.2l.23.18c.07.06.15.11.22.15l.26.13c.09.04.18.08.27.1l.32.08.37.06.43.03.49.01H6.5l.23-.01h.49l.43-.03.37-.06.32-.08c.09-.02.18-.06.27-.1l.26-.13c.08-.04.15-.09.22-.15l.23-.18c.08-.06.14-.13.2-.2l.18-.22.15-.25.14-.26.1-.28.08-.3.08-.36.05-.47v-.48l-.01-.23V6.5l-.02-.17c-.01-.09-.04-.18-.07-.27l-.06-.16-.07-.17-.06-.13c-.03-.08-.08-.16-.13-.24l-.12-.16-.16-.18-.2-.17a.96.96 0 0 0-.22-.14l-.24-.11c-.14-.06-.29-.11-.45-.14l-.27-.04-.96-.14A10.01 10.01 0 0 0 12 2Zm0 2.5a7.5 7.5 0 0 1 7.5 7.5A7.5 7.5 0 0 1 12 19.5 7.5 7.5 0 0 1 4.5 12 7.5 7.5 0 0 1 12 4.5Zm0 3a4.5 4.5 0 0 0-4.44 5.12 1.5 1.5 0 0 0 2.95-.46 1.5 1.5 0 0 1 2.99.05 1.5 1.5 0 0 0 2.95.44A4.5 4.5 0 0 0 12 7.5Z" />
        </svg>
      </button>
    </div>
  );
};

export default App;
