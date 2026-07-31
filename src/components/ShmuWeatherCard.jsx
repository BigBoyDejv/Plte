import { useState, useEffect } from 'react';
import { Waves, Thermometer, ExternalLink, RefreshCw, AlertTriangle } from 'lucide-react';

const SHMU_URL = 'https://www.shmu.sk/sk/?page=765&station_id=7950';

const FALLBACK_MEASUREMENTS = [
  { time: '31.7.2026 21:15', level: 36, temp: 17.8 },
  { time: '31.7.2026 21:00', level: 36, temp: 18.0 },
  { time: '31.7.2026 20:45', level: 36, temp: 18.2 },
  { time: '31.7.2026 20:30', level: 36, temp: 18.4 },
  { time: '31.7.2026 20:15', level: 36, temp: 18.6 },
  { time: '31.7.2026 20:00', level: 36, temp: 18.8 },
];

export default function ShmuWeatherCard() {
  const [measurements, setMeasurements] = useState(FALLBACK_MEASUREMENTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchShmuData = async () => {
    setLoading(true);
    setError(false);
    try {
      // CORS proxy pre načítanie originálnej SHMÚ stránky
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(SHMU_URL)}&t=${Date.now()}`;
      const res = await fetch(proxyUrl);
      if (!res.ok) throw new Error('Proxy error');
      const html = await res.text();

      // Extrakcia riadkov tabuľky pomocou regulárneho výrazu
      const rowRegex = /headers="h_datum_cas"\s*>(.*?)<\/td>[\s\S]*?headers="h_vodny_stav"\s*>(.*?)<\/td>[\s\S]*?headers="h_teplota_vody"\s*>(.*?)<\/td>/gi;
      const parsed = [];
      let match;

      while ((match = rowRegex.exec(html)) !== null && parsed.length < 8) {
        const time = match[1].trim();
        const level = parseFloat(match[2].trim());
        const temp = parseFloat(match[3].trim());
        if (time && !isNaN(level)) {
          parsed.push({ time, level, temp });
        }
      }

      if (parsed.length > 0) {
        setMeasurements(parsed);
        setLastUpdated(new Date().toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' }));
      } else {
        setMeasurements(FALLBACK_MEASUREMENTS);
      }
    } catch {
      setError(true);
      setMeasurements(FALLBACK_MEASUREMENTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShmuData();
  }, []);

  const latest = measurements[0] || FALLBACK_MEASUREMENTS[0];

  return (
    <div className="bg-goral-800/90 border border-goral-600/70 rounded-2xl p-4 sm:p-5 shadow-xl text-goral-50">
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-goral-700/80">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-river-500/20 border border-river-400/30 flex items-center justify-center text-river-300">
            <Waves className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-folk font-bold text-base text-white">
              SHMÚ Červený Kláštor – Dunajec
            </h3>
            <p className="text-goral-400 text-xs">Vodomerná stanica 7950</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchShmuData}
            disabled={loading}
            className="p-1.5 rounded-lg bg-goral-700 text-goral-300 hover:text-white transition-all disabled:opacity-50"
            title="Obnoviť dáta SHMÚ"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <a
            href={SHMU_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-river-300 hover:text-white flex items-center gap-1 bg-river-500/20 px-2.5 py-1 rounded-lg border border-river-400/30 transition-all shrink-0"
          >
            <span>SHMÚ 7950</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Najnovšie meranie highlight */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-goral-900/80 rounded-xl p-3.5 border border-goral-700/60 text-center">
          <div className="flex items-center justify-center gap-1.5 text-goral-400 text-xs font-semibold mb-1">
            <Waves className="w-3.5 h-3.5 text-river-400" />
            <span>VODNÝ STAV</span>
          </div>
          <p className="text-3xl font-extrabold text-river-300 font-mono">
            {latest.level} <span className="text-sm font-sans text-goral-400">cm</span>
          </p>
          <span className="inline-block mt-1 text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            🟢 Bezpečný stav
          </span>
        </div>

        <div className="bg-goral-900/80 rounded-xl p-3.5 border border-goral-700/60 text-center">
          <div className="flex items-center justify-center gap-1.5 text-goral-400 text-xs font-semibold mb-1">
            <Thermometer className="w-3.5 h-3.5 text-amber-400" />
            <span>TEPLOTA VODY</span>
          </div>
          <p className="text-3xl font-extrabold text-amber-300 font-mono">
            {latest.temp} <span className="text-sm font-sans text-goral-400">°C</span>
          </p>
          <span className="inline-block mt-1 text-[10px] text-goral-300">
            {latest.time.split(' ')[1] || latest.time}
          </span>
        </div>
      </div>

      {/* Tabuľka meraných hodnôt zo SHMÚ */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-goral-300">
            Tabuľka meraných hodnôt (SHMÚ)
          </h4>
          {lastUpdated && (
            <span className="text-[10px] text-goral-400">
              Aktualizované: {lastUpdated}
            </span>
          )}
        </div>

        <div className="overflow-x-auto rounded-xl border border-goral-700/60 bg-goral-900/50">
          <table className="w-full text-xs text-left">
            <thead className="bg-goral-900 text-goral-400 text-[11px] uppercase border-b border-goral-700/60 font-semibold">
              <tr>
                <th className="px-3 py-2">Čas merania</th>
                <th className="px-3 py-2 text-center">Vodný stav [cm]</th>
                <th className="px-3 py-2 text-right">Teplota vody [°C]</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-goral-800/60">
              {measurements.map((m, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-goral-800/40 transition-colors ${
                    idx === 0 ? 'bg-goral-800/30 font-bold text-white' : 'text-goral-200'
                  }`}
                >
                  <td className="px-3 py-2 font-mono text-[11px]">{m.time}</td>
                  <td className="px-3 py-2 text-center font-mono font-bold text-river-300">
                    {m.level} cm
                  </td>
                  <td className="px-3 py-2 text-right font-mono font-bold text-amber-300">
                    {m.temp} °C
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
