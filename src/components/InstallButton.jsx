import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

function isStandalone() {
    return (
        // @ts-ignore
        ('standalone' in navigator && navigator.standalone === true) ||
        window.matchMedia('(display-mode: standalone)').matches
    );
}

function detectBrowser() {
    const ua = navigator.userAgent;
    if (/Safari/.test(ua) && !/Chrome/.test(ua) && !/CriOS/.test(ua)) return 'safari';
    if (/OPR|Opera/.test(ua)) return 'opera';
    if (/Firefox/.test(ua)) return 'firefox';
    return 'chrome';
}

// --- Modálne okno pre Safari ---
function SafariModal({ onClose, t }) {
    const texts = {
        title: t?.install_safari_title || "Pridať na domovskú obrazovku",
        subtitle: t?.install_safari_subtitle || "Inštalácia na iPhone/iPad:",
        step1: t?.install_step1 || "Kliknite na tlačidlo „Zdieľať“ (ikona so šípkou)",
        step2: t?.install_step2 || "Vyberte „Pridať na domovskú obrazovku“",
        step3: t?.install_step3 || "Kliknite na „Pridať“",
        info: t?.install_info || "Aplikácia sa objaví na domovskej obrazovke!",
        close: t?.close || "Zatvoriť"
    };

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        >
            <div
                onClick={e => e.stopPropagation()}
                className="w-full max-w-xs bg-[#1c1c1e] rounded-3xl p-6 text-white text-center shadow-2xl border border-white/10"
            >
                <div className="w-12 h-12 bg-[#2c2c2e] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                </div>

                <p className="text-lg font-bold mb-1">{texts.title}</p>
                <p className="text-xs text-white/60 mb-4">{texts.subtitle}</p>

                <div className="text-left mb-5 space-y-3 text-xs">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#3a3a3c] flex items-center justify-center font-bold shrink-0">1</div>
                        <div>{texts.step1}</div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#3a3a3c] flex items-center justify-center font-bold shrink-0">2</div>
                        <div>{texts.step2}</div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#3a3a3c] flex items-center justify-center font-bold shrink-0">3</div>
                        <div>{texts.step3}</div>
                    </div>
                </div>

                <p className="text-xs text-white/60 mb-5">{texts.info}</p>

                <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-3 rounded-xl bg-[#3a3a3c] hover:bg-[#4a4a4c] text-white text-sm font-semibold transition-colors"
                >
                    {texts.close}
                </button>
            </div>
        </div>
    );
}

// --- Modál pre Operu ---
function OperaModal({ onClose, t }) {
    const texts = {
        title: t?.install_opera_title || "Inštalácia v Opere",
        step: t?.install_opera_step || "Kliknite na tri bodky → „Inštalovať ako aplikáciu“",
        close: t?.close || "Zatvoriť"
    };

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        >
            <div
                onClick={e => e.stopPropagation()}
                className="w-full max-w-xs bg-[#1c1c1e] rounded-3xl p-6 text-white text-center shadow-2xl border border-white/10"
            >
                <div className="w-12 h-12 bg-[#2c2c2e] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                </div>
                <p className="text-lg font-bold mb-2">{texts.title}</p>
                <p className="text-xs text-white/60 mb-6 leading-relaxed">{texts.step}</p>
                <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-3 rounded-xl bg-[#3a3a3c] hover:bg-[#4a4a4c] text-white text-sm font-semibold transition-colors"
                >
                    {texts.close}
                </button>
            </div>
        </div>
    );
}

// --- Modál pre Firefox ---
function FirefoxModal({ onClose, t }) {
    const texts = {
        title: t?.install_firefox_title || "Firefox má limitovanú podporu",
        info: t?.install_firefox_info || "Pre najlepší zážitok použite Chrome alebo Edge.",
        alt: t?.install_firefox_alt || "Prípadne: Menu (☰) → „Pridať na domovskú obrazovku“",
        close: t?.close || "Zatvoriť"
    };

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        >
            <div
                onClick={e => e.stopPropagation()}
                className="w-full max-w-xs bg-[#1c1c1e] rounded-3xl p-6 text-white text-center shadow-2xl border border-white/10"
            >
                <div className="w-12 h-12 bg-[#2c2c2e] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                </div>
                <p className="text-lg font-bold mb-2">{texts.title}</p>
                <p className="text-xs text-white/70 mb-2 leading-relaxed">{texts.info}</p>
                <p className="text-xs text-white/50 mb-6 leading-relaxed">{texts.alt}</p>
                <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-3 rounded-xl bg-[#3a3a3c] hover:bg-[#4a4a4c] text-white text-sm font-semibold transition-colors"
                >
                    {texts.close}
                </button>
            </div>
        </div>
    );
}

// --- Hlavný komponent s malou ikonkou ---
const DownloadIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

export default function InstallButton({ t }) {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showButton, setShowButton] = useState(false);
    const [browserType, setBrowserType] = useState('chrome');
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        if (isStandalone()) return;

        const browser = detectBrowser();
        setBrowserType(browser);

        if (browser !== 'chrome') {
            setShowButton(true);
            return;
        }

        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowButton(true);
        };

        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') setShowButton(false);
        setDeferredPrompt(null);
    };

    const handleManualInstall = () => setModalOpen(true);

    if (!showButton) return null;

    // Malé tlačidlo – iba ikonka na mobile, s textom na desktop
    return (
        <>
            <button
                type="button"
                onClick={browserType === 'chrome' ? handleInstall : handleManualInstall}
                className="flex items-center justify-center w-8 h-8 sm:w-auto sm:px-3 sm:py-2 rounded-lg bg-goral-600 hover:bg-goral-700 text-white transition-all shrink-0"
                aria-label={t?.install_button || "Inštalovať"}
            >
                <DownloadIcon />
                <span className="hidden sm:inline ml-2 text-sm">{t?.install_button || "Inštalovať"}</span>
            </button>

            {modalOpen && browserType === 'safari' && createPortal(<SafariModal onClose={() => setModalOpen(false)} t={t} />, document.body)}
            {modalOpen && browserType === 'opera' && createPortal(<OperaModal onClose={() => setModalOpen(false)} t={t} />, document.body)}
            {modalOpen && browserType === 'firefox' && createPortal(<FirefoxModal onClose={() => setModalOpen(false)} t={t} />, document.body)}
        </>
    );
}