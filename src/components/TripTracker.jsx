import { useState, useEffect } from 'react';
import MapView from './MapView';

export default function TripTracker({ t }) {
    const [isActive, setIsActive] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [startTime, setStartTime] = useState(null);

    // Načítanie uloženého stavu
    useEffect(() => {
        const saved = localStorage.getItem('tripState');
        if (saved) {
            const { active, start, elapsed } = JSON.parse(saved);
            if (active && start) {
                const newElapsed = Math.floor((Date.now() - start) / 1000);
                if (newElapsed < 5400) { // 90 minút
                    setIsActive(true);
                    setStartTime(start);
                    setElapsedTime(newElapsed);
                }
            }
        }
    }, []);

    // Ukladanie stavu
    useEffect(() => {
        if (isActive && startTime) {
            localStorage.setItem('tripState', JSON.stringify({
                active: true,
                start: startTime,
                elapsed: elapsedTime
            }));
        } else {
            localStorage.removeItem('tripState');
        }
    }, [isActive, startTime, elapsedTime]);

    // Timer
    useEffect(() => {
        let interval;
        if (isActive) {
            interval = setInterval(() => {
                const newElapsed = Math.floor((Date.now() - startTime) / 1000);
                if (newElapsed >= 5400) { // 90 minút
                    setIsActive(false);
                    setElapsedTime(5400);
                } else {
                    setElapsedTime(newElapsed);
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive, startTime]);

    const startTrip = () => {
        const now = Date.now();
        setStartTime(now);
        setIsActive(true);
        setElapsedTime(0);
    };

    const resetTrip = () => {
        setIsActive(false);
        setStartTime(null);
        setElapsedTime(0);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = Math.min(100, (elapsedTime / 5400) * 100);

    return (
        <div className="bg-goral-800/80 backdrop-blur-md rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-goral-100 font-bold">{t?.trip_tracker || "Sledovanie plavby"}</h3>
                {!isActive ? (
                    <button
                        onClick={startTrip}
                        className="bg-river-500 hover:bg-river-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                    >
                        {t?.start_trip || "Štart plavby"}
                    </button>
                ) : (
                    <button
                        onClick={resetTrip}
                        className="bg-goral-600 hover:bg-goral-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                        {t?.reset_trip || "Reset"}
                    </button>
                )}
            </div>

            {isActive && (
                <>
                    <div className="mb-2">
                        <div className="flex justify-between text-goral-300 text-xs mb-1">
                            <span>{t?.time_elapsed || "Uplynulý čas"}</span>
                            <span>{formatTime(elapsedTime)} / 90:00</span>
                        </div>
                        <div className="h-2 bg-goral-700 rounded-full overflow-hidden">
                            <div className="h-full bg-river-400 rounded-full" style={{ width: `${progress}%` }} />
                        </div>
                    </div>

                    {/* MAPA */}
                    <MapView elapsedTime={elapsedTime} isActive={isActive} />

                    <div className="mt-3 text-center text-goral-300 text-xs">
                        {t?.map_hint || "Loď sa pohybuje po mape podľa času plavby"}
                    </div>
                </>
            )}
        </div>
    );
}