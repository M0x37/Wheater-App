import React from 'react';
import type { WeatherData } from '../../types/weather';
import { formatTemperature } from '../../utils/formatters';
import { getWeatherCode } from '../../utils/weatherCodes';
import { MetaRow } from '../../components/MetaRow';
import { TimeOfDayGrid } from '../../components/TimeOfDayGrid';
import styles from './NowScreen.module.css';

interface NowScreenProps {
  weatherData: WeatherData;
}

export const NowScreen: React.FC<NowScreenProps> = ({ weatherData }) => {
  const { current } = weatherData;
  const weather = getWeatherCode(current.weathercode);

  return (
    <div className={styles.nowScreen}>
      <div className={styles.temperatureDisplay}>
        <div className={styles.bigTemp}>{formatTemperature(current.temperature_2m)}</div>
        <div className={styles.condition}>{weather.label}</div>
      </div>
      
      <MetaRow current={current} />
      
      <div className={styles.sectionHeader}>TIME OF DAY</div>
      <TimeOfDayGrid hourly={weatherData.hourly} timezone={weatherData.timezone} />
    </div>
  );
};
