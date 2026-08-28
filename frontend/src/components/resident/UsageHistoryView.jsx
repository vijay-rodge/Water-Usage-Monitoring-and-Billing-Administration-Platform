import React, { useState } from 'react';
import { Droplets, Calendar, Filter, AlertTriangle, CheckCircle2, Search } from 'lucide-react';

export const UsageHistoryView = () => {
  const [filter, setFilter] = useState('ALL');

  const logs = [
    { date: '2026-08-28', liters: 410, cost: 6.56, dial: 137510, status: 'Normal', note: 'Standard daily consumption' },
    { date: '2026-08-27', liters: 410, cost: 6.56, dial: 137100, status: 'Normal', note: 'Standard daily consumption' },
    { date: '2026-08-26', liters: 490, cost: 7.84, dial: 136690, status: 'Normal', note: 'Washing machine laundry' },
    { date: '2026-08-25', liters: 1120, cost: 24.80, dial: 136200, status: 'Anomaly', note: 'Toilet flush valve continuous trickle' },
    { date: '2026-08-24', liters: 950, cost: 20.10, dial: 135080, status: 'Anomaly', note: 'Elevated night baseline draw' },
    { date: '2026-08-23', liters: 430, cost: 6.88, dial: 134130, status: 'Normal', note: 'Standard daily consumption' },
    { date: '2026-08-22', liters: 470, cost: 7.52, dial: 133700, status: 'Normal', note: 'Standard daily consumption' },
    { date: '2026-08-21', liters: 440, cost: 7.04, dial: 133230, status: 'Normal', note: 'Standard daily consumption' },
  ];

  const filteredLogs = logs.filter(l => filter === 'ALL' || l.status === filter);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            Sub-Meter Usage History
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Daily water consumption logs recorded from your flat's smart sub-meter dial.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {['ALL', 'Normal', 'Anomaly'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                filter === f ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
              <tr>
                <th className="px-5 py-3.5">Reading Date</th>
                <th className="px-5 py-3.5 font-mono text-right">Dial Reading (L)</th>
                <th className="px-5 py-3.5 font-mono text-right">Daily Consumption</th>
                <th className="px-5 py-3.5 font-mono text-right">Est. Cost (₹)</th>
                <th className="px-5 py-3.5">Observation / Telemetry Note</th>
                <th className="px-5 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition">
                  <td className="px-5 py-3.5 font-mono text-slate-600">{log.date}</td>
                  <td className="px-5 py-3.5 font-mono text-right text-slate-500">{log.dial.toLocaleString()} L</td>
                  <td className="px-5 py-3.5 font-mono text-right font-bold text-blue-600">
                    {log.liters.toLocaleString()} L
                  </td>
                  <td className="px-5 py-3.5 font-mono text-right font-medium text-slate-900">₹{log.cost.toFixed(2)}</td>
                  <td className="px-5 py-3.5 text-slate-600">{log.note}</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      log.status === 'Anomaly'
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                    }`}>
                      {log.status === 'Anomaly' ? '⚠️ Spike / Leak' : 'Normal'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

