import { useState, useEffect, useRef } from 'react';

function isStandalone() {
    return (
        // @ts-ignore
        window.navigator.standalone === true ||
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

// --- Modaly pre manuálnu inštaláciu ---

function SafariModal({ onClose }) {
    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.55)',
                backdropFilter: 'blur(4px)',
                zIndex: 9999,
                display: 'flex', alignItems: 'flex-end',
                animation: 'fadeIn .18s ease',
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    width: '100%',
                    background: 'var(--modal-bg, #1c1c1e)',
                    borderRadius: '20px 20px 0 0',
                    padding: '24px 24px 36px',
                    color: '#fff',
                    animation: 'slideUp .22s ease',
                    boxShadow: '0 -8px 40px rgba(0,0,0,0.4)',
                }}
            >
                {/* Handle */}
                <div style={{
                    width: 36, height: 4,
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: 99, margin: '0 auto 20px',
                }} />

                <p style={{ margin: '0 0 6px', fontWeight: 600, fontSize: 17 }}>
                    Pridať na domovskú obrazovku
                </p>
                <p style={{ margin: '0 0 24px', fontSize: 14, opacity: 0.6, lineHeight: 1.5 }}>
                    Otvor aplikáciu priamo z plochy bez prehliadača.
                </p>

                {/* Kroky */}
                {[
                    {
                        icon: (
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                        ),
                        label: 'Klepni na ikonu Zdieľať',
                        sub: 'Ikona so šípkou hore v spodnej lište',
                    },
                    {
                        icon: (
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M12 4v16m8-8H4" />
                            </svg>
                        ),
                        label: 'Vyber „Pridať na plochu"',
                        sub: 'Skroluj dole v zozname akcií',
                    },
                    {
                        icon: (
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M5 13l4 4L19 7" />
                            </svg>
                        ),
                        label: 'Potvrď „Pridať"',
                        sub: 'Aplikácia sa objaví na ploche',
                    },
                ].map((step, i) => (
                    <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 18, alignItems: 'flex-start' }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: 'rgba(255,255,255,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                        }}>
                            {step.icon}
                        </div>
                        <div>
                            <div style={{ fontWeight: 500, fontSize: 15 }}>{step.label}</div>
                            <div style={{ fontSize: 13, opacity: 0.5, marginTop: 2 }}>{step.sub}</div>
                        </div>
                    </div>
                ))}

                <button
                    onClick={onClose}
                    style={{
                        marginTop: 8,
                        width: '100%',
                        padding: '14px',
                        borderRadius: 14,
                        border: 'none',
                        background: 'rgba(255,255,255,0.12)',
                        color: '#fff',
                        fontSize: 15,
                        fontWeight: 500,
                        cursor: 'pointer',
                    }}
                >
                    Rozumiem
                </button>
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
                @keyframes slideUp { from { transform: translateY(60px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
            `}</style>
        </div>
    );
}

function OperaModal({ onClose }) {
    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.55)',
                backdropFilter: 'blur(4px)',
                zIndex: 9999,
                display: 'flex', alignItems: 'flex-end',
                animation: 'fadeIn .18s ease',
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    width: '100%',
                    background: 'var(--modal-bg, #1c1c1e)',
                    borderRadius: '20px 20px 0 0',
                    padding: '24px 24px 36px',
                    color: '#fff',
                    animation: 'slideUp .22s ease',
                }}
            >
                <div style={{
                    width: 36, height: 4,
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: 99, margin: '0 auto 20px',
                }} />

                <p style={{ margin: '0 0 6px', fontWeight: 600, fontSize: 17 }}>
                    Inštalácia v Opere
                </p>
                <p style={{ margin: '0 0 20px', fontSize: 14, opacity: 0.6 }}>
                    Kliknite na tri bodky → „Inštalovať ako aplikáciu" → Potvrdiť.
                </p>

                <button onClick={onClose} style={{
                    width: '100%', padding: '14px', borderRadius: 14,
                    border: 'none', background: 'rgba(255,255,255,0.12)',
                    color: '#fff', fontSize: 15, fontWeight: 500, cursor: 'pointer',
                }}>
                    Rozumiem
                </button>
            </div>
            <style>{`
                @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
                @keyframes slideUp { from { transform: translateY(60px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
            `}</style>
        </div>
    );
}

function FirefoxModal({ onClose }) {
    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.55)',
                backdropFilter: 'blur(4px)',
                zIndex: 9999,
                display: 'flex', alignItems: 'flex-end',
                animation: 'fadeIn .18s ease',
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    width: '100%',
                    background: 'var(--modal-bg, #1c1c1e)',
                    borderRadius: '20px 20px 0 0',
                    padding: '24px 24px 36px',
                    color: '#fff',
                    animation: 'slideUp .22s ease',
                }}
            >
                <div style={{
                    width: 36, height: 4,
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: 99, margin: '0 auto 20px',
                }} />

                <p style={{ margin: '0 0 6px', fontWeight: 600, fontSize: 17 }}>
                    Inštalácia vo Firefoxe
                </p>
                <p style={{ margin: '0 0 8px', fontSize: 14, opacity: 0.6 }}>
                    Firefox má limitovanú podporu PWA. Pre najlepší zážitok odporúčame Chrome alebo Edge.
                </p>
                <p style={{ margin: '0 0 20px', fontSize: 14, opacity: 0.6 }}>
                    Prípadne: Menu (☰) → „Pridať na domovskú obrazovku"
                </p>

                <button onClick={onClose} style={{
                    width: '100%', padding: '14px', borderRadius: 14,
                    border: 'none', background: 'rgba(255,255,255,0.12)',
                    color: '#fff', fontSize: 15, fontWeight: 500, cursor: 'pointer',
                }}>
                    Rozumiem
                </button>
            </div>
            <style>{`
                @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
                @keyframes slideUp { from { transform: translateY(60px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
            `}</style>
        </div>
    );
}

// --- Hlavný komponent ---

const DownloadIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

export default function InstallButton({ t }) {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showButton, setShowButton] = useState(false);
    const [browserType, setBrowserType] = useState('chrome');
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        if (isStandalone()) return; // Už nainštalované — nič nezobrazuj

        const browser = detectBrowser();
        setBrowserType(browser);

        if (browser !== 'chrome') {
            setShowButton(true);
            return;
        }

        // Chrome / Edge — čakáme na beforeinstallprompt
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
        if (outcome === 'accepted') {
            setShowButton(false);
        }
        setDeferredPrompt(null);
    };

    const handleManualInstall = () => setModalOpen(true);

    if (!showButton) return null;

    const label = t?.install_button || 'Inštalovať';

    return (
        <>
            {browserType === 'safari' ? (
                <button
                    onClick={handleManualInstall}
                    className="flex items-center gap-2 bg-goral-600 hover:bg-goral-700 text-white px-3 py-2 rounded-lg text-sm font-body transition-all"
                >
                    <DownloadIcon />
                    <span>Pridať na domovskú obrazovku</span>
                </button>
            ) : browserType === 'opera' || browserType === 'firefox' ? (
                <button
                    onClick={handleManualInstall}
                    className="flex items-center gap-2 bg-goral-600 hover:bg-goral-700 text-white px-3 py-2 rounded-lg text-sm font-body transition-all"
                >
                    <DownloadIcon />
                    <span>{label}</span>
                </button>
            ) : (
                <button
                    onClick={handleInstall}
                    className="flex items-center gap-2 bg-river-500 hover:bg-river-600 text-white px-3 py-2 rounded-lg text-sm font-body transition-all"
                >
                    <DownloadIcon />
                    <span>{label}</span>
                </button>
            )}

            {modalOpen && browserType === 'safari' && <SafariModal onClose={() => setModalOpen(false)} />}
            {modalOpen && browserType === 'opera' && <OperaModal onClose={() => setModalOpen(false)} />}
            {modalOpen && browserType === 'firefox' && <FirefoxModal onClose={() => setModalOpen(false)} />}
        </>
    );
}