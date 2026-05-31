import { useState, useEffect } from 'react';
import { prefetchOfflineAssets, wasOfflinePrefetchDone } from '@/data/offlineAssets';

export default function OfflineStatus({ t }) {
  const [online, setOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [prefetching, setPrefetching] = useState(false);
  const [prefetchProgress, setPrefetchProgress] = useState(0);
  const [showDoneBanner, setShowDoneBanner] = useState(false);

  useEffect(() => {
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  useEffect(() => {
    if (!online || wasOfflinePrefetchDone()) return;

    let cancelled = false;
    let hideTimer;

    setPrefetching(true);
    prefetchOfflineAssets({
      onProgress: (done, total) => {
        if (!cancelled) {
          setPrefetchProgress(total ? Math.round((done / total) * 100) : 0);
        }
      },
    }).then(() => {
      if (cancelled) return;
      setPrefetching(false);
      setShowDoneBanner(true);
      hideTimer = setTimeout(() => setShowDoneBanner(false), 5000);
    });

    return () => {
      cancelled = true;
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [online]);

  const texts = {
    offline:
      t?.offline_active ||
      'Offline režim – sprievodca, mapa a texty fungujú bez internetu',
    prefetching:
      t?.offline_prefetch ||
      `Pripravujem offline obsah… ${prefetchProgress}%`,
    prefetchDone:
      t?.offline_prefetch_done ||
      'Obsah uložený – pripravené na plavbu bez signálu',
  };

  if (!online) {
    return (
      <div
        className="fixed bottom-0 inset-x-0 z-50 bg-amber-800 text-white text-center text-sm py-2 px-4 shadow-lg"
        role="status"
      >
        {texts.offline}
      </div>
    );
  }

  if (prefetching) {
    return (
      <div
        className="fixed bottom-0 inset-x-0 z-50 bg-goral-800 text-goral-50 text-center text-sm py-2 px-4 shadow-lg"
        role="status"
      >
        {texts.prefetching}
      </div>
    );
  }

  if (showDoneBanner) {
    return (
      <div
        className="fixed bottom-0 inset-x-0 z-50 bg-forest-700 text-white text-center text-sm py-2 px-4 shadow-lg"
        role="status"
      >
        {texts.prefetchDone}
      </div>
    );
  }

  return null;
}
