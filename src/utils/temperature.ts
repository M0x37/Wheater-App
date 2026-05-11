export const getFeelsLikeDescription = (actual: number, feelsLike: number): string => {
  const diff = feelsLike - actual;
  
  if (Math.abs(diff) < 1) {
    return 'FEELS LIKE THE SAME';
  }
  
  if (diff > 0) {
    if (diff < 3) return 'FEELS SLIGHTLY WARMER';
    if (diff < 6) return 'FEELS WARMER';
    return 'FEELS MUCH WARMER';
  }
  
  // diff < 0
  if (diff > -3) return 'FEELS SLIGHTLY COLDER';
  if (diff > -6) return 'FEELS COLDER';
  return 'FEELS MUCH COLDER';
};

export const getTemperatureTrend = (temps: number[]): 'rising' | 'falling' | 'stable' => {
  if (temps.length < 2) return 'stable';
  
  const recent = temps.slice(-3);
  const avgChange = (recent[recent.length - 1] - recent[0]) / (recent.length - 1);
  
  if (avgChange > 1) return 'rising';
  if (avgChange < -1) return 'falling';
  return 'stable';
};
