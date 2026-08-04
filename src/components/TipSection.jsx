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

// Kompletné preklady pre formulár a QR kód v 12 jazykoch
const tipTranslations = {
  sk: {
    title: "Sprepitné pre pltníka",
    desc: "Páčila sa Vám plavba? Podporte nášho pltníka sprepitným!",
    button: "Zanechať sprepitné",
    placeholder: "Suma",
    messagePlaceholder: "Správa pre pltníka (voliteľné)",
    cancel: "Zrušiť",
    send: "Pokračovať",
    thanks: "Ďakujeme za vašu podporu!",
    qrTitle: "Skenujte QR kód",
    qrInfo: "Naskenujte QR kód mobilnou bankovou aplikáciou a dokončite platbu.",
    back: "Späť",
    copyIban: "Kopírovať IBAN",
    copied: "Skopírované!",
    formatSepa: "SEPA QR (SK / EÚ)",
    formatCz: "QR Platba (CZ)",
    amountPayment: "Suma platby:",
    messageLabel: "Správa:"
  },
  en: {
    title: "Tip for the Raftsman",
    desc: "Did you enjoy the rafting trip? Support our raftsman with a tip!",
    button: "Leave a Tip",
    placeholder: "Amount",
    messagePlaceholder: "Message for the raftsman (optional)",
    cancel: "Cancel",
    send: "Continue",
    thanks: "Thank you for your support!",
    qrTitle: "Scan QR Code",
    qrInfo: "Scan the QR code with your mobile banking app to complete the payment.",
    back: "Back",
    copyIban: "Copy IBAN",
    copied: "Copied!",
    formatSepa: "SEPA QR (SK / EU)",
    formatCz: "QR Payment (CZ)",
    amountPayment: "Payment amount:",
    messageLabel: "Message:"
  },
  pl: {
    title: "Napiwek dla flisaka",
    desc: "Podobał Ci się spływ? Wspieraj naszego flisaka napiwkiem!",
    button: "Zostaw napiwek",
    placeholder: "Kwota",
    messagePlaceholder: "Wiadomość dla flisaka (opcjonalnie)",
    cancel: "Anuluj",
    send: "Dalej",
    thanks: "Dziękujemy za Twoje wsparcie!",
    qrTitle: "Zeskanuj kod QR",
    qrInfo: "Zeskanuj kod QR aplikacją bankową, aby dokończyć płatność.",
    back: "Wstecz",
    copyIban: "Kopiuj IBAN",
    copied: "Skopiowano!",
    formatSepa: "SEPA QR (SK / EU)",
    formatCz: "Płatność QR (CZ)",
    amountPayment: "Kwota płatności:",
    messageLabel: "Wiadomość:"
  },
  de: {
    title: "Trinkgeld für den Flößer",
    desc: "Hat Ihnen die Fahrt gefallen? Unterstützen Sie unseren Flößer mit einem Trinkgeld!",
    button: "Trinkgeld geben",
    placeholder: "Betrag",
    messagePlaceholder: "Nachricht an den Flößer (optional)",
    cancel: "Abbrechen",
    send: "Weiter",
    thanks: "Vielen Dank für Ihre Unterstützung!",
    qrTitle: "QR-Code scannen",
    qrInfo: "Scannen Sie den QR-Code mit Ihrer Banking-App, um die Zahlung abzuschließen.",
    back: "Zurück",
    copyIban: "IBAN kopieren",
    copied: "Kopiert!",
    formatSepa: "SEPA QR (SK / EU)",
    formatCz: "QR-Zahlung (CZ)",
    amountPayment: "Zahlungsbetrag:",
    messageLabel: "Nachricht:"
  },
  hu: {
    title: "Borravaló a tutajosnak",
    desc: "Tetszett a tutajozás? Támogassa tutajosunkat borravalóval!",
    button: "Borravaló adása",
    placeholder: "Összeg",
    messagePlaceholder: "Üzenet a tutajosnak (opcionális)",
    cancel: "Mégse",
    send: "Folytatás",
    thanks: "Köszönjük a támogatást!",
    qrTitle: "QR-kód beolvasása",
    qrInfo: "Olvassa be a QR-kódot mobilbanki alkalmazásával a fizetés befejezéséhez.",
    back: "Vissza",
    copyIban: "IBAN másolása",
    copied: "Másolva!",
    formatSepa: "SEPA QR (SK / EU)",
    formatCz: "QR Fizetés (CZ)",
    amountPayment: "Fizetendő összeg:",
    messageLabel: "Üzenet:"
  },
  cz: {
    title: "Spropitné pro voraře",
    desc: "Líbila se Vám plavba? Podpořte našeho voraře spropitným!",
    button: "Zanechat spropitné",
    placeholder: "Částka",
    messagePlaceholder: "Zpráva pro voraře (volitelné)",
    cancel: "Zrušit",
    send: "Pokračovat",
    thanks: "Děkujeme za vaši podporu!",
    qrTitle: "Naskenujte QR kód",
    qrInfo: "Naskenujte QR kód mobilním bankovnictvím a dokončete platbu.",
    back: "Zpět",
    copyIban: "Kopírovat IBAN",
    copied: "Zkopírováno!",
    formatSepa: "SEPA QR (SK / EU)",
    formatCz: "QR Platba (CZ)",
    amountPayment: "Částka platby:",
    messageLabel: "Zpráva:"
  },
  ru: {
    title: "Чаевые для плотогона",
    desc: "Понравилось плавание? Поддержите нашего плотогона чаевыми!",
    button: "Оставить чаевые",
    placeholder: "Сумма",
    messagePlaceholder: "Сообщение плотогону (необязательно)",
    cancel: "Отмена",
    send: "Продолжить",
    thanks: "Спасибо за вашу поддержку!",
    qrTitle: "Сканируйте QR-код",
    qrInfo: "Отсканируйте QR-код банковским приложением для оплаты.",
    back: "Назад",
    copyIban: "Копировать IBAN",
    copied: "Скопировано!",
    formatSepa: "SEPA QR (SK / EU)",
    formatCz: "QR-платеж (CZ)",
    amountPayment: "Сумма платежа:",
    messageLabel: "Сообщение:"
  },
  fr: {
    title: "Pourboire pour le batelier",
    desc: "Vous avez aimé la descente ? Soutenez notre batelier avec un pourboire !",
    button: "Laisser un pourboire",
    placeholder: "Montant",
    messagePlaceholder: "Message au batelier (optionnel)",
    cancel: "Annuler",
    send: "Continuer",
    thanks: "Merci pour votre soutien !",
    qrTitle: "Scanner le code QR",
    qrInfo: "Scannez le code QR avec votre application bancaire mobile pour effectuer le paiement.",
    back: "Retour",
    copyIban: "Copier l'IBAN",
    copied: "Copié !",
    formatSepa: "SEPA QR (SK / UE)",
    formatCz: "Paiement QR (CZ)",
    amountPayment: "Montant du paiement :",
    messageLabel: "Message :"
  },
  es: {
    title: "Propina para el balsero",
    desc: "¿Le gustó el viaje en balsa? ¡Apoye a nuestro balsero con una propina!",
    button: "Dejar propina",
    placeholder: "Monto",
    messagePlaceholder: "Mensaje para el balsero (opcional)",
    cancel: "Cancelar",
    send: "Continuar",
    thanks: "¡Gracias por su apoyo!",
    qrTitle: "Escanear código QR",
    qrInfo: "Escanee el código QR con su aplicación bancaria móvil para completar el pago.",
    back: "Volver",
    copyIban: "Copiar IBAN",
    copied: "¡Copiado!",
    formatSepa: "SEPA QR (SK / UE)",
    formatCz: "Pago QR (CZ)",
    amountPayment: "Monto del pago:",
    messageLabel: "Mensaje:"
  },
  lv: {
    title: "Dzeramnauda plostniekam",
    desc: "Vai jums patika brauciens? Atbalstiet mūsu plostnieku ar dzeramnaudu!",
    button: "Atstāt dzeramnaudu",
    placeholder: "Summa",
    messagePlaceholder: "Ziņa plostniekam (pēc izvēles)",
    cancel: "Atcelt",
    send: "Turpināt",
    thanks: "Paldies par jūsu atbalstu!",
    qrTitle: "Skenēt QR kodu",
    qrInfo: "Skenējiet QR kodu ar savu bankas lietotni, lai pabeigtu maksājumu.",
    back: "Atpakaļ",
    copyIban: "Kopēt IBAN",
    copied: "Nokopēts!",
    formatSepa: "SEPA QR (SK / ES)",
    formatCz: "QR Maksājums (CZ)",
    amountPayment: "Maksājuma summa:",
    messageLabel: "Ziņa:"
  },
  lt: {
    title: "Arbatpinigiai sielininkui",
    desc: "Ar patiko plaukimas? Palaikykite mūsų sielininką arbatpinigiais!",
    button: "Palikti arbatpinigių",
    placeholder: "Suma",
    messagePlaceholder: "Žinutė sielininkui (neprivaloma)",
    cancel: "Atšaukti",
    send: "Tęsti",
    thanks: "Ačiū už jūsų palaikymą!",
    qrTitle: "Nuskenuoti QR kodą",
    qrInfo: "Nuskenuokite QR kodą savo banko programėle ir užbaikite mokėjimą.",
    back: "Atgal",
    copyIban: "Kopijuoti IBAN",
    copied: "Nukopijuota!",
    formatSepa: "SEPA QR (SK / ES)",
    formatCz: "QR Mokėjimas (CZ)",
    amountPayment: "Mokėjimo suma:",
    messageLabel: "Žinutė:"
  },
  he: {
    title: "טיפ לרפסודאי",
    desc: "נהניתם מהשיט? תמכו ברפסודאי שלנו בטיפ!",
    button: "להשאיר טיפ",
    placeholder: "סכום",
    messagePlaceholder: "הודעה לרפסודאי (רשות)",
    cancel: "ביטול",
    send: "המשך",
    thanks: "תודה על התמיכה שלך!",
    qrTitle: "סרוק קוד QR",
    qrInfo: "סרוק את קוד ה-QR באפליקציית הבנק שלך להשלמת התשלום.",
    back: "חזרה",
    copyIban: "העתק IBAN",
    copied: "הועתק!",
    formatSepa: "SEPA QR (SK / EU)",
    formatCz: "QR Payment (CZ)",
    amountPayment: "סכום תשלום:",
    messageLabel: "הודעה:"
  }
};

