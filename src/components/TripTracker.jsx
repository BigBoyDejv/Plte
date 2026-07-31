import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Radio, Compass, ChevronRight, Navigation, AlertTriangle, Volume2, VolumeX, Clock } from 'lucide-react';
import MapView from './MapView';
import LesnicaEndCards from './LesnicaEndCards';
import { useLiveTrip } from '@/contexts/LiveTripContext';
import { useGpsTracker } from '@/hooks/useGpsTracker';
import { playGeofenceChime, vibrateGeofence } from '@/utils/soundAndVibration';
import {
  getLiveStopInfo,
  formatTripTime,
  TRIP_DURATION_SECONDS,
  visibleRoutePoints,
} from '@/data/routeData';

const MODE_LIVE = 'live';
const MODE_BROWSE = 'browse';

export default function TripTracker({ t, onMarkerClick, onLiveStopChange, focusedStop = null }) {
  const {
    tripActive,
    elapsedSeconds: liveElapsed,
    followLive,
    setFollowLive,
    syncError,
    syncConfigured,
    tick,
  } = useLiveTrip();

  const { isGpsActive, isGpsStale } = useGpsTracker(tripActive);

  const [viewMode, setViewMode] = useState(MODE_LIVE);
  const [browseSeconds, setBrowseSeconds] = useState(0);
  const [showAfterTripInfo, setShowAfterTripInfo] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      return localStorage.getItem('dunajec-sound-enabled') !== 'false';
    } catch {
      return true;
    }
  });

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('dunajec-sound-enabled', String(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const lastScrolledStopIndex = useRef(null);

  useEffect(() => {
    if (focusedStop && focusedStop.index !== undefined) {
      setViewMode(MODE_BROWSE);
      setFollowLive(false);
      const stopPoint = visibleRoutePoints[focusedStop.index];
      if (stopPoint) {
        setBrowseSeconds(stopPoint.time * 60);
      }
    }
  }, [focusedStop]);

  const effectiveElapsed =
    tripActive && (followLive || viewMode === MODE_LIVE)
      ? liveElapsed
      : browseSeconds;

  const stopInfo = useMemo(
    () => getLiveStopInfo(effectiveElapsed),
    [effectiveElapsed, liveElapsed]
  );

  const passedStopIds = useMemo(() => {
    const mins = effectiveElapsed / 60;
    return visibleRoutePoints.filter((p) => p.time <= mins).map((p) => p.id);
  }, [effectiveElapsed]);

  const progress = Math.min(100, (effectiveElapsed / TRIP_DURATION_SECONDS) * 100);
  const showBoat = tripActive || viewMode === MODE_BROWSE;
  const followBoat = tripActive && followLive && viewMode === MODE_LIVE;
  const isTripEnded = stopInfo.stopIndex === 21 || progress >= 100;

  const remainingSeconds = Math.max(0, TRIP_DURATION_SECONDS - effectiveElapsed);
  const etaTime = useMemo(() => {
    const etaDate = new Date(Date.now() + remainingSeconds * 1000);
    const hours = String(etaDate.getHours()).padStart(2, '0');
    const mins = String(etaDate.getMinutes()).padStart(2, '0');
    return `${hours}:${mins}`;
  }, [remainingSeconds, tick]);

  useEffect(() => {
    if (tripActive) {
      setBrowseSeconds(liveElapsed);
    }
  }, [tripActive, liveElapsed]);

  useEffect(() => {
    if (tripActive && followLive && onLiveStopChange && stopInfo.stopIndex) {
      if (lastScrolledStopIndex.current !== stopInfo.stopIndex) {
        lastScrolledStopIndex.current = stopInfo.stopIndex;
        onLiveStopChange(stopInfo.stopIndex, stopInfo.current?.name);
        vibrateGeofence();
        if (soundEnabled) {
          playGeofenceChime();
        }
      }
    } else if (!followLive) {
      lastScrolledStopIndex.current = null;
    }
  }, [stopInfo.stopIndex, tripActive, followLive, onLiveStopChange, stopInfo.current?.name, soundEnabled]);

  const texts = {
    title: t?.trip_tracker || 'Sledovanie plavby',
    live: t?.trip_mode_live || 'Živá plavba',
    browse: t?.trip_mode_browse || 'Prehliadať',
    follow: t?.trip_follow_on || 'Sledovať loď',
    unfollow: t?.trip_follow_off || 'Voľný pohľad',
    waiting: t?.trip_waiting || 'Plavba ešte nezačala. Po štarte uvidíte loď na mape v reálnom čase.',
    liveNow: t?.trip_live_now || 'Plavba práve prebieha',
    current: t?.trip_current_stop || 'Práve pri',
    next: t?.trip_next_stop || 'Ďalej',
    elapsed: t?.time_elapsed || 'Uplynulý čas',
    browseHint: t?.trip_browse_hint || 'Posuňte čas a pozrite si trasu dopredu alebo dozadu.',
    syncWarn: t?.trip_sync_warn || 'Slabý signál – zobrazujem naposledy známy stav plavby.',
    browserHint: t?.trip_browser_hint || 'Stačí otvoriť stránku v prehliadači (Safari/Chrome), inštalácia nie je nutná.',
    admin: t?.trip_admin_link || 'Ovládanie plavby',
    gpsActive: t?.gps_active || 'GPS signál aktívny',
    gpsStale: t?.gps_stale || 'Odhadovaná poloha (slabý GPS signál)',
    soundOn: t?.sound_on || 'Zvuk zapnutý',
    soundOff: t?.sound_off || 'Zvuk vypnutý',
    btnAfterTrip: t?.btn_after_trip || 'Čo robiť po plavbe? (Lesnica tipy & návrat)',
    btnHideAfterTrip: t?.btn_hide_after_trip || 'Skryť tipy po plavbe',
  };

  return (
    <section className="relative px-3 sm:px-4 -mt-4 z-20 max-w-6xl mx-auto">
      {tripActive && (
        <div className="mb-3 flex items-center justify-center">
          <span className="inline-flex items-center gap-2 bg-river-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full shadow-lg animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white" />
            {texts.liveNow}
          </span>
        </div>
      )}

      <div className="bg-goral-900 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-goral-600/60 overflow-hidden">
        <div className="px-4 pt-4 pb-2 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-goral-50 font-folk text-lg sm:text-xl font-bold">{texts.title}</h2>
          <div className="flex items-center gap-2">
            {tripActive && (
              isGpsActive && !isGpsStale ? (
                <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold px-2.5 py-1 rounded-full">
                  <Navigation className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  {texts.gpsActive}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold px-2.5 py-1 rounded-full">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  {texts.gpsStale}
                </span>
              )
            )}
            {syncConfigured && (
              <Link
                to="/admin"
                className="text-xs text-goral-300 hover:text-white underline underline-offset-2"
              >
                {texts.admin}
              </Link>
            )}
          </div>
        </div>

        {!tripActive && (
          <div className="px-4 pb-3">
            <p className="text-goral-300 text-sm leading-relaxed">{texts.waiting}</p>
            <p className="text-goral-500 text-xs mt-2">{texts.browserHint}</p>
          </div>
        )}

        {syncError && tripActive && (
          <p className="px-4 pb-2 text-amber-300 text-xs">{texts.syncWarn}</p>
        )}

        {tripActive && (
          <div className="px-3 pb-3 flex items-center gap-2">
            <div className="flex-1 flex gap-1 p-1 bg-goral-800 rounded-xl">
              <ModeButton
                active={viewMode === MODE_LIVE}
                onClick={() => {
                  setViewMode(MODE_LIVE);
                  setFollowLive(true);
                }}
                icon={<Radio className="w-4 h-4" />}
                label={texts.live}
              />
              <ModeButton
                active={viewMode === MODE_BROWSE}
                onClick={() => {
                  setViewMode(MODE_BROWSE);
                  setFollowLive(false);
                }}
                icon={<Compass className="w-4 h-4" />}
                label={texts.browse}
              />
            </div>
            <button
              type="button"
              onClick={toggleSound}
              title={soundEnabled ? texts.soundOn : texts.soundOff}
              className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all shrink-0 active:scale-95 ${
                soundEnabled
                  ? 'bg-river-500/20 text-river-300 border-river-500/40 hover:bg-river-500/30'
                  : 'bg-goral-800 text-goral-400 border-goral-700 hover:text-goral-200'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-river-400" /> : <VolumeX className="w-4 h-4 text-goral-400" />}
              <span className="hidden sm:inline">{soundEnabled ? texts.soundOn : texts.soundOff}</span>
            </button>
          </div>
        )}



        {(tripActive || viewMode === MODE_BROWSE) && (
          <div className="mx-3 mb-3 rounded-xl bg-goral-800/80 border border-goral-600/50 p-3 sm:p-4">
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-10 h-10 rounded-full bg-river-500/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-river-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-goral-400 text-xs uppercase tracking-wide">{texts.current}</p>
                <p className="text-goral-50 font-bold text-base sm:text-lg truncate">
                  {stopInfo.current?.name || '—'}
                </p>
                {stopInfo.next && (
                  <p className="text-goral-400 text-xs mt-1 flex items-center gap-1 truncate">
                    <ChevronRight className="w-3 h-3 shrink-0" />
                    {texts.next}: {stopInfo.next.name}
                  </p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-goral-400 text-xs">{texts.elapsed}</p>
                <p className="text-river-300 font-mono font-bold text-lg">
                  {formatTripTime(effectiveElapsed)}
                </p>
                {(tripActive || viewMode === MODE_BROWSE) && remainingSeconds > 0 && (
                  <p className="text-[11px] text-amber-300 font-medium mt-1 flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>Dojazd o {etaTime}</span>
                  </p>
                )}
              </div>
            </div>
            <div className="mt-3 h-2 bg-goral-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-river-500 to-river-300 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="px-2 sm:px-3 pb-3">
          <MapView
            elapsedSeconds={effectiveElapsed}
            showBoat={showBoat}
            followBoat={followBoat}
            onMarkerClick={onMarkerClick}
            passedStopIds={passedStopIds}
          />
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setShowAfterTripInfo((prev) => !prev)}
              className={`w-full py-3 px-4 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-95 ${
                showAfterTripInfo || isTripEnded
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30'
                  : 'bg-goral-800 text-goral-100 border-goral-600/80 hover:bg-goral-700/80 hover:border-goral-500'
              }`}
            >
              <Compass className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{showAfterTripInfo || isTripEnded ? texts.btnHideAfterTrip : texts.btnAfterTrip}</span>
            </button>
          </div>
        </div>

        {(isTripEnded || showAfterTripInfo) && (
          <div className="px-3 pb-4">
            <LesnicaEndCards t={t} />
          </div>
        )}
      </div>
    </section>
  );
}

function ModeButton({ active, onClick, icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
        active ? 'bg-river-500 text-white shadow-md' : 'text-goral-300 hover:text-goral-100'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
