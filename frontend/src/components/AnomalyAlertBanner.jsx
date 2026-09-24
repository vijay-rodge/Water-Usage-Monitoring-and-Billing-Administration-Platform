import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2, Info, ArrowRight } from 'lucide-react';

export const AnomalyAlertBanner = ({ alerts = [], onResolve }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      {alerts.map((alert) => {
        const isCritical = alert.severity === 'CRITICAL';
        const isHigh = alert.severity === 'HIGH';
        const isResolved = alert.isResolved;

        return (
          <div
            key={alert.id}
            className={`p-5 rounded-3xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              isResolved
                ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                : isCritical
                ? 'bg-red-50/70 dark:bg-red-950/40 border-red-200 dark:border-red-900/60 text-red-900 dark:text-red-200'
                : isHigh
                ? 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200'
                : 'bg-blue-50/70 dark:bg-slate-900/90 border-blue-200 dark:border-blue-900/60 text-blue-900 dark:text-blue-200'
            }`}
          >
            <div className="flex items-start space-x-3.5">
              <div className="mt-0.5 shrink-0">
                {isResolved ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                ) : isCritical ? (
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 animate-pulse" />
                ) : isHigh ? (
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                ) : (
                  <Info className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                )}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{alert.title}</h4>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                    isResolved
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                      : isCritical
                      ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/60'
                      : 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60'
                  }`}>
                    {isResolved ? 'Resolved' : alert.alertType?.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs mt-1 text-slate-600 dark:text-slate-300 leading-relaxed">{alert.message}</p>
              </div>
            </div>

            {!isResolved && onResolve && (
              <button
                onClick={() => onResolve(alert.id)}
                className="self-end sm:self-auto px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs transition flex items-center space-x-1.5 shrink-0 cursor-pointer"
              >
                <span>Acknowledge</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
