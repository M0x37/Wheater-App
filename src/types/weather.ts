export interface CurrentWeather {
  temperature_2m: number;
  weathercode: number;
  windspeed_10m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  time: string;
}

export interface HourlyWeather {
  time: string[];
  temperature_2m: number[];
  apparent_temperature: number[];
  weathercode: number[];
}

export interface DailyWeather {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  weathercode: number[];
  precipitation_sum: number[];
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyWeather;
  daily: DailyWeather;
  timezone: string;
}

export interface WeatherApiResponse {
  latitude: number;
  longitude: number;
  current: CurrentWeather;
  hourly: HourlyWeather;
  daily: DailyWeather;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: {
    temperature_2m: string;
    weathercode: string;
    windspeed_10m: string;
    apparent_temperature: string;
    relative_humidity_2m: string;
    time: string;
  };
  hourly_units: {
    temperature_2m: string;
    apparent_temperature: string;
    weathercode: string;
    time: string;
  };
  daily_units: {
    temperature_2m_max: string;
    temperature_2m_min: string;
    weathercode: string;
    precipitation_sum: string;
    time: string;
  };
}

export interface WeatherCode {
  label: string;
  icon: string;
}
