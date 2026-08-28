import React, { useState } from 'react';
import { Droplets, AlertTriangle, CheckCircle2, Wrench, ArrowRight } from 'lucide-react';

export const LeakageRadarView = () => {
  const [alerts, setAlerts] = useState([
    { id: 1, flat: 'A-101', resident: 'Rahul Sharma', date: '2026-08-25', type: 'CONTINUOUS_LEAK', severity: 'CRITICAL', flowLiters: 1120, baselineLiters: 430, status: 'RESOLVED', details: 'Continuous flow between 2:00 AM - 5:30 AM. Plumber replaced toilet flush valve.' },
    { id: 2, flat: 'C-402', resident: 'Meera Deshmukh', date: '2026-08-28', type: 'USAGE_SPIKE', severity: 'HIGH', flowLiters: 2300, baselineLiters: 900, status: 'OPEN', details: 'Sudden 2.5x spike during afternoon hours. Maintenance inspection scheduled.' },
  ]);

  const handleResolve = (id) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, status: 'RESOLVED' } : a));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
          Water Leakage & Anomaly Radar
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Automated algorithmic detection of continuous night flows, pipe ruptures, and abnormal spikes.
        </p>
      </div>

      <div className="space-y-4">
        {alerts.map((a) => (
          <div
            key={a.id}
            className={`bg-white border rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              a.status === 'RESOLVED' ? 'border-slate-200' : 'border-red-200 bg-red-50/20'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shrink-0 ${
                a.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-100 text-red-600 animate-pulse'
              }`}>
                {a.status === 'RESOLVED' ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-base text-slate-900">Flat {a.flat} — {a.resident}</h3>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    a.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {a.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">{a.details}</p>
                <div className="flex items-center space-x-3 text-xs font-mono text-slate-400 mt-2">
                  <span>Detected Flow: <strong className="text-red-600">{a.flowLiters} L/day</strong></span>
                  <span>•</span>
                  <span>Normal Baseline: {a.baselineLiters} L/day</span>
                  <span>•</span>
                  <span>Flagged On: {a.date}</span>
                </div>
              </div>
            </div>

            {a.status !== 'RESOLVED' && (
              <button
                onClick={() => handleResolve(a.id)}
                className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition shrink-0"
              >
                <Wrench className="w-4 h-4" />
                <span>Mark Repaired & Resolved</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

