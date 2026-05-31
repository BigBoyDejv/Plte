import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Square, RotateCcw, Lock, ArrowLeft, AlertCircle } from 'lucide-react';
import {
  adminTripAction,
  isTripSyncConfigured,
  saveTripSyncUrl,
  getTripSyncUrl,
  ADMIN_PIN,
} from '@/lib/tripSync';
import { useLiveTrip } from '@/contexts/LiveTripContext';
import { formatTripTime } from '@/data/routeData';

export default function Admin() {
  const { tripState, tripActive, tripRunning, elapsedSeconds, refresh } = useLiveTrip();
  const [pin, setPin] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [syncUrl, setSyncUrl] = useState(() => getTripSyncUrl());
  const [configured, setConfigured] = useState(() => isTripSyncConfigured());

  const handleSaveSyncUrl = (e) => {
    e.preventDefault();
    setError('');
    try {
      saveTripSyncUrl(syncUrl);
      setConfigured(true);
      setMessage('URL uložená. Teraz sa prihláste PINom.');
    } catch (err) {
      setError(err.message || 'Neplatná URL');
    }
  };

  const tryUnlock = (e) => {
    e.preventDefault();
    const expected = ADMIN_PIN || import.meta.env.VITE_ADMIN_PIN;
    if (!expected) {
      setError('Nastavte VITE_ADMIN_PIN v .env súbore');
      return;
    }
    if (pin === expected) {
      setUnlocked(true);
      setError('');
    } else {
      setError('Nesprávny PIN');
    }
  };

  const runAction = async (action) => {
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const expected = ADMIN_PIN || import.meta.env.VITE_ADMIN_PIN;
      await adminTripAction(action, expected || pin);
      await refresh();
      const labels = {
        start: tripActive ? 'Plavba pokračuje.' : 'Plavba spustená – všetci návštevníci uvidia živú mapu.',
        stop: 'Plavba pozastavená.',
        reset: 'Plavba vynulovaná.',
      };
      setMessage(labels[action] || 'Hotovo');
    } catch (err) {
      setError(err.message || 'Akcia zlyhala');
    } finally {
      setLoading(false);
    }
  };

  if (!configured) {
    return (
      <div className="min-h-screen bg-goral-900 text-goral-100 p-4 flex flex-col">
        <AdminHeader />
        <form
          onSubmit={handleSaveSyncUrl}
          className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full gap-4 py-8"
        >
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
            <h1 className="text-xl font-bold">URL synchronizácie</h1>
            <p className="text-goral-300 text-sm mt-2 leading-relaxed">
              V Google Apps Script: <strong>Nasadiť → Webová aplikácia</strong>, skopírujte
              URL končiace na <code className="text-river-300">/exec</code> a vložte sem
              (stačí raz).
            </p>
          </div>
          <input
            type="url"
            value={syncUrl}
            onChange={(e) => setSyncUrl(e.target.value)}
            placeholder="https://script.google.com/macros/s/.../exec"
            className="w-full px-4 py-3 rounded-xl bg-goral-800 border-2 border-goral-600 text-sm"
            autoComplete="off"
          />
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          {message && <p className="text-green-400 text-sm text-center">{message}</p>}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-river-500 hover:bg-river-600 font-bold text-white"
          >
            Uložiť a pokračovať
          </button>
        </form>
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-goral-900 text-goral-100 p-4">
        <AdminHeader />
        <form onSubmit={tryUnlock} className="max-w-sm mx-auto mt-16 space-y-4">
          <div className="text-center mb-6">
            <Lock className="w-10 h-10 mx-auto text-goral-400 mb-2" />
            <h1 className="text-2xl font-folk font-bold">Ovládanie plavby</h1>
            <p className="text-goral-400 text-sm mt-1">Len pre pltníka / organizátora</p>
          </div>
          <input
            type="password"
            inputMode="numeric"
            autoComplete="current-password"
            placeholder="Admin PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-goral-800 border-2 border-goral-600 text-center text-lg tracking-widest"
          />
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-river-500 hover:bg-river-600 font-bold text-white"
          >
            Prihlásiť
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-goral-900 text-goral-100 p-4 pb-8">
      <AdminHeader />

      <div className="max-w-md mx-auto mt-6 space-y-6">
        <div className="rounded-2xl bg-goral-800 border border-goral-600 p-4">
          <p className="text-goral-400 text-xs uppercase">Stav</p>
          <p className="text-2xl font-bold mt-1">
            {tripRunning ? '🟢 Prebieha' : tripActive ? '🟡 Pozastavená' : '⚪ Neaktívna'}
          </p>
          {tripActive && (
            <p className="text-river-300 font-mono mt-2">
              Čas: {formatTripTime(elapsedSeconds)}
            </p>
          )}
          {tripState?.tripId && (
            <p className="text-goral-500 text-xs mt-2 truncate">ID: {tripState.tripId}</p>
          )}
        </div>

        <div className="grid gap-3">
          <ActionButton
            icon={<Play className="w-6 h-6" />}
            label={tripActive ? "Pokračovať v plavbe" : "Štart plavby"}
            sub={tripActive ? "Pokračovať tam, kde sa skončilo" : "Všetkým sa spustí živá mapa"}
            color="bg-green-600 hover:bg-green-700"
            disabled={loading || tripRunning}
            onClick={() => runAction('start')}
          />
          <ActionButton
            icon={<Square className="w-6 h-6" />}
            label="Pozastaviť"
            sub="Mapa ostane, čas sa zastaví"
            color="bg-amber-600 hover:bg-amber-700"
            disabled={loading || !tripRunning}
            onClick={() => runAction('stop')}
          />
          <ActionButton
            icon={<RotateCcw className="w-6 h-6" />}
            label="Reset"
            sub="Vynulovať pred ďalšou plavbou"
            color="bg-goral-700 hover:bg-goral-600 border border-goral-50"
            disabled={loading}
            onClick={() => {
              if (window.confirm('Naozaj resetovať plavbu?')) runAction('reset');
            }}
          />
        </div>

        {message && (
          <p className="text-green-400 text-sm text-center bg-green-950/50 rounded-xl py-3 px-4">
            {message}
          </p>
        )}
        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        <p className="text-goral-500 text-xs text-center leading-relaxed">
          Návštevníci nemusia inštalovať aplikáciu – stačí mať otvorenú stránku v prehliadači.
          Pri štarte sa im automaticky obnoví poloha lode každé 3 sekundy.
        </p>
      </div>
    </div>
  );
}

function AdminHeader() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-3 max-w-md mx-auto">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-goral-300 hover:text-white text-sm bg-transparent border-none cursor-pointer p-0 font-body"
      >
        <ArrowLeft className="w-4 h-4" />
        Späť
      </button>
    </div>
  );
}

function ActionButton({ icon, label, sub, color, disabled, onClick }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl text-white font-semibold transition-opacity ${color} disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {icon}
      <div className="text-left">
        <div className="text-lg">{label}</div>
        <div className="text-xs font-normal opacity-80">{sub}</div>
      </div>
    </button>
  );
}
