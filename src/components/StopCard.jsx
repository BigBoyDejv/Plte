import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import FolkDivider from './FolkDivider';

export default function StopCard({ index, title, description, image, lang, t, dir }) {
  const [audioState, setAudioState] = useState('idle');
  const utteranceRef = useRef(null);

  const langMap = {
    sk: 'sk-SK', pl: 'pl-PL', cs: 'cs-CZ', de: 'de-DE',
    hu: 'hu-HU', en: 'en-US', lt: 'lt-LT', lv: 'lv-LV',
    ru: 'ru-RU', he: 'he-IL'
  };

  useEffect(() => {
    return () => window.speechSynthesis?.cancel();
  }, []);

  const handleAudio = () => {
    if (audioState === 'playing') {
      window.speechSynthesis.cancel();
      setAudioState('idle');
      return;
    }
    setAudioState('loading');
    const utterance = new SpeechSynthesisUtterance(description);
    utterance.lang = langMap[lang] || 'en-US';
    utterance.rate = 0.9;
    utterance.onstart = () => setAudioState('playing');
    utterance.onend = () => setAudioState('idle');
    utterance.onerror = () => setAudioState('idle');
    utteranceRef.current = utterance;
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
      <div className="bg-goral-50 border-2 border-goral-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500">
        {/* Top folk stripe */}
        <div className="h-3 bg-gradient-to-r from-goral-600 via-goral-400 to-goral-600 relative overflow-hidden">
          <div className="absolute inset-0 folk-pattern opacity-40" />
        </div>

        {/* Image - BEZ BLIKANIA A BEZ PULZOVANIA */}
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
              Zastavenie {index + 1}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <h3 className="text-2xl sm:text-3xl font-folk font-bold text-goral-900 mb-4 tracking-wide">
            {title}
          </h3>
          <FolkDivider className="mb-4" />
          <p className="text-goral-700 font-body leading-relaxed mb-6 text-sm sm:text-base">
            {description}
          </p>
          <button
            onClick={handleAudio}
            className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl font-body font-semibold text-sm transition-all duration-300 border-2
              ${isPlaying
                ? 'bg-river-600 text-white border-river-700 shadow-lg'
                : 'bg-goral-700 text-goral-50 border-goral-800 hover:bg-goral-800 shadow-lg shadow-goral-700/25'
              }`}
          >
            {isLoading ? (
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
            {isLoading ? (t?.loading_audio || "Nahrávam...") : isPlaying ? (t?.stop_listening || "Zastaviť") : (t?.listen || "Vypočuť")}
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