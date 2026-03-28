import { useState, useRef } from 'react';
import translations from '../lib/translations';
import HeroSection from '../components/HeroSection';
import StopCard from '../components/StopCard';
import TipSection from '../components/TipSection';
import FolkDivider from '../components/FolkDivider';
import TripTracker from '../components/TripTracker';
import Reviews from '../components/Reviews';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';
import InstallButton from '../components/InstallButton';

const stopImages = [
  "https://www.plte-dunajec.sk/images/plte_dunajec.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9yfB2LjruSx-CLZ8nGPgH32zzLrQwCzfLmrMNcUDZEO56NzfCbw4x8VJTZ--P9DxJlIM6Ae8p1VmYgIoYrDZGRiW96IFknaDUl7MMKH8&s=10",
  "https://goralskydvor.sk/wp-content/uploads/2018/03/22950804.jpg",
  "https://www.trzykorony.pl/files/page_content/big/153086332715b3f1edf27677966172628.webp",
  "https://i.postimg.cc/jSzkNcYw/Snimka-obrazovky-2026-03-26-025805.png",
  "https://cdn.seeandgo.sk/images/photoarchive/sized/700/2016/06/07/lavka01.jpg",
  "https://malevelkecesty.sk/wp-content/uploads/2020/09/IMG-6296-970x658.jpg",
  "https://lh3.googleusercontent.com/gps-cs-s/AHVAwerlmH3nTkD8BU5AqMv46wvRwHJ2lGOQGGp9l-HUSgXvb1zPzko1iKq4esS6l3eKPJl5kdSgvJOcdOT3iIJz9xl0I7rDsyTer7JQTNLDDNnHn1DQQViF36JhoxxIsZ7sLZIWC7escw=w810-h468-n-k-no",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Pieniny_Ostra_Skala_1.jpg/4000px-Pieniny_Ostra_Skala_1.jpg",
  "https://greenfilmtourism.eu/upload/inspiracje/SKPINS/SK_P_INS01.jpg",
  "https://antiquavilla.sk/wp-content/uploads/2024/06/WhatsApp-Image-2021-07-01-at-11.06.12-1.jpeg",
  "https://i.ytimg.com/vi/ZlvWur_7JrQ/hqdefault.jpg",
  "https://files.slovakia.travel/_processed_/csm_Prielom%2520Dunajca%2520Icon%2520003_0c45a0baf2.jpg",
  "https://vylety.online/wp-content/uploads/2020/11/20120527_1205_0580-768x512.jpg",
  "https://img.projektn.sk/wp-static/2025/07/IMG8616.jpg?w=640&fm=jpg&q=85",
  "https://images-sp.summitpost.org/tr:e-sharpen,e-contrast-1,fit-max,q-60,w-500/823163.jpg",
  "https://www.tatrysimi.sk/wp-content/uploads/2020/05/Dravy-dunajec.jpg",
  "https://img.freepik.com/premium-photo/dunajec-river-gorge-pieniny-national-park-spring-poland_643825-1561.jpg",
  "https://cdn-5c6ca782f911ca1b2cef5e4c.closte.com/wp-content/uploads/2022/07/SplywDunajcem-9-600x400.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/0/0c/Sama_Jedna_a1.jpg",
  "https://www.cestovnicek.sk/wp-content/uploads/lesnica-pristav-plte-splavovanie-dunajca-1-scaled.jpg",
];

export default function Home() {
  const [lang, setLang] = useState('sk');
  const t = translations[lang];
  const isRtl = t.rtl || false;
  const dir = isRtl ? 'rtl' : 'ltr';
  const [highlightedStop, setHighlightedStop] = useState(null);
  const stopRefs = useRef([]);

  const stops = [
    { title: t.stop1_title, desc: t.stop1_desc },
    { title: t.stop2_title, desc: t.stop2_desc },
    { title: t.stop3_title, desc: t.stop3_desc },
    { title: t.stop4_title, desc: t.stop4_desc },
    { title: t.stop5_title, desc: t.stop5_desc },
    { title: t.stop6_title, desc: t.stop6_desc },
    { title: t.stop7_title, desc: t.stop7_desc },
    { title: t.stop8_title, desc: t.stop8_desc },
    { title: t.stop9_title, desc: t.stop9_desc },
    { title: t.stop10_title, desc: t.stop10_desc },
    { title: t.stop11_title, desc: t.stop11_desc },
    { title: t.stop12_title, desc: t.stop12_desc },
    { title: t.stop13_title, desc: t.stop13_desc },
    { title: t.stop14_title, desc: t.stop14_desc },
    { title: t.stop15_title, desc: t.stop15_desc },
    { title: t.stop16_title, desc: t.stop16_desc },
    { title: t.stop17_title, desc: t.stop17_desc },
    { title: t.stop18_title, desc: t.stop18_desc },
    { title: t.stop19_title, desc: t.stop19_desc },
    { title: t.stop20_title, desc: t.stop20_desc },
    { title: t.stop21_title, desc: t.stop21_desc },
  ];

  const scrollToStop = (stopId, stopName) => {
    console.log('🔍 scrollToStop volaný!', { stopId, stopName });
    const index = stopId - 1;
    console.log('Index:', index);
    console.log('Element:', stopRefs.current[index]);

    if (stopRefs.current[index]) {
      setHighlightedStop(stopId);
      setTimeout(() => setHighlightedStop(null), 2000);

      stopRefs.current[index].scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      console.log('❌ Element neexistuje pre index:', index);
    }
  };

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
          <div className="flex items-center gap-3">
            <InstallButton t={t} />
            <LangSelectorInHeader currentLang={lang} onChangeLang={setLang} />
          </div>
        </div>
      </header>

      <HeroSection t={t} />
      <TripTracker t={t} onMarkerClick={scrollToStop} />

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
              const isHighlighted = highlightedStop === idx + 1;
              return (
                <div
                  key={idx}
                  ref={el => stopRefs.current[idx] = el}
                  className={`lg:grid lg:grid-cols-2 lg:gap-16 lg:items-start relative transition-all duration-500 ${isHighlighted ? 'scroll-mt-24' : ''}`}
                  style={isHighlighted ? {
                    animation: 'highlightPulse 0.5s ease-in-out'
                  } : {}}
                >
                  <div className="absolute left-1/2 -translate-x-1/2 z-10 hidden lg:flex items-center justify-center top-8">
                    <div className="w-6 h-6 bg-goral-500 rounded-full border-4 border-goral-50 shadow-lg" />
                    <div className="absolute w-10 h-10 bg-goral-400/30 rounded-full animate-ripple" />
                  </div>
                  {isLeft ? (
                    <>
                      <div className="lg:pr-12">
                        <div className={`transition-all duration-500 ${isHighlighted ? 'ring-4 ring-river-400 shadow-xl scale-[1.02] rounded-2xl' : ''}`}>
                          <StopCard index={idx} title={stop.title} description={stop.desc} image={stopImages[idx]} lang={lang} t={t} dir={dir} />
                        </div>
                      </div>
                      <div className="hidden lg:block" />
                    </>
                  ) : (
                    <>
                      <div className="hidden lg:block" />
                      <div className="lg:pl-12">
                        <div className={`transition-all duration-500 ${isHighlighted ? 'ring-4 ring-river-400 shadow-xl scale-[1.02] rounded-2xl' : ''}`}>
                          <StopCard index={idx} title={stop.title} description={stop.desc} image={stopImages[idx]} lang={lang} t={t} dir={dir} />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <TipSection t={t} isRtl={isRtl} lang={lang} />
      <Reviews t={t} />
      <Chatbot t={t} lang={lang} />
      <Footer />
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