import { useState, useRef, useCallback, useEffect } from 'react';
import translations from '../lib/translations';
import HeroSection from '../components/HeroSection';
import StopCard from '../components/StopCard';
import TipSection from '../components/TipSection';
import FolkDivider from '../components/FolkDivider';
import TripTracker from '../components/TripTracker';
import Reviews from '../components/Reviews';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';
import InstallButton from '../components/InstallButton';
import OfflineStatus from '../components/OfflineStatus';
import WeatherBadge from '../components/WeatherBadge';
import AnimatedRiverWave from '../components/AnimatedRiverWave';
import MobileFloatingBar from '../components/MobileFloatingBar';
import DarkModeToggle from '../components/DarkModeToggle';
import { stopImages } from '../data/offlineAssets';
import { useLiveTrip } from '../contexts/LiveTripContext';
import { visibleRoutePoints } from '../data/routeData';

export default function Home() {
  const { tripActive } = useLiveTrip();
  const [lang, setLang] = useState('sk');
  const t = translations[lang];
  const isRtl = t.rtl || false;
  const dir = isRtl ? 'rtl' : 'ltr';
  const [highlightedStop, setHighlightedStop] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const stopRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      const trackerEl = document.getElementById('trip-tracker-section');
      if (trackerEl) {
        const rect = trackerEl.getBoundingClientRect();
        setShowScrollTop(rect.bottom < 0);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stops = Array.from({ length: 21 }, (_, i) => {
    const num = i + 1;
    return {
      title: t?.[`stop${num}_title`] || translations.sk[`stop${num}_title`] || `Zastavenie ${num}`,
      desc: t?.[`stop${num}_desc`] || translations.sk[`stop${num}_desc`] || '',
    };
  });

  const scrollToStopIndex = useCallback((stopIndex) => {
    const index = stopIndex - 1;
    if (stopRefs.current[index]) {
      setHighlightedStop(stopIndex);
      setTimeout(() => setHighlightedStop(null), 2500);
      stopRefs.current[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const scrollToStop = useCallback((pointId, stopName) => {
    const fromMap = visibleRoutePoints.find((p) => p.id === pointId);
    if (fromMap) {
      const idx = visibleRoutePoints.indexOf(fromMap) + 1;
      scrollToStopIndex(idx);
      return;
    }
    if (typeof pointId === 'number' && pointId >= 1 && pointId <= 21) {
      scrollToStopIndex(pointId);
    }
  }, [scrollToStopIndex]);

  return (
    <div className="min-h-screen bg-goral-50 dark:bg-[#160f0a] text-goral-900 dark:text-goral-100 transition-colors duration-300 font-body pb-16 md:pb-0" dir={dir}>
      <header className="sticky top-0 z-30 bg-goral-900/95 backdrop-blur-xl border-b-2 border-goral-600/50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <svg className="w-7 h-7 text-river-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 12c1.5-2 3.5-3 5.5-3s4 1 5.5 3c1.5-2 3.5-3 5.5-3s4 1 5.5 3" strokeLinecap="round" />
              <path d="M2 17c1.5-2 3.5-3 5.5-3s4 1 5.5 3c1.5-2 3.5-3 5.5-3s4 1 5.5 3" strokeLinecap="round" opacity="0.5" />
              <path d="M2 7c1.5-2 3.5-3 5.5-3s4 1 5.5 3c1.5-2 3.5-3 5.5-3s4 1 5.5 3" strokeLinecap="round" opacity="0.5" />
            </svg>
            <span className="text-goral-100 font-water text-xl hidden sm:block">Dunajec</span>
            {tripActive && (
              <span className="sm:hidden inline-flex items-center gap-1 bg-river-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                LIVE
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 sm:gap-3">
            <WeatherBadge />
            <DarkModeToggle />
            <InstallButton t={t} />
            <LangSelectorInHeader currentLang={lang} onChangeLang={setLang} />
          </div>
        </div>
      </header>

      <HeroSection t={t} />
      <AnimatedRiverWave />
      <div id="trip-tracker-section" className="mt-2 sm:mt-4">
        <TripTracker
          t={t}
          onMarkerClick={scrollToStop}
          onLiveStopChange={scrollToStopIndex}
        />
      </div>

      <div className="h-8 bg-goral-800 folk-pattern" />

      <section id="stops-section" className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-folk font-bold text-goral-900 dark:text-goral-100 tracking-wide mb-4">

            {t.stops_title}
          </h2>
          <FolkDivider className="justify-center" />
        </div>

        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-1 hidden lg:block overflow-hidden rounded-full">
            <div className="w-full h-full flow-line" />
          </div>

          <div className="space-y-10 sm:space-y-16">
            {stops.map((stop, idx) => {
              const isLeft = idx % 2 === 0;
              const isHighlighted = highlightedStop === idx + 1;
              return (
                <div
                  key={idx}
                  ref={el => stopRefs.current[idx] = el}
                  className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-start relative transition-all duration-500 scroll-mt-36 sm:scroll-mt-48"
                  style={isHighlighted ? {
                    animation: 'highlightPulse 0.5s ease-in-out'
                  } : {}}
                >
                  <div className="absolute left-1/2 -translate-x-1/2 z-10 hidden lg:flex items-center justify-center top-8">
                    <div className="w-6 h-6 bg-goral-500 rounded-full border-4 border-goral-50 shadow-lg" />
                    <div className="absolute w-10 h-10 bg-goral-400/30 rounded-full animate-ripple" />
                  </div>
                  {isLeft ? (
                    <>
                      <div className="lg:pr-12">
                        <div className={`transition-all duration-500 ${isHighlighted ? 'ring-4 ring-river-400 shadow-xl scale-[1.02] rounded-2xl' : ''}`}>
                          <StopCard index={idx} title={stop.title} description={stop.desc} image={stopImages[idx]} lang={lang} t={t} dir={dir} />
                        </div>
                      </div>
                      <div className="hidden lg:block" />
                    </>
                  ) : (
                    <>
                      <div className="hidden lg:block" />
                      <div className="lg:pl-12">
                        <div className={`transition-all duration-500 ${isHighlighted ? 'ring-4 ring-river-400 shadow-xl scale-[1.02] rounded-2xl' : ''}`}>
                          <StopCard index={idx} title={stop.title} description={stop.desc} image={stopImages[idx]} lang={lang} t={t} dir={dir} />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <TipSection t={t} isRtl={isRtl} lang={lang} />
      <Reviews t={t} />
      <Chatbot t={t} lang={lang} />
      <Footer />
      <OfflineStatus t={t} />

      <MobileFloatingBar t={t} />
    </div>
  );
}

function LangSelectorInHeader({ currentLang, onChangeLang }) {
  const [open, setOpen] = useState(false);
  const t = translations[currentLang];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-goral-800/60 backdrop-blur-md border border-goral-400/30 rounded-lg px-4 py-2 text-goral-100 hover:bg-goral-700/60 transition-all"
      >
        <span className="text-xs font-bold font-body bg-goral-500/30 rounded px-1.5 py-0.5">{t.flag}</span>
        <span className="text-sm font-medium font-body hidden sm:block">{t.name}</span>
        <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 bg-goral-900/95 backdrop-blur-md rounded-xl border border-goral-600/50 shadow-2xl overflow-hidden min-w-[170px]">
            {Object.keys(translations).map((code) => {
              const lang = translations[code];
              return (
                <button
                  key={code}
                  onClick={() => { onChangeLang(code); setOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm font-body flex items-center gap-3 transition-colors ${code === currentLang ? 'bg-goral-700 text-goral-100 font-semibold' : 'text-goral-300 hover:bg-goral-800 hover:text-goral-100'
                    }`}
                >
                  <span className="text-xs font-mono w-5 text-center opacity-70">{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}