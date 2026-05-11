import React from 'react';
import type { DailyWeather } from '../../types/weather';
import { formatWeekday, formatTemperature } from '../../utils/formatters';
import { getWeatherCode } from '../../utils/weatherCodes';
import styles from './WeekRow.module.css';

interface WeekRowProps {
  daily: DailyWeather;
  timezone?: string;
}

export const WeekRow: React.FC<WeekRowProps> = ({ daily, timezone }) => {
  return (
    <div className={styles.weekContainer}>
      {daily.time.map((time, index) => {
        const weather = getWeatherCode(daily.weathercode[index]);
        const highTemp = formatTemperature(daily.temperature_2m_max[index]);
        const lowTemp = formatTemperature(daily.temperature_2m_min[index]);
        const precipitation = daily.precipitation_sum[index];
        
        return (
          <div key={time} className={styles.weekRow}>
            <div className={styles.day}>{formatWeekday(time, timezone)}</div>
            <div className={styles.icon}>{weather.icon}</div>
            <div className={styles.condition}>{weather.label}</div>
            <div className={styles.precipitation}>
              {precipitation > 0 ? `${Math.round(precipitation)}mm` : ''}
            </div>
            <div className={styles.high}>{highTemp}</div>
            <div className={styles.low}>{lowTemp}</div>
          </div>
        );
      })}
    </div>
  );
};
