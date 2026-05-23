import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.weatherapp.terminal',
  appName: 'Weather App',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: false,
    allowNavigation: ['https://api.open-meteo.com', 'https://geocoding-api.open-meteo.com']
  }
};

export default config;
