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
import './styles/globals.css';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('now');
  const { location, saveLocation } = useLocationSearch();
  
  const { data: weatherData, loading, error } = useWeather(
    location?.latitude || 0,
    location?.longitude || 0
  );

  const handleLocationChange = (newLocation: Location) => {
    saveLocation(newLocation);
  };

  const renderScreen = () => {
    if (loading) {
      return (
        <div className="loading-text">
          FETCHING WEATHER...
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-text">
          {error}
        </div>
      );
    }

    if (!weatherData || !location) {
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
        onLocationChange={handleLocationChange} 
      />
      {renderScreen()}
    </div>
  );
};

export default App;
