export interface Location {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}

export interface GeocodingResult {
  results: Location[];
  generationtime_ms: number;
}

export interface LocationSearchError {
  message: string;
  code: string;
}
