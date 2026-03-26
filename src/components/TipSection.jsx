import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import FolkDivider from './FolkDivider';

const tipAmounts = [2, 5, 10, 20];

export default function TipSection({ t, isRtl }) {
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null);

  const handleSend = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setShowForm(false);
      setAmount('');
      setMessage('');
      setSelectedPreset(null);
    }, 3000);
  };

  // Fallback texty, ak chýbajú v translations
  const tipTitle = t?.tip_title || "Zanechajte tip pre pltníka";
  const tipDesc = t?.tip_desc || "Páčila sa Vám plavba? Podporte nášho pltníka!";
  const tipButton = t?.tip_button || "Zanechať tip";
  const tipPlaceholder = t?.tip_placeholder || "Suma v €";
  const tipMessage = t?.tip_message || "Správa pre pltníka (voliteľné)";
  const tipCancel = t?.tip_cancel || "Zrušiť";
  const tipSend = t?.tip_send || "Poslať";
  const tipThanks = t?.tip_thanks || "Ďakujeme za tip!";

  return (
    <section className="relative overflow-hidden">
      <div className="h-8 bg-goral-800 folk-pattern" />
      <div className="bg-gradient-to-b from-goral-800 to-goral-900 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative bg-goral-50 rounded-2xl overflow-hidden shadow-2xl border-2 border-goral-300">
            {/* Top stripe */}
            <div className="h-5 bg-gradient-to-r from-goral-700 via-goral-500 to-goral-700 relative overflow-hidden">
              <div className="absolute inset-0 folk-pattern opacity-40" />
            </div>

            <div className="p-8 sm:p-12 lg:p-16" dir={isRtl ? 'rtl' : 'ltr'}>
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                {/* Raftsman photo */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-4 border-goral-300 shadow-xl rotate-2 hover:rotate-0 transition-transform duration-300">
                    <img
                      alt="Pltnik"
                      className="w-full h-full object-cover"
                      src="https://ipravda.sk/res/2021/08/27/thumbs/pltnik-na-dunajci-nestandard1.jpg"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className={`text-center lg:${isRtl ? 'text-right' : 'text-left'} flex-1`}>
                  <h3 className="text-3xl sm:text-4xl font-folk font-bold text-goral-900 tracking-wide mb-3">
                    {tipTitle}
                  </h3>
                  <p className="text-goral-500 font-body text-sm sm:text-base mb-8">
                    {tipDesc}
                  </p>

                  <FolkDivider className="mb-8 lg:hidden" />

                  <AnimatePresence mode="wait">
                    {sent ? (
                      <motion.div
                        key="thanks"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-3 justify-center lg:justify-start"
                      >
                        <div className="w-12 h-12 rounded-full bg-forest-200 flex items-center justify-center">
                          <svg className="w-6 h-6 text-forest-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="font-folk text-xl font-bold text-forest-600">{tipThanks}</p>
                      </motion.div>
                    ) : !showForm ? (
                      <motion.button
                        key="btn"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center gap-3 bg-goral-700 text-goral-50 px-8 py-4 rounded-xl font-body font-bold text-lg hover:bg-goral-800 transition-all shadow-xl shadow-goral-700/30 hover:shadow-goral-800/40 hover:-translate-y-0.5 border-2 border-goral-800"
                      >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {tipButton}
                      </motion.button>
                    ) : (
                      <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl p-6 shadow-xl border-2 border-goral-200 w-full max-w-sm mx-auto lg:mx-0"
                      >
                        {/* Preset amounts */}
                        <div className="grid grid-cols-4 gap-2 mb-4">
                          {tipAmounts.map((val) => (
                            <button
                              key={val}
                              onClick={() => { setSelectedPreset(val); setAmount(val.toString()); }}
                              className={`py-3 rounded-xl font-folk font-bold text-lg transition-all border-2
                                ${selectedPreset === val
                                  ? 'border-goral-600 bg-goral-100 text-goral-800 shadow-md'
                                  : 'border-goral-200 bg-goral-50 text-goral-700 hover:border-goral-400'
                                }`}
                            >
                              {val}€
                            </button>
                          ))}
                        </div>
                        <div className="space-y-3">
                          <input
                            type="number"
                            value={amount}
                            onChange={(e) => { setAmount(e.target.value); setSelectedPreset(null); }}
                            placeholder={tipPlaceholder}
                            className="w-full px-4 py-3 rounded-xl border-2 border-goral-200 bg-goral-50 font-body text-sm focus:outline-none focus:ring-2 focus:ring-goral-400 focus:border-transparent"
                          />
                          <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={tipMessage}
                            rows={2}
                            className="w-full px-4 py-3 rounded-xl border-2 border-goral-200 bg-goral-50 font-body text-sm focus:outline-none focus:ring-2 focus:ring-goral-400 focus:border-transparent resize-none"
                          />
                          <div className="flex gap-3">
                            <button
                              onClick={() => { setShowForm(false); setSelectedPreset(null); setAmount(''); setMessage(''); }}
                              className="flex-1 py-3 rounded-xl border-2 border-goral-300 text-goral-700 font-body font-semibold text-sm hover:bg-goral-100 transition-colors"
                            >
                              {tipCancel}
                            </button>
                            <button
                              disabled={!amount || parseFloat(amount) <= 0}
                              onClick={handleSend}
                              className="flex-1 py-3 rounded-xl bg-goral-700 hover:bg-goral-800 text-goral-50 font-body font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed border-2 border-goral-800"
                            >
                              {tipSend}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Bottom stripe */}
            <div className="h-5 bg-gradient-to-r from-goral-700 via-goral-500 to-goral-700 relative overflow-hidden">
              <div className="absolute inset-0 folk-pattern opacity-40" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}