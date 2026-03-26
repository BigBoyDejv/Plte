import { useState } from 'react';
import translations from '../lib/translations';
import HeroSection from '../components/HeroSection';
import StopCard from '../components/StopCard';
import TipSection from '../components/TipSection';
import FolkDivider from '../components/FolkDivider';

const stopImages = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Czerwony_Klasztor_01.jpg/1280px-Czerwony_Klasztor_01.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Dunajec_-_panoramio_%281%29.jpg/1280px-Dunajec_-_panoramio_%281%29.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Przełom_Dunajca_BM.jpg/1280px-Przełom_Dunajca_BM.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Dunajec_Gorge_in_Pieniny_Mountains.jpg/1280px-Dunajec_Gorge_in_Pieniny_Mountains.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Pieniny_-_Dunajec_01.jpg/1280px-Pieniny_-_Dunajec_01.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Szczawnica_-_center.jpg/1280px-Szczawnica_-_center.jpg",
];

export default function Home() {
  const [lang, setLang] = useState('sk');
  const t = translations[lang];
  const isRtl = t.rtl || false;
  const dir = isRtl ? 'rtl' : 'ltr';

  const stops = [
    { title: t.stop1_title, desc: t.stop1_desc },
    { title: t.stop2_title, desc: t.stop2_desc },
    { title: t.stop3_title, desc: t.stop3_desc },
    { title: t.stop4_title, desc: t.stop4_desc },
    { title: t.stop5_title, desc: t.stop5_desc },
    { title: t.stop6_title, desc: t.stop6_desc },
  ];

  return (
    <div className="min-h-screen bg-goral-50 font-body" dir={dir}>
      <header className="sticky top-0 z-30 bg-goral-900/95 backdrop-blur-xl border-b-2 border-goral-600/50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-7 h-7 text-river-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 12c1.5-2 3.5-3 5.5-3s4 1 5.5 3c1.5-2 3.5-3 5.5-3s4 1 5.5 3" strokeLinecap="round" />
              <path d="M2 17c1.5-2 3.5-3 5.5-3s4 1 5.5 3c1.5-2 3.5-3 5.5-3s4 1 5.5 3" strokeLinecap="round" opacity="0.5" />
              <path d="M2 7c1.5-2 3.5-3 5.5-3s4 1 5.5 3c1.5-2 3.5-3 5.5-3s4 1 5.5 3" strokeLinecap="round" opacity="0.5" />
            </svg>
            <span className="text-goral-100 font-water text-xl hidden sm:block">Dunajec</span>
          </div>
          <LangSelectorInHeader currentLang={lang} onChangeLang={setLang} />
        </div>
      </header>

      <HeroSection t={t} currentLang={lang} onChangeLang={setLang} isRtl={isRtl} />

      <div className="h-8 bg-goral-800 folk-pattern" />

      <section className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-folk font-bold text-goral-900 tracking-wide mb-4">
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
              return (
                <div key={idx} className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-start relative">
                  <div className="absolute left-1/2 -translate-x-1/2 z-10 hidden lg:flex items-center justify-center top-8">
                    <div className="w-6 h-6 bg-goral-500 rounded-full border-4 border-goral-50 shadow-lg" />
                    <div className="absolute w-10 h-10 bg-goral-400/30 rounded-full animate-ripple" />
                  </div>
                  {isLeft ? (
                    <>
                      <div className="lg:pr-12">
                        <StopCard index={idx} title={stop.title} description={stop.desc} image={stopImages[idx]} lang={lang} t={t} dir={dir} />
                      </div>
                      <div className="hidden lg:block" />
                    </>
                  ) : (
                    <>
                      <div className="hidden lg:block" />
                      <div className="lg:pl-12">
                        <StopCard index={idx} title={stop.title} description={stop.desc} image={stopImages[idx]} lang={lang} t={t} dir={dir} />
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <TipSection t={t} isRtl={isRtl} />

      <footer className="bg-goral-900 border-t-2 border-goral-700 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <FolkDivider className="mb-6 opacity-40 justify-center" />
          <p className="text-goral-400 text-sm font-body">
            2026 Splavovanie Dunajca. Vsetky prava vyhradene.
          </p>
        </div>
      </footer>
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