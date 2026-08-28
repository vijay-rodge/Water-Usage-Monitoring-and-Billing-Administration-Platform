import React, { useState } from 'react';
import { X, UploadCloud, FileSpreadsheet, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export const CSVUploadModal = ({ isOpen, onClose, onUploaded }) => {
  if (!isOpen) return null;

  const [file, setFile] = useState(null);
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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <UploadCloud className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Bulk Meter CSV Ingestion</h3>
              <p className="text-xs text-slate-400">Automated Society Meter Reading Pipeline</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {!result ? (
            <>
              <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-2xl p-6 text-center bg-slate-950/40 transition">
                <FileSpreadsheet className="w-10 h-10 text-cyan-400 mx-auto mb-2" />
                <div className="text-sm font-semibold text-white">Daily Society Meter Batch (CSV)</div>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Upload daily water meter reading logs with automated anomaly scanning and spike detection.
                </p>
                <div className="mt-4 inline-block text-[11px] font-mono bg-slate-900 px-3 py-1 rounded-md text-slate-400 border border-slate-800">
                  Headers: flat_no, reading_date, current_reading_liters
                </div>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs">
                <div className="text-slate-400 font-semibold mb-1">Pre-loaded Demo Batch (August 28):</div>
                <div className="font-mono text-cyan-300 text-[11px] space-y-0.5">
                  <div>✓ Flat A-101: 137,510 L (+410 L)</div>
                  <div>✓ Flat A-102: 98,620 L (+420 L)</div>
                  <div>✓ Flat B-202: 157,770 L (+480 L)</div>
                  <div className="text-amber-400">⚠️ Flat C-402: 322,400 L (+2,300 L - SPIKE)</div>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400">Processed:</span> <span className="font-bold text-white font-mono">{result.totalProcessed}</span>
                </div>
                <div>
                  <span className="text-slate-400">Successful:</span> <span className="font-bold text-emerald-400 font-mono">{result.successCount}</span>
                </div>
                <div>
                  <span className="text-slate-400">Anomalies Detected:</span> <span className="font-bold text-amber-400 font-mono">{result.anomaliesDetected}</span>
                </div>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {result.rows.map((r, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs">
                    <div className="flex items-center space-x-2">
                      {r.isAnomaly ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      <div>
                        <span className="font-semibold text-white">Flat {r.flatNo}</span>
                        <span className="text-slate-500 font-mono ml-2">{r.currentReadingLiters.toLocaleString()} L</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-cyan-400">+{r.dailyConsumptionLiters} L</span>
                      {r.isAnomaly && <span className="block text-[10px] text-amber-400 font-medium">Anomaly Flagged</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition">
            {result ? 'Done' : 'Cancel'}
          </button>
          {!result && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="flex items-center space-x-1.5 px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white shadow-lg shadow-cyan-600/30 transition disabled:opacity-50"
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

