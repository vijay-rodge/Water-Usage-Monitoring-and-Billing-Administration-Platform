import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastNotification = ({ toast, onClose }) => {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed top-5 right-5 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
      <div className={`flex items-center space-x-3 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold max-w-md ${
        isSuccess
          ? 'bg-emerald-600 text-white border-emerald-500'
          : isError
          ? 'bg-rose-600 text-white border-rose-500'
          : 'bg-slate-900 text-white border-slate-800'
      }`}>
        <div className="shrink-0">
          {isSuccess ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          ) : isError ? (
            <AlertCircle className="w-4 h-4 text-rose-200" />
          ) : (
            <Info className="w-4 h-4 text-cyan-200" />
          )}
        </div>
        <p className="flex-1 leading-snug">{toast.message}</p>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded-lg transition"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default ToastNotification;

