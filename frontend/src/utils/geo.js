export const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

/**
 * Formats a distance in km to a human-readable string.
 * @param {number} distanceKm - The distance in kilometers.
 * @returns {string} - Formatted distance (e.g. "740 m", "1.2 km").
 */
export const formatDistance = (distanceKm) => {
  if (distanceKm == null) return '';
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
};

/**
 * Estimates travel time in minutes based on distance and mode.
 * @param {number} distanceKm - The distance in kilometers.
 * @param {string} mode - 'walk' | 'drive'
 * @returns {number} - Estimated time in minutes.
 */
export const estimateTravelTime = (distanceKm, mode = 'drive') => {
  if (distanceKm == null) return null;
  // Very rough estimates for city
  const speedKmh = mode === 'walk' ? 5 : 20; 
  return Math.round((distanceKm / speedKmh) * 60);
};
