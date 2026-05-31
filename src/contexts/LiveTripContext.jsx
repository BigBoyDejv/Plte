import { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  fetchTripState,
  loadCachedTripState,
  getElapsedSecondsFromState,
  isTripSyncConfigured,
  POLL_MS,
} from '@/lib/tripSync';
import { TRIP_DURATION_SECONDS } from '@/data/routeData';

const FOLLOW_KEY = 'dunajec-follow-live-trip';

const LiveTripContext = createContext(null);

export function LiveTripProvider({ children }) {
  const [tripState, setTripState] = useState(() => loadCachedTripState());
  const [syncError, setSyncError] = useState(false);
  const [tick, setTick] = useState(0);
  const [followLive, setFollowLive] = useState(() => {
    try {
      const v = localStorage.getItem(FOLLOW_KEY);
      return v !== 'false';
    } catch {
      return true;
    }
  });

  const lastStopIndex = useRef(0);

  const refresh = useCallback(async () => {
    try {
      const data = await fetchTripState();
      if (data) {
        setTripState(data);
        setSyncError(false);
      }
    } catch {
      const cached = loadCachedTripState();
      if (cached) setTripState(cached);
      setSyncError(true);
    }
  }, []);

  useEffect(() => {
    refresh();
    if (!isTripSyncConfigured()) return undefined;

    const id = setInterval(refresh, POLL_MS);
    const onOnline = () => refresh();
    window.addEventListener('online', onOnline);
    return () => {
      clearInterval(id);
      window.removeEventListener('online', onOnline);
    };
  }, [refresh]);

  const tripActive = Boolean(tripState?.tripId && (tripState?.active || tripState?.stoppedAt));
  const tripRunning = Boolean(tripState?.active && tripState?.startedAt);
  const elapsedSeconds = useMemo(
    () => (tripActive ? Math.min(TRIP_DURATION_SECONDS, getElapsedSecondsFromState(tripState)) : 0),
    [tripActive, tripState, tick]
  );

  useEffect(() => {
    if (!tripRunning) return undefined;
    const id = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [tripRunning, tripState?.startedAt]);

  const setFollowLivePersisted = (value) => {
    setFollowLive(value);
    try {
      localStorage.setItem(FOLLOW_KEY, value ? 'true' : 'false');
    } catch {
      /* ignore */
    }
  };

  const value = {
    tripState,
    tripActive,
    tripRunning,
    elapsedSeconds,
    followLive,
    setFollowLive: setFollowLivePersisted,
    syncError,
    syncConfigured: isTripSyncConfigured(),
    refresh,
    lastStopIndex,
    tick,
  };

  return (
    <LiveTripContext.Provider value={value}>{children}</LiveTripContext.Provider>
  );
}

export function useLiveTrip() {
  const ctx = useContext(LiveTripContext);
  if (!ctx) throw new Error('useLiveTrip must be used within LiveTripProvider');
  return ctx;
}
