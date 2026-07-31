import { useState, useEffect, useRef, useCallback } from 'react';
import { routePoints, visibleRoutePoints } from '@/data/routeData';

// Haversine vzdialenosť v metroch medzi dvoma GPS súradnicami
export function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // polomer Zeme v metroch
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Nájde najbližší bod trasy k používateľovej GPS pozícii.
 */
export function findNearestRoutePoint(userLat, userLng) {
  let minDistance = Infinity;
  let nearestPoint = null;

  for (const point of routePoints) {
    const dist = calculateDistanceMeters(userLat, userLng, point.lat, point.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearestPoint = point;
    }
  }

  return { nearestPoint, distanceMeters: minDistance };
}

/**
 * Hook pre sledovanie GPS polohy zariadenia s 2-minútovým časovým fallbackom.
 */
export function useGpsTracker(enabled = false) {
  const [gpsPosition, setGpsPosition] = useState(null);
  const [isGpsActive, setIsGpsActive] = useState(false);
  const [isGpsStale, setIsGpsStale] = useState(false);
  const [gpsError, setGpsError] = useState(null);

  const lastGpsTimeRef = useRef(0);
  const watchIdRef = useRef(null);

  useEffect(() => {
    if (!enabled || typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      setIsGpsActive(false);
      return undefined;
    }

    const handleSuccess = (position) => {
      const { latitude, longitude, accuracy } = position.coords;
      const now = Date.now();
      lastGpsTimeRef.current = now;

      setGpsPosition({
        lat: latitude,
        lng: longitude,
        accuracy,
        timestamp: now,
      });

      setIsGpsActive(true);
      setIsGpsStale(false);
      setGpsError(null);
    };

    const handleError = (err) => {
      setGpsError(err.message || 'Nepodarilo sa získať GPS polohu');
    };

    watchIdRef.current = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 5000,
    });

    // Kontrola exspirácie GPS signálu každých 10 sekúnd (> 120 sekúnd bez aktualizácie = stale)
    const checkInterval = setInterval(() => {
      if (lastGpsTimeRef.current > 0 && Date.now() - lastGpsTimeRef.current > 120000) {
        setIsGpsStale(true);
      }
    }, 10000);

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      clearInterval(checkInterval);
    };
  }, [enabled]);

  return {
    gpsPosition,
    isGpsActive,
    isGpsStale,
    gpsError,
  };
}
