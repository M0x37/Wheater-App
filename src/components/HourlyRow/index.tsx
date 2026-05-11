import React from 'react';
import type { HourlyWeather } from '../../types/weather';
import { formatHour, formatTemperature } from '../../utils/formatters';
import { getWeatherCode } from '../../utils/weatherCodes';
import styles from './HourlyRow.module.css';

interface HourlyRowProps {
  hourly: HourlyWeather;
  timezone?: string;
}

export const HourlyRow: React.FC<HourlyRowProps> = ({ hourly, timezone }) => {
  // Get specific hours for today's forecast: 06:00, 09:00, 12:00, 15:00, 18:00, 21:00, 00:00
  const targetHours = [6, 9, 12, 15, 18, 21, 0];
  
  const getHourlyData = () => {
    return targetHours.map(targetHour => {
      // Find the data point closest to the target hour
      const closestIndex = hourly.time.reduce((closestIndex, time, index) => {
        const hour = new Date(time).getHours();
        const currentDiff = Math.abs(hour - targetHour);
        const closestDiff = Math.abs(new Date(hourly.time[closestIndex]).getHours() - targetHour);
        return currentDiff < closestDiff ? index : closestIndex;
      }, 0);

      const weather = getWeatherCode(hourly.weathercode[closestIndex]);
      
      return {
        time: formatHour(hourly.time[closestIndex], timezone),
        temperature: formatTemperature(hourly.temperature_2m[closestIndex]),
        feelsLike: formatTemperature(hourly.apparent_temperature[closestIndex]),
        condition: weather.label,
        icon: weather.icon
      };
    });
  };

  const hourlyData = getHourlyData();

  return (
    <div className={styles.hourlyContainer}>
      {hourlyData.map((data) => (
        <div key={data.time} className={styles.hourlyRow}>
          <div className={styles.time}>{data.time}</div>
          <div className={styles.icon}>{data.icon}</div>
          <div className={styles.condition}>{data.condition}</div>
          <div className={styles.temperature}>{data.temperature}</div>
          <div className={styles.feelsLike}>{data.feelsLike}</div>
        </div>
      ))}
    </div>
  );
};
