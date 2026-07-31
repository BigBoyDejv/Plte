import { useState, useEffect } from 'react';
import { CheckSquare, Square, CheckCircle2 } from 'lucide-react';

const STORAGE_KEY = () => `dunajec_admin_checklist_${new Date().toISOString().slice(0, 10)}`;

const INITIAL_ITEMS = [
  { id: 'vests', text: 'Skontrolovať záchranné vesty & veslá na plti', done: false },
  { id: 'shmu', text: 'Skontrolovať hladinu Dunajca a počasie (SHMÚ stanica 7950)', done: false },
  { id: 'phone', text: 'Nabiť mobil & spustiť PWA sledovanie plavby', done: false },
  { id: 'cash', text: 'Pripraviť hotovosť na vydávanie (EUR & PLN)', done: false },
  { id: 'seats', text: 'Vyčistiť a pripraviť lavičky pre turistov', done: false },
];

export default function PltnikChecklistCard() {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY());
      return raw ? JSON.parse(raw) : INITIAL_ITEMS;
    } catch {
      return INITIAL_ITEMS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY(), JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const toggleItem = (id) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const completedCount = items.filter((i) => i.done).length;
  const isAllDone = completedCount === items.length;

  return (
    <div className="bg-goral-800/90 border border-goral-600/70 rounded-2xl p-4 sm:p-5 shadow-xl text-goral-50">
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-goral-700/80">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-forest-500/20 border border-forest-400/30 flex items-center justify-center text-forest-300">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-folk font-bold text-base text-white">Denný Checklist pltníka</h3>
            <p className="text-goral-400 text-xs">Kontrola pred prvým splavom</p>
          </div>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
          isAllDone
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            : 'bg-goral-700 text-goral-300 border-goral-600'
        }`}>
          {completedCount} / {items.length} hotovo
        </span>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => toggleItem(item.id)}
            className={`w-full text-left p-3 rounded-xl border text-xs font-semibold flex items-center gap-3 transition-all ${
              item.done
                ? 'bg-emerald-950/30 border-emerald-600/40 text-emerald-300 line-through opacity-85'
                : 'bg-goral-900/60 border-goral-700/70 text-goral-100 hover:border-goral-500'
            }`}
          >
            {item.done ? (
              <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <Square className="w-4 h-4 text-goral-400 shrink-0" />
            )}
            <span className="flex-1">{item.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
