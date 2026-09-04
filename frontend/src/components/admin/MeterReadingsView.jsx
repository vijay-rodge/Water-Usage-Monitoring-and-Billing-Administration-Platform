import React, { useState } from 'react';
import { Gauge, UploadCloud, Plus, AlertTriangle, CheckCircle2, Download, Search } from 'lucide-react';
import { CSVUploadModal } from '../CSVUploadModal';
import { ManualReadingModal } from '../ManualReadingModal';
import { useAuth } from '../../context/AuthContext';

export const MeterReadingsView = () => {
  const { showToast } = useAuth();
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [readings, setReadings] = useState([
    { id: 1, flatNo: 'A-101', meterSerial: 'WM-SN-A101-2024', readingDate: '2026-08-28', previousReading: 137510, currentReading: 137940, consumption: 430, isAnomaly: false, source: 'IOT_AUTOMATED' },
    { id: 2, flatNo: 'A-102', meterSerial: 'WM-SN-A102-2024', readingDate: '2026-08-28', previousReading: 98200, currentReading: 98620, consumption: 420, isAnomaly: false, source: 'IOT_AUTOMATED' },
    { id: 3, flatNo: 'B-101', meterSerial: 'WM-SN-B101-2024', readingDate: '2026-08-28', previousReading: 85400, currentReading: 85850, consumption: 450, isAnomaly: false, source: 'MANUAL_ENTRY' },
    { id: 4, flatNo: 'B-202', meterSerial: 'WM-SN-B202-2024', readingDate: '2026-08-28', previousReading: 157290, currentReading: 157770, consumption: 480, isAnomaly: false, source: 'IOT_AUTOMATED' },
    { id: 5, flatNo: 'C-402', meterSerial: 'WM-SN-C402-2024', readingDate: '2026-08-28', previousReading: 320100, currentReading: 322400, consumption: 2300, isAnomaly: true, anomalyReason: 'Spike >2.5x normal baseline', source: 'CSV_BATCH' },
  ]);

  const handleManualSaved = () => {
    showToast('Manual dial reading recorded and synced to database!', 'success');
  };

  const handleCsvUploaded = (res) => {
    showToast(`CSV Batch processed! ${res.successCount} readings updated, ${res.anomaliesDetected} anomaly flagged.`, 'success');
  };

  const filtered = readings.filter(r => 
    r.flatNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.meterSerial.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            Sub-Meter Telemetry & Ingestion
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time digital IoT dial logs, manual entry backups, and bulk CSV batch ingestion.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4 text-blue-600" />
            <span>Manual Dial Log</span>
          </button>

          <button
            onClick={() => setIsCsvModalOpen(true)}
            className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Daily CSV Batch</span>
          </button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs">
          <div className="text-xs text-slate-400 font-medium">Readings Ingested Today</div>
          <div className="text-2xl font-extrabold text-blue-600 font-mono mt-1">48 / 48</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">100% Coverage (Aug 28)</div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs">
          <div className="text-xs text-slate-400 font-medium">Total Daily Society Inflow</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">16,900 L</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Across all 48 flat meters</div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs">
          <div className="text-xs text-slate-400 font-medium">Anomalies Detected</div>
          <div className="text-2xl font-extrabold text-amber-500 font-mono mt-1">1 Spike</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Flat C-402 (+2,300 L)</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search flat or meter serial..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>
          <span className="text-xs text-slate-400 font-mono">Date: 2026-08-28</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
              <tr>
                <th className="px-5 py-3.5">Unit & Hardware S/N</th>
                <th className="px-5 py-3.5 text-right">Previous Reading</th>
                <th className="px-5 py-3.5 text-right">Current Dial</th>
                <th className="px-5 py-3.5 text-right">Daily Consumption</th>
                <th className="px-5 py-3.5">Ingestion Channel</th>
                <th className="px-5 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-5 py-3.5">
                    <span className="font-bold text-slate-900">Flat {r.flatNo}</span>
                    <div className="text-[11px] text-slate-400 font-mono">{r.meterSerial}</div>
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono text-slate-500">
                    {r.previousReading.toLocaleString()} L
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono text-slate-900 font-bold">
                    {r.currentReading.toLocaleString()} L
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono font-extrabold text-blue-600">
                    +{r.consumption.toLocaleString()} L
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono font-semibold">
                      {r.source}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    {r.isAnomaly ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold inline-flex items-center space-x-1">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        <span>Spike Flagged</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold inline-flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Normal</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CSVUploadModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onUploaded={handleCsvUploaded}
      />

      <ManualReadingModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onSaved={handleManualSaved}
      />
    </div>
  );
};
