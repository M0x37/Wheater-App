import React from 'react';
import type { WeatherData } from '../../types/weather';
import { WeekRow } from '../../components/WeekRow';
import styles from './WeekScreen.module.css';

interface WeekScreenProps {
  weatherData: WeatherData;
}

export const WeekScreen: React.FC<WeekScreenProps> = ({ weatherData }) => {
  return (
    <div className={styles.weekScreen}>
      <div className={styles.sectionHeader}>7 DAY FORECAST</div>
      <WeekRow daily={weatherData.daily} timezone={weatherData.timezone} />
    </div>
  );
};
