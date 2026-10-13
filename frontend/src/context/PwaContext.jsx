import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const defaultPwaValue = {
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  justReconnected: false,
  isInstallable: false,
  isInstalled: false,
  isUpdateAvailable: false,
  showInstallPrompt: false,
  setShowInstallPrompt: () => {},
  promptInstall: async () => false,
  applyUpdate: () => window.location.reload()
};

const PwaContext = createContext(defaultPwaValue);

export const PwaProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));
  const [justReconnected, setJustReconnected] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  // Check if app is running in standalone mode (installed PWA)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true ||
        document.referrer.includes('android-app://');
      setIsInstalled(isStandaloneMode);
    };

    checkStandalone();
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e) => setIsInstalled(e.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleDisplayModeChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleDisplayModeChange);
      }
    };
  }, []);

  // Monitor Network Online/Offline Status
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      setIsOnline(true);
      setJustReconnected(true);
      const timer = setTimeout(() => setJustReconnected(false), 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setJustReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Listen for PWA installation prompt (Desktop Chrome/Edge & Android Chrome)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstallable(false);
      setIsInstalled(true);
      setShowInstallPrompt(false);
      console.log('[PWA] AquaFlow was successfully installed as a native app.');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Service Worker Registration & Automatic Update Lifecycle
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    // Only register service worker in production or standard HTTP/HTTPS
    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });

        // Check for waiting updates on initial registration
        if (registration.waiting) {
          setWaitingWorker(registration.waiting);
          setIsUpdateAvailable(true);
        }

        // Listen for new service worker installation
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setWaitingWorker(newWorker);
              setIsUpdateAvailable(true);
            }
          });
        });

        // Periodically check for service worker updates (every 60 minutes)
        const updateInterval = setInterval(() => {
          registration.update().catch((e) => console.debug('[PWA] SW update check:', e));
        }, 60 * 60 * 1000);

        return () => clearInterval(updateInterval);
      } catch (error) {
        console.warn('[PWA] ServiceWorker registration failed:', error);
      }
    };

    // Controller change listener for seamless reloads
    let refreshing = false;
    const handleControllerChange = () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    };

    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
    registerSW();

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
    };
  }, []);

  // Method to trigger native PWA install prompt
  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) {
      setShowInstallPrompt(true);
      return false;
    }

    try {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstallable(false);
        setDeferredPrompt(null);
        setShowInstallPrompt(false);
        return true;
      }
    } catch (err) {
      console.error('[PWA] Error during promptInstall:', err);
    }
    return false;
  }, [deferredPrompt]);

  // Method to apply waiting Service Worker update
  const applyUpdate = useCallback(() => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    } else {
      window.location.reload();
    }
  }, [waitingWorker]);

  return (
    <PwaContext.Provider
      value={{
        isOnline,
        justReconnected,
        isInstallable,
        isInstalled,
        isUpdateAvailable,
        showInstallPrompt,
        setShowInstallPrompt,
        promptInstall,
        applyUpdate
      }}
    >
      {children}
    </PwaContext.Provider>
  );
};

export const usePwa = () => {
  const context = useContext(PwaContext);
  return context || defaultPwaValue;
};
