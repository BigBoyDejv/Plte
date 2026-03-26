import { useState, useEffect } from 'react';

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

// --- Modálne okno pre Safari (preložené) ---
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
        <div onClick={onClose} style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
            <div onClick={e => e.stopPropagation()} style={{
                width: '85%',
                maxWidth: 320,
                background: '#1c1c1e',
                borderRadius: 20,
                padding: '24px 20px 20px',
                color: '#fff',
                textAlign: 'center',
            }}>
                {/* Ikona */}
                <div style={{
                    width: 48, height: 48,
                    background: '#2c2c2e',
                    borderRadius: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px',
                }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                </div>

                <p style={{ margin: '0 0 8px', fontWeight: 600, fontSize: 18 }}>
                    {texts.title}
                </p>
                <p style={{ margin: '0 0 16px', fontSize: 14, opacity: 0.6 }}>
                    {texts.subtitle}
                </p>

                <div style={{ textAlign: 'left', marginBottom: 20 }}>
                    <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                        <div style={{
                            width: 24, height: 24, borderRadius: 12,
                            background: '#3a3a3c', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            fontSize: 12, fontWeight: 600, flexShrink: 0
                        }}>1</div>
                        <div style={{ fontSize: 14 }}>{texts.step1}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                        <div style={{
                            width: 24, height: 24, borderRadius: 12,
                            background: '#3a3a3c', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            fontSize: 12, fontWeight: 600, flexShrink: 0
                        }}>2</div>
                        <div style={{ fontSize: 14 }}>{texts.step2}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                        <div style={{
                            width: 24, height: 24, borderRadius: 12,
                            background: '#3a3a3c', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            fontSize: 12, fontWeight: 600, flexShrink: 0
                        }}>3</div>
                        <div style={{ fontSize: 14 }}>{texts.step3}</div>
                    </div>
                </div>

                <p style={{ margin: '0 0 20px', fontSize: 13, opacity: 0.6 }}>
                    {texts.info}
                </p>

                <button onClick={onClose} style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 12,
                    border: 'none',
                    background: '#3a3a3c',
                    color: '#fff',
                    fontSize: 15,
                    fontWeight: 500,
                    cursor: 'pointer',
                }}>
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
        <div onClick={onClose} style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
            <div onClick={e => e.stopPropagation()} style={{
                width: '85%', maxWidth: 320,
                background: '#1c1c1e',
                borderRadius: 20,
                padding: '24px 20px 20px',
                color: '#fff',
                textAlign: 'center',
            }}>
                <div style={{
                    width: 48, height: 48,
                    background: '#2c2c2e',
                    borderRadius: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px',
                }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                </div>
                <p style={{ margin: '0 0 8px', fontWeight: 600, fontSize: 18 }}>{texts.title}</p>
                <p style={{ margin: '0 0 24px', fontSize: 14, opacity: 0.6 }}>{texts.step}</p>
                <button onClick={onClose} style={{
                    width: '100%', padding: '12px', borderRadius: 12,
                    border: 'none', background: '#3a3a3c', color: '#fff', fontSize: 15, cursor: 'pointer',
                }}>{texts.close}</button>
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
        <div onClick={onClose} style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
            <div onClick={e => e.stopPropagation()} style={{
                width: '85%', maxWidth: 320,
                background: '#1c1c1e',
                borderRadius: 20,
                padding: '24px 20px 20px',
                color: '#fff',
                textAlign: 'center',
            }}>
                <div style={{
                    width: 48, height: 48,
                    background: '#2c2c2e',
                    borderRadius: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px',
                }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                </div>
                <p style={{ margin: '0 0 8px', fontWeight: 600, fontSize: 18 }}>{texts.title}</p>
                <p style={{ margin: '0 0 8px', fontSize: 14, opacity: 0.6 }}>{texts.info}</p>
                <p style={{ margin: '0 0 24px', fontSize: 13, opacity: 0.5 }}>{texts.alt}</p>
                <button onClick={onClose} style={{
                    width: '100%', padding: '12px', borderRadius: 12,
                    border: 'none', background: '#3a3a3c', color: '#fff', fontSize: 15, cursor: 'pointer',
                }}>{texts.close}</button>
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
                onClick={browserType === 'chrome' ? handleInstall : handleManualInstall}
                className="flex items-center justify-center w-8 h-8 sm:w-auto sm:px-3 sm:py-2 rounded-lg bg-goral-600 hover:bg-goral-700 text-white transition-all"
                aria-label={t?.install_button || "Inštalovať"}
            >
                <DownloadIcon />
                <span className="hidden sm:inline ml-2 text-sm">{t?.install_button || "Inštalovať"}</span>
            </button>

            {modalOpen && browserType === 'safari' && <SafariModal onClose={() => setModalOpen(false)} t={t} />}
            {modalOpen && browserType === 'opera' && <OperaModal onClose={() => setModalOpen(false)} t={t} />}
            {modalOpen && browserType === 'firefox' && <FirefoxModal onClose={() => setModalOpen(false)} t={t} />}
        </>
    );
}