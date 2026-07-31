import React from 'react';
import { MapPin, Headphones, Bike } from 'lucide-react';

export default function MobileFloatingBar({ t, onNavigateToLesnica }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="md:hidden fixed bottom-3 left-3 right-3 z-40">
      <div className="bg-goral-900/90 backdrop-blur-xl border-2 border-goral-600/70 rounded-2xl p-1.5 shadow-2xl flex items-center justify-around">
        <button
          type="button"
          onClick={() => scrollTo('trip-tracker-section')}
          className="flex-1 py-2 px-1 flex flex-col items-center gap-1 text-goral-200 hover:text-white active:scale-95 transition-all"
        >
          <MapPin className="w-5 h-5 text-river-400" />
          <span className="text-[11px] font-bold tracking-tight">
            {t?.nav_map || 'Mapa plavby'}
          </span>
        </button>

        <div className="w-px h-7 bg-goral-700/80" />

        <button
          type="button"
          onClick={() => scrollTo('stops-section')}
          className="flex-1 py-2 px-1 flex flex-col items-center gap-1 text-goral-200 hover:text-white active:scale-95 transition-all"
        >
          <Headphones className="w-5 h-5 text-amber-400" />
          <span className="text-[11px] font-bold tracking-tight">
            {t?.nav_audio || 'Audio sprievodca'}
          </span>
        </button>

        <div className="w-px h-7 bg-goral-700/80" />

        <button
          type="button"
          onClick={() => {
            if (onNavigateToLesnica) {
              onNavigateToLesnica();
            }
            scrollTo('trip-tracker-section');
          }}
          className="flex-1 py-2 px-1 flex flex-col items-center gap-1 text-goral-200 hover:text-white active:scale-95 transition-all"
        >
          <Bike className="w-5 h-5 text-emerald-400" />
          <span className="text-[11px] font-bold tracking-tight">
            {t?.nav_lesnica || 'Lesnica tipy'}
          </span>
        </button>
      </div>
    </div>
  );
}
