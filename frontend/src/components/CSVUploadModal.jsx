import React, { useState } from 'react';
import { X, UploadCloud, FileSpreadsheet, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export const CSVUploadModal = ({ isOpen, onClose, onUploaded }) => {
  if (!isOpen) return null;

  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  const sampleCsvContent = `flat_no,reading_date,current_reading_liters
A-101,2026-08-28,137510
A-102,2026-08-28,98620
B-101,2026-08-28,85850
B-202,2026-08-28,157770
C-402,2026-08-28,322400`;

  const handleUpload = async () => {
    setUploading(true);
    try {
      const res = await api.processCsvUpload(sampleCsvContent);
      setResult(res);
      if (onUploaded) onUploaded(res);
    } catch (e) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-50 px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-xs">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Bulk Meter CSV Ingestion</h3>
              <p className="text-xs text-slate-400">Automated Society Meter Reading Pipeline</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-4 text-xs">
          {!result ? (
            <>
              <div className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-2xl p-6 text-center bg-slate-50/50 transition">
                <FileSpreadsheet className="w-10 h-10 text-blue-600 mx-auto mb-2" />
                <div className="text-sm font-bold text-slate-800">Daily Society Meter Batch (CSV)</div>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Upload daily water meter reading logs with automated anomaly scanning and spike detection.
                </p>
                <div className="mt-4 inline-block text-[11px] font-mono bg-white px-3 py-1 rounded-md text-slate-500 border border-slate-200 shadow-xs">
                  Headers: flat_no, reading_date, current_reading_liters
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
                <div className="text-slate-600 font-bold mb-1.5">Pre-loaded Demo Batch (August 28):</div>
                <div className="font-mono text-slate-700 text-[11px] space-y-1">
                  <div className="text-emerald-700">✓ Flat A-101: 137,510 L (+410 L)</div>
                  <div className="text-emerald-700">✓ Flat A-102: 98,620 L (+420 L)</div>
                  <div className="text-emerald-700">✓ Flat B-202: 157,770 L (+480 L)</div>
                  <div className="text-amber-600 font-semibold">⚠️ Flat C-402: 322,400 L (+2,300 L - SPIKE FLAGGED)</div>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Processed</span>
                  <span className="font-bold text-slate-800 text-base font-mono">{result.totalProcessed}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Successful</span>
                  <span className="font-bold text-emerald-600 text-base font-mono">{result.successCount}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Anomalies</span>
                  <span className="font-bold text-amber-600 text-base font-mono">{result.anomaliesDetected}</span>
                </div>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {result.rows.map((r, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl text-xs hover:bg-slate-50 transition">
                    <div className="flex items-center space-x-2">
                      {r.isAnomaly ? (
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      )}
                      <div>
                        <span className="font-bold text-slate-800">Flat {r.flatNo}</span>
                        <span className="text-slate-400 font-mono ml-2">{r.currentReadingLiters.toLocaleString()} L</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-blue-600">+{r.dailyConsumptionLiters} L</span>
                      {r.isAnomaly && <span className="block text-[10px] text-amber-600 font-bold">Anomaly Flagged</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 sm:px-6 py-4 border-t border-slate-100 flex items-center justify-end space-x-2.5">
          <button 
            onClick={onClose} 
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-600 transition cursor-pointer"
          >
            {result ? 'Done' : 'Cancel'}
          </button>
          {!result && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition disabled:opacity-50 cursor-pointer"
            >
              <span>{uploading ? 'Processing Batch...' : 'Process Batch CSV'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
