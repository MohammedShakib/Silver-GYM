export const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const isWithinBounds = (lat, lng, north, south, east, west) => {
  if (lat == null || lng == null) return false;
  if (north == null || south == null || east == null || west == null) return true;
  
  const inLat = lat >= south && lat <= north;
  
  let inLng = false;
  if (west <= east) {
    inLng = lng >= west && lng <= east;
  } else {
    // Crosses the antimeridian
    inLng = lng >= west || lng <= east;
  }
  
  return inLat && inLng;
};
