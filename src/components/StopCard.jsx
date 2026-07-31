import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FolkDivider from './FolkDivider';

export default function StopCard({ index, title, description, image, lang, t, dir, onShowOnMap = null }) {
  const [audioState, setAudioState] = useState('idle');
  const [currentAudio, setCurrentAudio] = useState(null);

  // Mapovanie jazykov na hlasy pre Workera
  const voiceMap = {
    sk: 'sk-SK-ViktoriaNeural',
    en: 'en-US-LiamNeural',
    pl: 'pl-PL-ZofiaNeural',
    de: 'de-DE-KatjaNeural',
    hu: 'hu-HU-NoemiNeural',
    cz: 'cs-CZ-VlastaNeural',
    ru: 'ru-RU-DmitryNeural',
    fr: 'fr-FR-HenriNeural',
    es: 'es-ES-AlvaroNeural',
  };

  const langMap = {
    sk: 'sk-SK',
    pl: 'pl-PL',
    cs: 'cs-CZ',
    de: 'de-DE',
    hu: 'hu-HU',
    en: 'en-US',
    lt: 'lt-LT',
    lv: 'lv-LV',
    ru: 'ru-RU',
    he: 'he-IL',
    fr: 'fr-FR',
    es: 'es-ES'
  };

  // Zastavenie prehrávania pri odmontovaní komponentu
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    };
  }, [currentAudio]);












  const handleAudio = () => {
    if (audioState === 'playing') {
      window.speechSynthesis.cancel();
      setAudioState('idle');
      return;
    }

    setAudioState('loading');

    const utterance = new SpeechSynthesisUtterance(description);

    utterance.lang = langMap[lang] || 'sk-SK';
    utterance.rate = 0.85;

    utterance.onstart = () => setAudioState('playing');
    utterance.onend = () => setAudioState('idle');
    utterance.onerror = () => setAudioState('idle');

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };
  const isPlaying = audioState === 'playing';
  const isLoading = audioState === 'loading';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.05 }}
      dir={dir}
      className="group overflow-hidden transition-all duration-700"
    >
      <div className="bg-goral-50 dark:bg-goral-900 border-2 border-goral-200 dark:border-goral-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
        {/* Top folk stripe */}
        <div className="h-3 bg-gradient-to-r from-goral-600 via-goral-400 to-goral-600 relative overflow-hidden">
          <div className="absolute inset-0 folk-pattern opacity-40" />
        </div>

        {/* Image */}
        <div className="relative h-56 sm:h-72 overflow-hidden">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-goral-900/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <span className="inline-block bg-goral-700/90 backdrop-blur-sm text-goral-100 text-xs font-bold font-body px-3 py-1.5 rounded-lg border border-goral-500/30">
              {t?.stop_label || 'Zastavenie'} {index + 1}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <h3 className="text-2xl sm:text-3xl font-folk font-bold text-goral-900 dark:text-goral-50 mb-4 tracking-wide">
            {title}
          </h3>
          <FolkDivider className="mb-4" />
          <p className="text-goral-700 dark:text-goral-300 font-body leading-relaxed mb-6 text-sm sm:text-base">
            {description}
          </p>
          <button
            onClick={handleAudio}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 min-h-[56px] rounded-2xl font-body font-bold text-base sm:text-lg transition-all duration-300 border-2 shadow-xl tracking-wide uppercase active:scale-95
              ${isPlaying
                ? 'bg-amber-400 text-goral-950 border-amber-200 shadow-amber-500/40 ring-4 ring-amber-400/40 animate-pulse'
                : 'bg-river-600 text-white border-river-400 hover:bg-river-500 shadow-river-900/40'
              }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="w-6 h-6 animate-spin shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            ) : isPlaying ? (
              <svg className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
            <span>
              {isLoading ? (t?.loading_audio || "Nahrávam...") : isPlaying ? (t?.stop_listening || "Zastaviť audio") : (t?.listen || "Vypočuť sprievodcu")}
            </span>
          </button>
        </div>

        {/* Bottom folk stripe */}
        <div className="h-3 bg-gradient-to-r from-goral-600 via-goral-400 to-goral-600 relative overflow-hidden">
          <div className="absolute inset-0 folk-pattern opacity-40" />
        </div>
      </div>
    </motion.div>
  );
}