import { useState, useEffect } from 'react';
import { Sun, CloudSun, Cloud, CloudRain, Thermometer } from 'lucide-react';

export default function WeatherBadge({ onClick }) {
  const [weather, setWeather] = useState({
    temp: 23,
    code: 0,
    loading: true,
  });

  useEffect(() => {
    let isMounted = true;
    async function fetchWeather() {
      try {
        // Open-Meteo API pre Červený Kláštor (lat: 49.390, lon: 20.400)
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=49.390&longitude=20.400&current=temperature_2m,weather_code&timezone=Europe%2FBratislava'
        );
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data?.current) {
            setWeather({
              temp: Math.round(data.current.temperature_2m),
              code: data.current.weather_code,
              loading: false,
            });
          }
        }
      } catch {
        if (isMounted) {
          setWeather((prev) => ({ ...prev, loading: false }));
        }
      }
    }
    fetchWeather();
    return () => {
      isMounted = false;
    };
  }, []);

  const getWeatherIcon = (code) => {
    if (code === 0 || code === 1) return <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 animate-pulse shrink-0" />;
    if (code === 2) return <CloudSun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0" />;
    if (code === 3) return <Cloud className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-goral-300 shrink-0" />;
    if (code >= 51) return <CloudRain className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-river-300 shrink-0" />;
    return <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />;
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 bg-goral-800/90 backdrop-blur-md text-goral-100 text-[11px] sm:text-xs font-semibold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-goral-600/60 shadow-lg hover:bg-goral-700/80 active:scale-95 transition-all shrink-0 cursor-pointer"
      title="Počasie a stav vody Červený Kláštor"
    >
      {getWeatherIcon(weather.code)}
      <div className="flex items-center gap-1">
        <span className="hidden min-[380px]:inline">Č. Kláštor</span>
        <span className="font-bold text-white font-mono">{weather.temp}°C</span>
      </div>
    </button>
  );
}

