import React from 'react';
import type { HourlyWeather } from '../../types/weather';
import { formatHour, formatTemperature } from '../../utils/formatters';
import { getWeatherCode } from '../../utils/weatherCodes';
import { getCurrentHour, isNightTime } from '../../utils/date';
import styles from './TimeOfDayGrid.module.css';

interface TimeOfDayGridProps {
  hourly: HourlyWeather;
  timezone?: string;
}

export const TimeOfDayGrid: React.FC<TimeOfDayGridProps> = ({ hourly, timezone }) => {
  const currentHour = getCurrentHour();
  
  // Get 4 time periods: morning (6-12), afternoon (12-17), evening (17-22), night (22-6)
  const getTimeSlots = () => {
    const timeSlots = [
      { label: 'MORNING', hour: 9 },    // Middle of 6-12 period
      { label: 'AFTERNOON', hour: 14 }, // Middle of 12-17 period
      { label: 'EVENING', hour: 19 },   // Middle of 17-22 period
      { label: 'NIGHT', hour: 2 }       // Middle of 22-6 period
    ];

    return timeSlots.map(slot => {
      // Find the closest hourly data to the target hour
      const targetIndex = hourly.time.findIndex(time => {
        const hour = new Date(time).getHours();
        return hour === slot.hour;
      });

      let dataIndex = targetIndex;
      if (dataIndex === -1) {
        // If exact hour not found, find the closest one
        dataIndex = hourly.time.reduce((closestIndex, time, index) => {
          const hour = new Date(time).getHours();
          const currentDiff = Math.abs(hour - slot.hour);
          const closestDiff = Math.abs(new Date(hourly.time[closestIndex]).getHours() - slot.hour);
          return currentDiff < closestDiff ? index : closestIndex;
        }, 0);
      }

      const isPast = slot.hour < currentHour && !(slot.hour === 0 && currentHour >= 0);
      const isNight = isNightTime(slot.hour);

      return {
        label: slot.label,
        time: formatHour(hourly.time[dataIndex], timezone),
        temperature: formatTemperature(hourly.temperature_2m[dataIndex]),
        feelsLike: formatTemperature(hourly.apparent_temperature[dataIndex]),
        weatherCode: hourly.weathercode[dataIndex],
        isPast,
        isNight
      };
    });
  };

  const timeSlots = getTimeSlots();

  return (
    <div className={styles.timeOfDayGrid}>
      <div className={styles.gridHeader}>
        <div></div>
        <div>TIME</div>
        <div>TEMP</div>
        <div>FEELS</div>
        <div>COND</div>
      </div>
      
      {timeSlots.map((slot) => {
        const weather = getWeatherCode(slot.weatherCode);
        return (
          <div key={slot.label} className={`${styles.timeSlot} ${slot.isPast ? styles.past : ''}`}>
            <div className={styles.slotLabel}>{slot.label}</div>
            <div className={styles.slotTime}>{slot.time}</div>
            <div className={styles.slotTemp}>{slot.temperature}</div>
            <div className={styles.slotFeels}>{slot.feelsLike}</div>
            <div className={styles.slotCondition}>{weather.icon}</div>
          </div>
        );
      })}
    </div>
  );
};
