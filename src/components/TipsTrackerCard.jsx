import { useState, useEffect, useMemo } from 'react';
import { Banknote, Plus, Trash2 } from 'lucide-react';

const STORAGE_KEY = 'dunajec_admin_tips_log_v1';

const CURRENCIES = {
  EUR: { label: 'EUR (€)', symbol: '€', rateToEur: 1.0 },
  PLN: { label: 'PLN (zł)', symbol: 'zł', rateToEur: 0.235 },
  USD: { label: 'USD ($)', symbol: '$', rateToEur: 0.92 },
  GBP: { label: 'GBP (£)', symbol: '£', rateToEur: 1.18 },
};

export default function TipsTrackerCard() {
  const [tipsList, setTipsList] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('EUR');
  const [note, setNote] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tipsList));
    } catch {
      /* ignore */
    }
  }, [tipsList]);

  const handleAddTip = (e) => {
    e.preventDefault();
    const val = parseFloat(amount.replace(',', '.'));
    if (!val || val <= 0) return;

    const rate = CURRENCIES[currency]?.rateToEur || 1.0;
    const eurEquivalent = Number((val * rate).toFixed(2));

    const newTip = {
      id: Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      timestamp: new Date().toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('sk-SK'),
      amount: val,
      currency,
      eurEquivalent,
      note: note.trim(),
    };

    setTipsList((prev) => [newTip, ...prev]);
    setAmount('');
    setNote('');
  };

  const handleDeleteTip = (id) => {
    setTipsList((prev) => prev.filter((t) => t.id !== id));
  };

  const totalEur = useMemo(() => {
    return tipsList.reduce((acc, item) => acc + (item.eurEquivalent || 0), 0).toFixed(2);
  }, [tipsList]);

  return (
    <div className="bg-goral-800/90 border border-goral-600/70 rounded-2xl p-4 sm:p-5 shadow-xl text-goral-50">
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-goral-700/80">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
            <Banknote className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-folk font-bold text-base text-white">Evidencia tringeltov</h3>
            <p className="text-goral-400 text-xs">EUR, PLN, USD, GBP → prepočet na EUR</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-goral-400 uppercase font-semibold">Celkovo zarobené</p>
          <p className="text-xl font-black text-amber-400 font-mono">{totalEur} €</p>
        </div>
      </div>

      {/* Formulár na prídanie tringeltu */}
      <form onSubmit={handleAddTip} className="space-y-3 mb-5 bg-goral-900/60 p-3.5 rounded-xl border border-goral-700/50">
        <div className="grid grid-cols-5 gap-2">
          <div className="col-span-3">
            <label className="block text-[11px] text-goral-300 mb-1">Suma</label>
            <input
              type="number"
              step="any"
              inputMode="decimal"
              placeholder="napr. 10 alebo 50"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-goral-800 border border-goral-600 text-white font-mono text-sm focus:outline-none focus:border-amber-400"
              required
            />
          </div>

          <div className="col-span-2">
            <label className="block text-[11px] text-goral-300 mb-1">Mena</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-2 py-2 rounded-lg bg-goral-800 border border-goral-600 text-amber-300 font-bold text-sm focus:outline-none focus:border-amber-400"
            >
              {Object.entries(CURRENCIES).map(([code, config]) => (
                <option key={code} value={code}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <input
            type="text"
            placeholder="Poznámka (voliteľné, napr. poľská skupina)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-goral-800 border border-goral-600/70 text-xs text-goral-200 placeholder-goral-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-goral-950 font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Zapísať tringelt</span>
        </button>
      </form>

      {/* Zoznam zapísaných tringeltov */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-goral-300 mb-2">
          História zápisov ({tipsList.length})
        </h4>

        {tipsList.length === 0 ? (
          <p className="text-xs text-goral-500 text-center py-4 bg-goral-900/40 rounded-xl border border-dashed border-goral-700/60">
            Zatiaľ nie sú zapísané žiadne tringelty.
          </p>
        ) : (
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {tipsList.map((tip) => (
              <div
                key={tip.id}
                className="flex items-center justify-between bg-goral-900/70 border border-goral-700/60 p-2.5 rounded-xl text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-300 font-mono text-sm">
                      {tip.amount} {CURRENCIES[tip.currency]?.symbol || tip.currency}
                    </span>
                    {tip.currency !== 'EUR' && (
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-mono">
                        ≈ {tip.eurEquivalent} €
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-goral-400 mt-0.5">
                    {tip.date} {tip.timestamp} {tip.note ? `• ${tip.note}` : ''}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteTip(tip.id)}
                  className="text-goral-500 hover:text-red-400 p-1.5 rounded-lg transition-all"
                  title="Zmazať zápis"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
