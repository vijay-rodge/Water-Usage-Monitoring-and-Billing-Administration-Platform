import React from 'react';
import { Download, X, Smartphone, Zap, WifiOff, CheckCircle2, ShieldCheck, Share, PlusSquare } from 'lucide-react';
import { usePwa } from '../../context/PwaContext';

export const InstallAppModal = () => {
  const { showInstallPrompt, setShowInstallPrompt, promptInstall, isInstalled, isInstallable } = usePwa();

  if (!showInstallPrompt || isInstalled) {
    return null;
  }

  // Detect iOS Safari
  const isIos = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  const handleInstallClick = async () => {
    const installed = await promptInstall();
    if (installed) {
      setShowInstallPrompt(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 overflow-hidden text-slate-800 dark:text-slate-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-44 h-44 bg-blue-500/10 dark:bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setShowInstallPrompt(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          title="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>

        {/* App Header & Icon */}
        <div className="flex items-center space-x-4 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-slate-950 p-2 border border-slate-700 shadow-md flex items-center justify-center shrink-0">
            <img src="/icons/icon-192x192.png" alt="AquaFlow" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">AquaFlow</h3>
              <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-blue-900">
                PWA v1.0
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Smart Water Telemetry &amp; Billing Platform
            </p>
          </div>
        </div>

        {/* Value Proposition Points */}
        <div className="space-y-3 mb-6 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">Lightning-Fast Launch</p>
              <p className="text-slate-500 dark:text-slate-400">Launches instantly from your home screen or desktop without browser bars.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <WifiOff className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">Reliable Offline Access</p>
              <p className="text-slate-500 dark:text-slate-400">View telemetry charts and saved water tips even when your connection drops.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 rounded-lg bg-cyan-100 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">Enterprise Security</p>
              <p className="text-slate-500 dark:text-slate-400">Sensitive user data and invoices are never stored in unencrypted browser caches.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isIos ? (
          <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 p-3.5 rounded-2xl text-xs space-y-2 text-slate-700 dark:text-slate-300">
            <p className="font-bold text-blue-700 dark:text-cyan-300 flex items-center gap-1.5">
              <span>Install on iOS Safari:</span>
            </p>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-400">
              <li>Tap the <Share className="w-3.5 h-3.5 inline mx-1 text-blue-600" /> <strong>Share</strong> button in Safari toolbar.</li>
              <li>Scroll down and select <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-blue-600" /> <strong>Add to Home Screen</strong>.</li>
            </ol>
            <button
              onClick={() => setShowInstallPrompt(false)}
              className="w-full mt-2 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold transition cursor-pointer"
            >
              Got it
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleInstallClick}
              className="flex-1 flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Install AquaFlow App</span>
            </button>
            <button
              onClick={() => setShowInstallPrompt(false)}
              className="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm transition cursor-pointer"
            >
              Maybe Later
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
