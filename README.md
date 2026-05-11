# Weather App

A clean and simple weather application built with React, TypeScript, and Capacitor for Android deployment.

## Features

- Real-time weather data from Open-Meteo API
- Location search with geocoding
- Multiple views: Current, Today, and 7-Day forecast
- Responsive dark theme design
- Secure input validation and XSS protection
- Android app support via Capacitor

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: CSS Modules with custom variables
- **API**: Open-Meteo Weather & Geocoding
- **Mobile**: Capacitor for Android deployment
- **Build**: Gradle 8.13

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Android Studio (for APK build)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Android App

```bash
npx cap sync android
npx cap open android
```

Then build the APK in Android Studio.

## Security

- Input sanitization and validation
- XSS protection
- Request timeouts
- Secure error handling
- No hardcoded secrets

## License

MIT
