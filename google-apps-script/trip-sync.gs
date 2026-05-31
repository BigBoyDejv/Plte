/**
 * Google Apps Script – globálny stav plavby pre Splavovanie Dunajca
 *
 * 1. Skript → Nový projekt → vložte tento kód
 * 2. Upravte ADMIN_PIN
 * 3. Nasadiť → Nové nasadenie → Webová aplikácia
 *    - Spúšťa: Ja
 *    - Prístup: Ktokoľvek
 * 4. URL skopírujte do .env ako VITE_TRIP_SYNC_URL
 *
 * JSONP: klient posiela ?callback=tripSync_xxx – obíde CORS v prehliadači.
 */

const ADMIN_PIN = '555555';

function getState() {
  const props = PropertiesService.getScriptProperties();
  const raw = props.getProperty('tripState');
  if (!raw) {
    return { active: false, startedAt: null, tripId: null, stoppedAt: null, elapsedSeconds: 0 };
  }
  try {
    const parsed = JSON.parse(raw);
    return {
      active: !!parsed.active,
      startedAt: parsed.startedAt || null,
      tripId: parsed.tripId || null,
      stoppedAt: parsed.stoppedAt || null,
      elapsedSeconds: parsed.elapsedSeconds || 0
    };
  } catch (e) {
    return { active: false, startedAt: null, tripId: null, stoppedAt: null, elapsedSeconds: 0 };
  }
}

function setState(state) {
  PropertiesService.getScriptProperties().setProperty('tripState', JSON.stringify(state));
}

function jsonOutput(obj, callback) {
  const json = JSON.stringify(obj);
  if (callback) {
    const safe = String(callback).replace(/[^a-zA-Z0-9_]/g, '');
    if (!safe) {
      return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
    }
    return ContentService.createTextOutput(safe + '(' + json + ')').setMimeType(
      ContentService.MimeType.JAVASCRIPT
    );
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const p = e.parameter || {};
  const action = p.action || 'state';
  const pin = p.pin || '';
  const callback = p.callback || '';

  if (action === 'start') {
    if (pin !== ADMIN_PIN) {
      return jsonOutput({ error: 'unauthorized', ...getState() }, callback);
    }
    const prev = getState();
    const tripId = prev.tripId || ('trip_' + Date.now());
    const state = {
      active: true,
      startedAt: Date.now(),
      tripId: tripId,
      stoppedAt: null,
      elapsedSeconds: prev.elapsedSeconds || 0
    };
    setState(state);
    return jsonOutput(state, callback);
  }

  if (action === 'stop') {
    if (pin !== ADMIN_PIN) {
      return jsonOutput({ error: 'unauthorized', ...getState() }, callback);
    }
    const prev = getState();
    let newElapsed = prev.elapsedSeconds || 0;
    if (prev.active && prev.startedAt) {
      newElapsed += Math.max(0, Math.floor((Date.now() - prev.startedAt) / 1000));
    }
    const state = {
      active: false,
      startedAt: null,
      tripId: prev.tripId,
      stoppedAt: Date.now(),
      elapsedSeconds: newElapsed
    };
    setState(state);
    return jsonOutput(state, callback);
  }

  if (action === 'reset') {
    if (pin !== ADMIN_PIN) {
      return jsonOutput({ error: 'unauthorized', ...getState() }, callback);
    }
    const state = { active: false, startedAt: null, tripId: null, stoppedAt: null, elapsedSeconds: 0 };
    setState(state);
    return jsonOutput(state, callback);
  }

  return jsonOutput(getState(), callback);
}
