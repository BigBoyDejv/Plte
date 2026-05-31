/** Synchronizácia živej plavby – Google Apps Script (JSONP kvôli CORS) */

const TRIP_CACHE_KEY = 'dunajec-live-trip-state';
const SYNC_URL_STORAGE_KEY = 'dunajec-trip-sync-url';
export const POLL_MS = 3000;

export const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN || '555555';

export function getTripSyncUrl() {
  const fromEnv = import.meta.env.VITE_TRIP_SYNC_URL?.trim();
  if (fromEnv) return fromEnv;
  try {
    return localStorage.getItem(SYNC_URL_STORAGE_KEY)?.trim() || '';
  } catch {
    return '';
  }
}

export function saveTripSyncUrl(url) {
  const trimmed = url?.trim();
  if (!trimmed || !trimmed.includes('script.google.com')) {
    throw new Error('Zadajte platnú URL z Google Apps Script (Nasadiť → Webová aplikácia)');
  }
  localStorage.setItem(SYNC_URL_STORAGE_KEY, trimmed);
}

export function isTripSyncConfigured() {
  return Boolean(getTripSyncUrl());
}

export function loadCachedTripState() {
  try {
    const raw = localStorage.getItem(TRIP_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveCachedTripState(state) {
  try {
    localStorage.setItem(TRIP_CACHE_KEY, JSON.stringify(state));
  } catch {
    /* quota */
  }
}

/**
 * Google Apps Script nepodporuje CORS z localhostu – používame JSONP (<script>).
 */
function fetchTripApi(params = {}) {
  const baseUrl = getTripSyncUrl();
  if (!baseUrl) {
    return Promise.reject(new Error('URL synchronizácie nie je nastavená'));
  }

  return new Promise((resolve, reject) => {
    const callbackName = `tripSync_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const query = new URLSearchParams({
      ...params,
      callback: callbackName,
    });

    let script;
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error('Časový limit odpovede servera'));
    }, 20000);

    const cleanup = () => {
      window.clearTimeout(timeout);
      try {
        delete window[callbackName];
      } catch {
        window[callbackName] = undefined;
      }
      if (script?.parentNode) {
        script.parentNode.removeChild(script);
      }
    };

    window[callbackName] = (data) => {
      cleanup();
      if (data?.error === 'unauthorized') {
        reject(new Error('Nesprávny admin PIN na serveri'));
        return;
      }
      resolve(data);
    };

    script = document.createElement('script');
    script.src = `${baseUrl}?${query}`;
    script.async = true;
    script.onerror = () => {
      cleanup();
      reject(
        new Error(
          'Nepodarilo sa spojiť so serverom. Skontrolujte URL a nasadenie Apps Script („Ktokoľvek“).'
        )
      );
    };
    document.head.appendChild(script);
  });
}

export async function fetchTripState() {
  const url = getTripSyncUrl();
  if (!url) return loadCachedTripState();

  const data = await fetchTripApi({ t: String(Date.now()) });
  saveCachedTripState(data);
  return data;
}

/** @param {'start'|'stop'|'reset'} action */
export async function adminTripAction(action, pin) {
  if (!getTripSyncUrl()) {
    throw new Error('Najprv nastavte URL synchronizácie v /admin');
  }
  const data = await fetchTripApi({
    action,
    pin: pin || '',
    t: String(Date.now()),
  });
  saveCachedTripState(data);
  return data;
}

export function getElapsedSecondsFromState(state) {
  if (!state) return 0;
  const accumulated = state.elapsedSeconds || 0;
  if (!state.active || !state.startedAt) return accumulated;
  return accumulated + Math.max(0, Math.floor((Date.now() - state.startedAt) / 1000));
}
