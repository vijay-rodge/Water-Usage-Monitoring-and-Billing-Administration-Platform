import React, { useState } from 'react';
import { Gauge, UploadCloud, Plus, AlertTriangle, CheckCircle2, Calendar, Search } from 'lucide-react';
import { CSVUploadModal } from '../CSVUploadModal';
import { ManualReadingModal } from '../ManualReadingModal';

export const MeterReadingsView = () => {
  const [showCsv, setShowCsv] = useState(false);
  const [showManual, setShowManual] = useState(false);

  const readings = [
    { id: 1, flat: 'A-101', date: '2026-08-28', prev: 137100, curr: 137510, daily: 410, source: 'IoT Sub-Meter', isAnomaly: false },
    { id: 2, flat: 'A-102', date: '2026-08-28', prev: 98200, curr: 98620, daily: 420, source: 'IoT Sub-Meter', isAnomaly: false },
    { id: 3, flat: 'B-101', date: '2026-08-28', prev: 85400, curr: 85850, daily: 450, source: 'Manual Entry', isAnomaly: false },
    { id: 4, flat: 'B-202', date: '2026-08-28', prev: 157290, curr: 157770, daily: 480, source: 'IoT Sub-Meter', isAnomaly: false },
    { id: 5, flat: 'C-402', date: '2026-08-28', prev: 320100, curr: 322400, daily: 2300, source: 'CSV Upload', isAnomaly: true, reason: 'Continuous draw >2.5x baseline' },
    { id: 6, flat: 'A-101', date: '2026-08-27', prev: 136690, curr: 137100, daily: 410, source: 'IoT Sub-Meter', isAnomaly: false },
    { id: 7, flat: 'A-101', date: '2026-08-26', prev: 136200, curr: 136690, daily: 490, source: 'IoT Sub-Meter', isAnomaly: false },
    { id: 8, flat: 'A-101', date: '2026-08-25', prev: 135080, curr: 136200, daily: 1120, source: 'IoT Sub-Meter', isAnomaly: true, reason: 'Flush valve continuous trickle' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            Sub-Meter Telemetry & Ingestion
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time IoT water telemetry and daily society meter batch reading uploads.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowManual(true)}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Manual Dial Log</span>
          </button>
          <button
            onClick={() => setShowCsv(true)}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Daily CSV Batch</span>
          </button>
        </div>
      </div>

      {/* Meter Readings Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Gauge className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-800">Latest Logged Meter Readings</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Live Sync Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
              <tr>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Flat</th>
                <th className="px-5 py-3.5 font-mono text-right">Prev Dial (L)</th>
                <th className="px-5 py-3.5 font-mono text-right">Current Dial (L)</th>
                <th className="px-5 py-3.5 font-mono text-right">Consumption</th>
                <th className="px-5 py-3.5">Source</th>
                <th className="px-5 py-3.5 text-center">Anomaly Flag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {readings.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-5 py-3.5 font-mono text-slate-600">{r.date}</td>
                  <td className="px-5 py-3.5 font-bold text-slate-900">Flat {r.flat}</td>
                  <td className="px-5 py-3.5 font-mono text-right text-slate-500">{r.prev.toLocaleString()}</td>
                  <td className="px-5 py-3.5 font-mono text-right font-medium text-slate-800">{r.curr.toLocaleString()}</td>
                  <td className="px-5 py-3.5 font-mono text-right font-bold text-blue-600">
                    +{r.daily.toLocaleString()} L
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">{r.source}</td>
                  <td className="px-5 py-3.5 text-center">
                    {r.isAnomaly ? (
                      <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 text-[10px] font-bold" title={r.reason}>
                        ⚠️ {r.reason ? 'Leak Spike' : 'Flagged'}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-semibold">
                        Normal
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CSVUploadModal isOpen={showCsv} onClose={() => setShowCsv(false)} />
      <ManualReadingModal isOpen={showManual} onClose={() => setShowManual(false)} householdId={1} flatNo="A-101" />
    </div>
  );
};

