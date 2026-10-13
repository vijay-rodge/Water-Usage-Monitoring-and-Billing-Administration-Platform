import React from 'react';
import { RefreshCw, Sparkles, X } from 'lucide-react';
import { usePwa } from '../../context/PwaContext';

export const ServiceWorkerUpdateToast = () => {
  const { isUpdateAvailable, applyUpdate } = usePwa();
  const [dismissed, setDismissed] = React.useState(false);

  if (!isUpdateAvailable || dismissed) {
    return null;
  }

  return (
    <aside aria-label="Software Update" className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300 max-w-sm w-full">
      <div className="bg-slate-900 border-2 border-cyan-500/50 text-white p-4 rounded-2xl shadow-2xl shadow-cyan-500/20 flex items-start space-x-3 backdrop-blur-md">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-white animate-pulse" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-white">App Update Available</h4>
          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
            A new version with performance improvements and offline updates is ready.
          </p>

          <div className="flex items-center space-x-2 mt-3">
            <button
              onClick={applyUpdate}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/30 transition cursor-pointer flex items-center space-x-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Update Now</span>
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-white text-xs font-semibold hover:bg-slate-800 transition cursor-pointer"
            >
              Later
            </button>
          </div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
