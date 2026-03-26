import { useState, useRef } from 'react';
import { Volume2, Square, Loader2 } from 'lucide-react';

export default function AudioButton({ text, lang, t }) {
  const [state, setState] = useState('idle'); // idle | loading | playing
  const audioRef = useRef(null);
  const utteranceRef = useRef(null);

  const langMap = {
    sk: 'sk-SK', pl: 'pl-PL', cs: 'cs-CZ', de: 'de-DE',
    hu: 'hu-HU', en: 'en-US', lt: 'lt-LT', lv: 'lv-LV',
    ru: 'ru-RU', he: 'he-IL'
  };

  const handlePlay = () => {
    if (state === 'playing') {
      window.speechSynthesis.cancel();
      setState('idle');
      return;
    }

    setState('loading');

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langMap[lang] || 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => setState('playing');
    utterance.onend = () => setState('idle');
    utterance.onerror = () => setState('idle');

    utteranceRef.current = utterance;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={handlePlay}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-body font-medium transition-all
        ${state === 'playing'
          ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/20'
          : 'bg-primary/10 text-primary hover:bg-primary/20 hover:shadow-md'
        }`}
    >
      {state === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
      {state === 'playing' && <Square className="w-4 h-4" />}
      {state === 'idle' && <Volume2 className="w-4 h-4" />}
      <span>
        {state === 'playing' ? t.stop_listening : state === 'loading' ? t.loading_audio : t.listen}
      </span>
    </button>
  );
}