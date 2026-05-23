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
  const currentHour = getCurrentHour(timezone);
  
  // Get 4 time periods: morning (6-12), afternoon (12-17), evening (17-22), night (22-6)
  const getTimeSlots = () => {
    const timeSlots = [
      { label: 'MORNING', hour: 9, periodEnd: 12 },
      { label: 'AFTERNOON', hour: 14, periodEnd: 17 },
      { label: 'EVENING', hour: 19, periodEnd: 22 },
      { label: 'NIGHT', hour: 2, periodEnd: 6 }
    ];

    const todayStr = new Date().toISOString().split('T')[0];

    return timeSlots.map(slot => {
      let dataIndex = 0;
      let bestDiff = Infinity;

      for (let i = 0; i < hourly.time.length; i++) {
        const entryDateStr = hourly.time[i].split('T')[0];
        const entryHour = new Date(hourly.time[i]).getHours();

        if (slot.label === 'NIGHT') {
          // NIGHT data: look for the next night period (tomorrow early morning)
          const tomorrow = new Date(todayStr);
          tomorrow.setDate(tomorrow.getDate() + 1);
          const tomorrowStr = tomorrow.toISOString().split('T')[0];
          if (entryDateStr === tomorrowStr) {
            const diff = Math.abs(entryHour - slot.hour);
            if (diff < bestDiff) {
              bestDiff = diff;
              dataIndex = i;
            }
          }
        } else {
          if (entryDateStr !== todayStr) continue;
          const diff = Math.abs(entryHour - slot.hour);
          if (diff < bestDiff) {
            bestDiff = diff;
            dataIndex = i;
          }
        }
      }

      let isPast: boolean;
      if (slot.label === 'NIGHT') {
        // NIGHT (22-6) is past only if we're already past 6 AM the next day,
        // which can't happen for "today's" view, so it's never past.
        isPast = currentHour >= slot.periodEnd && currentHour < 22;
      } else {
        isPast = currentHour >= slot.periodEnd;
      }
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
