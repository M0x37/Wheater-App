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
