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
                ? 'bg-white border-slate-200 text-slate-500'
                : isCritical
                ? 'bg-red-50/70 border-red-200 text-red-900'
                : isHigh
                ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                : 'bg-blue-50/70 border-blue-200 text-blue-900'
            }`}
          >
            <div className="flex items-start space-x-3.5">
              <div className="mt-0.5 shrink-0">
                {isResolved ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : isCritical ? (
                  <AlertTriangle className="w-5 h-5 text-red-600 animate-pulse" />
                ) : isHigh ? (
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                ) : (
                  <Info className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-bold text-sm text-slate-900">{alert.title}</h4>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                    isResolved
                      ? 'bg-slate-100 text-slate-600'
                      : isCritical
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : 'bg-amber-100 text-amber-700 border border-amber-200'
                  }`}>
                    {isResolved ? 'Resolved' : alert.alertType?.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs mt-1 text-slate-600 leading-relaxed">{alert.message}</p>
              </div>
            </div>

            {!isResolved && onResolve && (
              <button
                onClick={() => onResolve(alert.id)}
                className="self-end sm:self-auto px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 border border-slate-200 shadow-xs transition flex items-center space-x-1.5 shrink-0"
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
