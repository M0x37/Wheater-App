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
  const targetHours = [6, 9, 12, 15, 18, 21, 0];
  
  const getHourlyData = () => {
    const todayStr = new Date().toISOString().split('T')[0];

    return targetHours.map(targetHour => {
      let bestIndex = 0;
      let bestDiff = Infinity;

      for (let i = 0; i < hourly.time.length; i++) {
        const entryDate = new Date(hourly.time[i]);
        const entryDateStr = hourly.time[i].split('T')[0];
        const entryHour = entryDate.getHours();

        if (targetHour === 0) {
          // For midnight, look for 00:00 on the day after today
          const tomorrow = new Date(todayStr);
          tomorrow.setDate(tomorrow.getDate() + 1);
          const tomorrowStr = tomorrow.toISOString().split('T')[0];
          if (entryDateStr === tomorrowStr && entryHour === 0) {
            bestIndex = i;
            break;
          }
        } else {
          if (entryDateStr !== todayStr) continue;
          const diff = Math.abs(entryHour - targetHour);
          if (diff < bestDiff) {
            bestDiff = diff;
            bestIndex = i;
          }
        }
      }

      const weather = getWeatherCode(hourly.weathercode[bestIndex]);
      
      return {
        time: formatHour(hourly.time[bestIndex], timezone),
        temperature: formatTemperature(hourly.temperature_2m[bestIndex]),
        feelsLike: formatTemperature(hourly.apparent_temperature[bestIndex]),
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