export default function TipSection({ t, isRtl, lang }) {
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [showQR, setShowQR] = useState(false);
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

  const langDict = tipTranslations[lang] || tipTranslations.sk;

  const texts = {
    title: t?.tip_title || langDict.title,
    desc: t?.tip_desc || t?.tip_subtitle || langDict.desc,
    button: t?.tip_button || langDict.button,
    placeholder: t?.tip_placeholder || langDict.placeholder,
    messagePlaceholder: t?.tip_message || langDict.messagePlaceholder,
    cancel: t?.tip_cancel || langDict.cancel,
    send: t?.tip_send || langDict.send,
    thanks: t?.tip_thanks || langDict.thanks,
    qrTitle: t?.qr_title || langDict.qrTitle,
    qrInfo: t?.qr_info || langDict.qrInfo,
    back: t?.back || langDict.back,
    copyIban: t?.copy_iban || langDict.copyIban,
    copied: t?.copied || langDict.copied,
    amountPayment: langDict.amountPayment,
    messageLabel: langDict.messageLabel
  };

  const activeQrPayload = generateEpcQrString();

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
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-1">
                            <p className="text-[11px] sm:text-xs font-mono font-bold text-goral-800 tracking-tight whitespace-nowrap select-all">
                              {IBAN}
                            </p>
                            <button
                              type="button"
                              onClick={handleCopyIban}
                              className="w-full sm:w-auto px-2.5 py-1 text-[11px] font-medium bg-goral-200 hover:bg-goral-300 text-goral-800 rounded-md transition-colors flex-shrink-0 flex items-center justify-center gap-1"
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
                            <span className="text-goral-500 font-medium">{texts.amountPayment}</span>
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
                              <span className="text-goral-500">{texts.messageLabel}</span>
                              <span className="text-goral-700 italic truncate max-w-[180px]">
                                "{message}"
                              </span>
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={handleCloseQR}
                          className="w-full py-2.5 rounded-xl bg-goral-700 hover:bg-goral-800 text-white text-xs sm:text-sm font-semibold transition-colors shadow-md"
                        >
                          {texts.back}
                        </button>
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