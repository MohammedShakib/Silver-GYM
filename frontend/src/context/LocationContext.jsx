import React, { createContext, useState, useCallback, useEffect } from 'react';

export const LocationContext = createContext(null);

const DEFAULT_LOCATION = {
  source: 'fallback',
  label: 'Dhaka',
  latitude: 23.8103,
  longitude: 90.4125,
  area: 'Dhaka',
};

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const requestBrowserLocation = useCallback(() => {
    setIsLocating(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          source: 'current',
          label: 'Current Location',
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          area: 'Detected Area', // Without reverse geocoding, we can just say "Detected Area"
        });
        setIsLocating(false);
      },
      (error) => {
        let errorMsg = 'An unknown error occurred.';
        if (error.code === 1) errorMsg = 'Location permission denied.';
        else if (error.code === 2) errorMsg = 'Position unavailable.';
        else if (error.code === 3) errorMsg = 'Location request timed out.';
        
        setLocationError(errorMsg);
        setIsLocating(false);
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  const setManualLocation = useCallback((loc) => {
    setLocation({
      ...loc,
      source: loc.source || 'custom',
    });
  }, []);

  const value = {
    location,
    isLocating,
    locationError,
    requestBrowserLocation,
    setManualLocation,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};
