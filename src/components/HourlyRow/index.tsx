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
    const todayStr = hourly.time[0]?.split('T')[0] ?? '';
    const tomorrowDate = new Date(todayStr + 'T00:00:00');
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrowStr = tomorrowDate.toISOString().split('T')[0];

    return targetHours.map(targetHour => {
      let bestIndex = 0;
      let bestDiff = Infinity;

      for (let i = 0; i < hourly.time.length; i++) {
        const entryDateStr = hourly.time[i].split('T')[0];
        const entryHour = new Date(hourly.time[i]).getHours();

        if (targetHour === 0) {
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
