import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Radio, Compass, ChevronRight } from 'lucide-react';
import MapView from './MapView';
import { useLiveTrip } from '@/contexts/LiveTripContext';
import {
  getLiveStopInfo,
  formatTripTime,
  TRIP_DURATION_SECONDS,
  totalTimeMinutes,
  visibleRoutePoints,
} from '@/data/routeData';

const MODE_LIVE = 'live';
const MODE_BROWSE = 'browse';

export default function TripTracker({ t, onMarkerClick, onLiveStopChange, focusedStop }) {
  const {
    tripActive,
    elapsedSeconds: liveElapsed,
    followLive,
    setFollowLive,
    syncError,
    syncConfigured,
  } = useLiveTrip();

  const [viewMode, setViewMode] = useState(MODE_LIVE);
  const [browseSeconds, setBrowseSeconds] = useState(0);
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
      }
    } else if (!followLive) {
      lastScrolledStopIndex.current = null;
    }
  }, [stopInfo.stopIndex, tripActive, followLive, onLiveStopChange, stopInfo.current?.name]);

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
          {syncConfigured && (
            <Link
              to="/admin"
              className="text-xs text-goral-300 hover:text-white underline underline-offset-2"
            >
              {texts.admin}
            </Link>
          )}
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
          <div className="px-3 pb-3">
            <div className="flex gap-1 p-1 bg-goral-800 rounded-xl">
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
        </div>


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
