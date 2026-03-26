import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import translations from '../lib/translations';

const langList = Object.keys(translations);

export default function LanguageSelector({ currentLang, onChangeLang }) {
  const [open, setOpen] = useState(false);
  const current = translations[currentLang];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-goral-800/60 backdrop-blur-md border border-goral-400/30 rounded-lg px-4 py-2 text-goral-100 hover:bg-goral-700/60 transition-all"
      >
        <span className="text-xs font-bold font-body bg-goral-500/30 rounded px-1.5 py-0.5">{current.flag}</span>
        <span className="text-sm font-medium font-body hidden sm:block">{current.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 z-50 bg-goral-900/95 backdrop-blur-md rounded-xl border border-goral-600/50 shadow-2xl overflow-hidden min-w-[170px]"
            >
              {langList.map((code) => {
                const lang = translations[code];
                return (
                  <button
                    key={code}
                    onClick={() => { onChangeLang(code); setOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-body flex items-center gap-3 transition-colors
                      ${code === currentLang
                        ? 'bg-goral-700 text-goral-100 font-semibold'
                        : 'text-goral-300 hover:bg-goral-800 hover:text-goral-100'
                      }`}
                  >
                    <span className="text-xs font-mono w-5 text-center opacity-70">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}