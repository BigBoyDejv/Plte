import { useState, useEffect } from 'react';

export default function InstallButton({ t }) {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showButton, setShowButton] = useState(false);
    const [browserType, setBrowserType] = useState('chrome'); // chrome, safari, opera, firefox

    useEffect(() => {
        const ua = navigator.userAgent;

        // Detekcia prehliadača
        if (/Safari/.test(ua) && !/Chrome/.test(ua) && !/CriOS/.test(ua)) {
            setBrowserType('safari');
            setShowButton(true);
            return;
        }

        if (/OPR|Opera/.test(ua)) {
            setBrowserType('opera');
            setShowButton(true);
            return;
        }

        if (/Firefox/.test(ua)) {
            setBrowserType('firefox');
            setShowButton(true);
            return;
        }

        // Chrome / Edge
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowButton(true);
        };

        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(outcome === 'accepted' ? '✅ Inštalované' : '❌ Odmietnuté');
            setDeferredPrompt(null);
            setShowButton(false);
        }
    };

    const handleManualInstall = () => {
        if (browserType === 'safari') {
            alert('📱 Inštalácia na iPhone/iPad:\n\n1. Kliknite na tlačidlo "Zdieľať" (ikona so šípkou)\n2. Vyberte "Pridať na domovskú obrazovku"\n3. Kliknite na "Pridať"\n\nAplikácia sa objaví na domovskej obrazovke!');
        } else if (browserType === 'opera') {
            alert('🌐 Inštalácia v Opere:\n\n1. Kliknite na tri bodky v pravom hornom rohu\n2. Vyberte "Inštalovať ako aplikáciu"\n3. Potvrďte inštaláciu');
        } else if (browserType === 'firefox') {
            alert('🦊 Inštalácia vo Firefoxe:\n\nFirefox nepodporuje priamu inštaláciu. Odporúčame použiť Chrome alebo Edge pre lepší zážitok.\n\nPrípadne: Kliknite na menu (tri pruhy) → "Pridať na domovskú obrazovku"');
        }
    };

    if (!showButton) return null;

    // Safari tlačidlo
    if (browserType === 'safari') {
        return (
            <button
                onClick={handleManualInstall}
                className="flex items-center gap-2 bg-goral-600 hover:bg-goral-700 text-white px-3 py-2 rounded-lg text-sm font-body transition-all"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Pridať na domovskú obrazovku</span>
            </button>
        );
    }

    // Opera / Firefox tlačidlo
    if (browserType === 'opera' || browserType === 'firefox') {
        return (
            <button
                onClick={handleManualInstall}
                className="flex items-center gap-2 bg-goral-600 hover:bg-goral-700 text-white px-3 py-2 rounded-lg text-sm font-body transition-all"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>{t?.install_button || "Inštalovať"}</span>
            </button>
        );
    }

    // Chrome / Edge tlačidlo (automatická inštalácia)
    return (
        <button
            onClick={handleInstall}
            className="flex items-center gap-2 bg-river-500 hover:bg-river-600 text-white px-3 py-2 rounded-lg text-sm font-body transition-all"
        >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>{t?.install_button || "Inštalovať"}</span>
        </button>
    );
}