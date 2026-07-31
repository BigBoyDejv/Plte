import { useState, useEffect } from 'react';
import { Compass, Plus, Minus, RotateCcw } from 'lucide-react';

const TODAY_KEY = () => `dunajec_trips_today_${new Date().toISOString().slice(0, 10)}`;
const TOTAL_KEY = 'dunajec_trips_total';

export default function TripCounterCard() {
  const [todayCount, setTodayCount] = useState(() => {
    try {
      return Number(localStorage.getItem(TODAY_KEY())) || 0;
    } catch {
      return 0;
    }
  });

  const [totalCount, setTotalCount] = useState(() => {
    try {
      return Number(localStorage.getItem(TOTAL_KEY)) || 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(TODAY_KEY(), String(todayCount));
      localStorage.setItem(TOTAL_KEY, String(totalCount));
    } catch {
      /* ignore */
    }
  }, [todayCount, totalCount]);

  const addTrip = () => {
    setTodayCount((prev) => prev + 1);
    setTotalCount((prev) => prev + 1);
  };

  const removeTrip = () => {
    setTodayCount((prev) => Math.max(0, prev - 1));
    setTotalCount((prev) => Math.max(0, prev - 1));
  };

  const resetToday = () => {
    if (window.confirm('Naozaj vynulovať dnešné počítadlo jazd?')) {
      setTodayCount(0);
    }
  };

  return (
    <div className="bg-goral-800/90 border border-goral-600/70 rounded-2xl p-4 sm:p-5 shadow-xl text-goral-50">
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-goral-700/80">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-folk font-bold text-base text-white">Počítadlo plavieb (Jázd)</h3>
            <p className="text-goral-400 text-xs">Evidencia absolvovaných splavov</p>
          </div>
        </div>
        <button
          type="button"
          onClick={resetToday}
          className="text-goral-400 hover:text-white p-1.5 rounded-lg hover:bg-goral-700 transition-all"
          title="Resetovať dnešné počítadlo"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-goral-900/60 rounded-xl p-3.5 border border-goral-700/50 text-center">
          <p className="text-goral-400 text-xs uppercase font-semibold">Dnes plavieb</p>
          <p className="text-3xl font-extrabold text-emerald-400 font-mono mt-1">{todayCount}</p>
        </div>

        <div className="bg-goral-900/60 rounded-xl p-3.5 border border-goral-700/50 text-center">
          <p className="text-goral-400 text-xs uppercase font-semibold">Celkovo plavieb</p>
          <p className="text-3xl font-extrabold text-river-300 font-mono mt-1">{totalCount}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={removeTrip}
          className="flex-1 py-2.5 px-3 bg-goral-700 hover:bg-goral-600 text-goral-200 hover:text-white font-bold text-sm rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95"
        >
          <Minus className="w-4 h-4" />
          <span>-1 plavba</span>
        </button>

        <button
          type="button"
          onClick={addTrip}
          className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+1 plavba</span>
        </button>
      </div>
    </div>
  );
}
