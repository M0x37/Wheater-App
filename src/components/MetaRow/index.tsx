import React from 'react';
import type { CurrentWeather } from '../../types/weather';
import { formatTemperature, formatWindSpeed, formatHumidity } from '../../utils/formatters';
import { getFeelsLikeDescription } from '../../utils/temperature';
import styles from './MetaRow.module.css';

interface MetaRowProps {
  current: CurrentWeather;
}

export const MetaRow: React.FC<MetaRowProps> = ({ current }) => {
  const feelsLike = getFeelsLikeDescription(current.temperature_2m, current.apparent_temperature);

  return (
    <div className={styles.metaRow}>
      <div className={styles.metaItem}>
        <div className={styles.metaLabel}>FEELS LIKE</div>
        <div className={styles.metaValue}>{formatTemperature(current.apparent_temperature)}</div>
      </div>
      <div className={styles.metaItem}>
        <div className={styles.metaLabel}>WIND</div>
        <div className={styles.metaValue}>{formatWindSpeed(current.windspeed_10m)}</div>
      </div>
      <div className={styles.metaItem}>
        <div className={styles.metaLabel}>HUMIDITY</div>
        <div className={styles.metaValue}>{formatHumidity(current.relative_humidity_2m)}</div>
      </div>
      <div className={styles.metaItem}>
        <div className={styles.metaLabel}>DESCRIPTION</div>
        <div className={styles.metaValue}>{feelsLike}</div>
      </div>
    </div>
  );
};
