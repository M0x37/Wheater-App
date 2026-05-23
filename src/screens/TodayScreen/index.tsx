import React from 'react';
import type { WeatherData } from '../../types/weather';
import { HourlyRow } from '../../components/HourlyRow';
import styles from './TodayScreen.module.css';

interface TodayScreenProps {
  weatherData: WeatherData;
}

const TodayScreen: React.FC<TodayScreenProps> = ({ weatherData }) => {
  return (
    <div className={styles.todayScreen}>
      <div className={styles.sectionHeader}>TODAY'S FORECAST</div>
      <HourlyRow hourly={weatherData.hourly} timezone={weatherData.timezone} />
    </div>
  );
};

export default TodayScreen;
