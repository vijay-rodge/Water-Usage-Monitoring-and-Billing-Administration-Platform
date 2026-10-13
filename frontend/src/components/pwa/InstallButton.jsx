import React from 'react';
import { Download } from 'lucide-react';
import { usePwa } from '../../context/PwaContext';

export const InstallButton = ({ variant = 'default', className = '' }) => {
  const { isInstallable, isInstalled, promptInstall, setShowInstallPrompt } = usePwa();

  // If already running standalone / installed, do not show install button
  if (isInstalled) {
    return null;
  }

  const handleClick = () => {
    if (isInstallable) {
      promptInstall();
    } else {
      setShowInstallPrompt(true);
    }
  };

  if (variant === 'compact') {
    return (
      <button
        onClick={handleClick}
        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-cyan-400 border border-blue-200/80 dark:border-blue-800 text-xs font-bold transition shadow-xs cursor-pointer ${className}`}
        title="Install AquaFlow as a native desktop or mobile app"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition cursor-pointer ${className}`}
      title="Install AquaFlow Progressive Web App"
    >
      <Download className="w-4 h-4" />
      <span>Install App</span>
    </button>
  );
};
