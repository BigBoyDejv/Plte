import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import FolkDivider from './FolkDivider';

// Prednastavené sumy pre rôzne meny
const tipAmounts = {
  sk: [1, 3, 5, 10],      // EUR
  en: [1, 3, 5, 10],       // EUR
  pl: [4, 12, 20, 40],     // PLN
  de: [1, 3, 5, 10],       // EUR
  hu: [400, 1200, 2000, 4000], // HUF
  cz: [25, 75, 125, 250],  // CZK
  ru: [100, 300, 500, 1000], // RUB
  fr: [1, 3, 5, 10],       // EUR
  es: [1, 3, 5, 10],       // EUR
  lv: [1, 3, 5, 10],       // EUR
  lt: [1, 3, 5, 10],       // EUR
  he: [4, 12, 20, 40],     // ILS (približne)
};

const currencySymbols = {
  sk: '€',
  en: '€',
  pl: 'zł',
  de: '€',
  hu: 'Ft',
  cz: 'Kč',
  ru: '₽',
  fr: '€',
  es: '€',
  lv: '€',
  lt: '€',
  he: '₪',
};

export default function TipSection({ t, isRtl, lang }) {
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [qrFormat, setQrFormat] = useState('epc'); // 'epc' (SEPA / SK / EU) | 'spd' (QR Platba CZ)
  const [copied, setCopied] = useState(false);

  // Získanie správnych súm a meny podľa jazyka
  const currentAmounts = tipAmounts[lang] || tipAmounts.sk;
  const currencySymbol = currencySymbols[lang] || '€';

  // IBAN
  const IBAN = 'SK46 1100 0000 0029 3773 5080';
  const accountName = 'Dávid Rušin';

  // Prevod sumy na EUR pre IBAN
  const getAmountInEUR = (value) => {
    const rates = {
      pl: 0.25,   // 1 PLN = 0.25 EUR
      hu: 0.0025, // 1 HUF = 0.0025 EUR
      cz: 0.04,   // 1 CZK = 0.04 EUR
      ru: 0.01,   // 1 RUB = 0.01 EUR
      he: 0.27,   // 1 ILS = 0.27 EUR
    };
    const rate = rates[lang] || 1;
    return (value * rate).toFixed(2);
  };

  const cleanText = (str) => {
    if (!str) return '';
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s.,-]/gi, '')
      .trim();
  };

  // EPC QR Code (Standard SEPA Credit Transfer format recognized by Slovak and European banks)
  const generateEpcQrString = () => {
    const rawVal = parseFloat(amount);
    if (isNaN(rawVal) || rawVal <= 0) return '';
    const eurVal = getAmountInEUR(rawVal);
    const cleanMsg = cleanText(message) || 'Sprepitne';
    const cleanName = cleanText(accountName) || 'David Rusin';
    const ibanClean = IBAN.replace(/\s/g, '');

    return [
      'BCD',
      '002',
      '1',
      'SCT',
      'TATRSKBX',
      cleanName,
      ibanClean,
      `EUR${eurVal}`,
      '',
      '',
      cleanMsg,
      ''
    ].join('\n');
  };

  // SPD QR Code (Czech & Slovak QR Platba standard format)
  const generateSpdQrString = () => {
    const rawVal = parseFloat(amount);
    if (isNaN(rawVal) || rawVal <= 0) return '';
    const eurVal = getAmountInEUR(rawVal);
    const cleanMsg = cleanText(message) || 'Sprepitne';
    const cleanName = cleanText(accountName) || 'David Rusin';
    const ibanClean = IBAN.replace(/\s/g, '');

    return `SPD*1.0*ACC:${ibanClean}*AM:${eurVal}*CC:EUR*MSG:${cleanMsg}*RN:${cleanName}`;
  };

  const generatePaymeUrl = () => {
    const rawVal = parseFloat(amount);
    if (isNaN(rawVal) || rawVal <= 0) return '';
    const eurVal = getAmountInEUR(rawVal);
    const ibanClean = IBAN.replace(/\s/g, '');
    const msg = message || 'Sprepitné';
    return `https://payme.sk?iban=${ibanClean}&amount=${eurVal}&message=${encodeURIComponent(msg)}&name=${encodeURIComponent(accountName)}`;
  };

  const handleSend = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setShowQR(true);
  };

  const handleCloseQR = () => {
    setShowQR(false);
    setShowForm(false);
    setAmount('');
    setMessage('');
    setSelectedPreset(null);
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  const handleCopyIban = () => {
    const cleanIban = IBAN.replace(/\s/g, '');
    navigator.clipboard.writeText(cleanIban).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const rawAmountNum = parseFloat(amount);
  const amountEUR = !isNaN(rawAmountNum) ? getAmountInEUR(rawAmountNum) : '0.00';
  const isNonEurCurrency = currencySymbol !== '€';

  const texts = {
    title: t?.tip_title || "Sprepitné pre pltníka",
    desc: t?.tip_desc || "Páčila sa Vám plavba? Podporte nášho pltníka sprepitným!",
    button: t?.tip_button || "Zanechať sprepitné",
    placeholder: t?.tip_placeholder || "Suma",
    messagePlaceholder: t?.tip_message || "Správa pre pltníka (voliteľné)",
    cancel: t?.tip_cancel || "Zrušiť",
    send: t?.tip_send || "Pokračovať",
    thanks: t?.tip_thanks || "Ďakujeme za vašu podporu!",
    qrTitle: t?.qr_title || "Skenujte QR kód",
    qrInfo: t?.qr_info || "Naskenujte QR kód mobilnou bankovou aplikáciou a dokončite platbu.",
    back: t?.back || "Späť",
    copyIban: "Kopírovať IBAN",
    copied: "Skopírované!",
    openPayme: "Otvoriť Payme",
    formatSepa: "SEPA QR (SK / EÚ)",
    formatCz: "QR Platba (CZ)"
  };

  const activeQrPayload = qrFormat === 'epc' ? generateEpcQrString() : generateSpdQrString();

  return (
    <section className="relative overflow-hidden">
      <div className="h-8 bg-goral-800 folk-pattern" />
      <div className="bg-gradient-to-b from-goral-800 to-goral-900 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative bg-goral-50 dark:bg-goral-900 rounded-2xl overflow-hidden shadow-2xl border-2 border-goral-300 dark:border-goral-700 transition-colors">
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
                  <h3 className="text-3xl sm:text-4xl font-folk font-bold text-goral-900 dark:text-goral-100 tracking-wide mb-3">
                    {texts.title}
                  </h3>
                  <p className="text-goral-500 dark:text-goral-300 font-body text-sm sm:text-base mb-8">
                    {texts.desc}
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
                        <p className="font-folk text-xl font-bold text-forest-600">{texts.thanks}</p>
                      </motion.div>
                    ) : showQR ? (
                      <motion.div
                        key="qr"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl p-6 shadow-xl border-2 border-goral-200 w-full max-w-sm mx-auto lg:mx-0 text-center"
                      >
                        <h4 className="font-folk text-lg font-bold text-goral-800 mb-3">{texts.qrTitle}</h4>

                        {/* Format selector tabs */}
                        <div className="flex bg-goral-100 p-1 rounded-xl mb-4 text-xs font-semibold">
                          <button
                            type="button"
                            onClick={() => setQrFormat('epc')}
                            className={`flex-1 py-1.5 rounded-lg transition-all ${
                              qrFormat === 'epc'
                                ? 'bg-white text-goral-900 shadow-sm font-bold'
                                : 'text-goral-600 hover:text-goral-900'
                            }`}
                          >
                            {texts.formatSepa}
                          </button>
                          <button
                            type="button"
                            onClick={() => setQrFormat('spd')}
                            className={`flex-1 py-1.5 rounded-lg transition-all ${
                              qrFormat === 'spd'
                                ? 'bg-white text-goral-900 shadow-sm font-bold'
                                : 'text-goral-600 hover:text-goral-900'
                            }`}
                          >
                            {texts.formatCz}
                          </button>
                        </div>

                        <div className="bg-white p-3 rounded-xl inline-block border border-goral-100 shadow-inner mb-3">
                          <QRCodeSVG
                            value={activeQrPayload}
                            size={210}
                            level="M"
                            marginSize={2}
                            className="mx-auto"
                            bgColor="#ffffff"
                            fgColor="#1e1810"
                          />
                        </div>

                        <p className="text-xs text-goral-500 mb-3 leading-relaxed">
                          {texts.qrInfo}
                        </p>

                        <div className="bg-goral-50 rounded-xl p-3 mb-4 border border-goral-200/60">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p className="text-xs font-mono font-bold text-goral-800 break-all select-all">
                              {IBAN}
                            </p>
                            <button
                              type="button"
                              onClick={handleCopyIban}
                              className="px-2 py-1 text-[11px] font-medium bg-goral-200 hover:bg-goral-300 text-goral-800 rounded-md transition-colors flex-shrink-0 flex items-center gap-1"
                              title="Kopírovať IBAN"
                            >
                              {copied ? (
                                <span className="text-emerald-700 font-bold">{texts.copied}</span>
                              ) : (
                                <>
                                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                  {texts.copyIban}
                                </>
                              )}
                            </button>
                          </div>

                          <div className="mt-2 pt-2 border-t border-goral-200/50 flex justify-between items-center text-xs">
                            <span className="text-goral-500 font-medium">Suma platby:</span>
                            <span className="font-bold text-goral-900 text-sm">
                              {rawAmountNum.toFixed(2)} {currencySymbol}
                              {isNonEurCurrency && (
                                <span className="text-goral-500 text-xs ml-1 font-normal">
                                  (≈ {amountEUR} €)
                                </span>
                              )}
                            </span>
                          </div>

                          {message && (
                            <div className="mt-1 pt-1 flex justify-between items-center text-xs">
                              <span className="text-goral-500">Správa:</span>
                              <span className="text-goral-700 italic truncate max-w-[180px]">
                                "{message}"
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <a
                            href={generatePaymeUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2.5 rounded-xl border border-goral-400 text-goral-800 hover:bg-goral-100 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                          >
                            <svg className="w-4 h-4 text-goral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            {texts.openPayme}
                          </a>
                          <button
                            type="button"
                            onClick={handleCloseQR}
                            className="flex-1 py-2.5 rounded-xl bg-goral-700 hover:bg-goral-800 text-white text-xs font-semibold transition-colors"
                          >
                            {texts.back}
                          </button>
                        </div>
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
                        {texts.button}
                      </motion.button>
                    ) : (
                      <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl p-6 shadow-xl border-2 border-goral-200 w-full max-w-sm mx-auto lg:mx-0"
                      >
                        <div className="grid grid-cols-4 gap-2 mb-4">
                          {currentAmounts.map((val) => (
                            <button
                              key={val}
                              onClick={() => { setSelectedPreset(val); setAmount(val.toString()); }}
                              className={`py-3 rounded-xl font-folk font-bold text-lg transition-all border-2
                                ${selectedPreset === val
                                  ? 'border-goral-600 bg-goral-100 text-goral-800 shadow-md'
                                  : 'border-goral-200 bg-goral-50 text-goral-700 hover:border-goral-400'
                                }`}
                            >
                              {val}{currencySymbol}
                            </button>
                          ))}
                        </div>
                        <div className="space-y-3">
                          <div className="relative">
                            <input
                              type="number"
                              value={amount}
                              onChange={(e) => { setAmount(e.target.value); setSelectedPreset(null); }}
                              placeholder={texts.placeholder}
                              min="1"
                              step="1"
                              className="w-full px-4 py-3 rounded-xl border-2 border-goral-200 bg-goral-50 font-body text-sm focus:outline-none focus:ring-2 focus:ring-goral-400"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-goral-500 text-sm">
                              {currencySymbol}
                            </span>
                          </div>
                          <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={texts.messagePlaceholder}
                            rows={2}
                            className="w-full px-4 py-3 rounded-xl border-2 border-goral-200 bg-goral-50 font-body text-sm focus:outline-none focus:ring-2 focus:ring-goral-400 resize-none"
                          />
                          <div className="flex gap-3">
                            <button
                              onClick={() => { setShowForm(false); setSelectedPreset(null); setAmount(''); setMessage(''); }}
                              className="flex-1 py-3 rounded-xl border-2 border-goral-300 text-goral-700 font-body font-semibold text-sm hover:bg-goral-100"
                            >
                              {texts.cancel}
                            </button>
                            <button
                              disabled={!amount || parseFloat(amount) <= 0}
                              onClick={handleSend}
                              className="flex-1 py-3 rounded-xl bg-goral-700 hover:bg-goral-800 text-goral-50 font-body font-semibold text-sm disabled:opacity-40"
                            >
                              {texts.send}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="h-5 bg-gradient-to-r from-goral-700 via-goral-500 to-goral-700 relative overflow-hidden">
              <div className="absolute inset-0 folk-pattern opacity-40" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}