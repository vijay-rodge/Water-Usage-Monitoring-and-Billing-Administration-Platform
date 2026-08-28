import React, { useState } from 'react';
import { X, Gauge, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export const ManualReadingModal = ({ isOpen, onClose, onSaved, householdId = 1, flatNo = "A-101" }) => {
  if (!isOpen) return null;

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reading, setReading] = useState('137940');
  const [remarks, setRemarks] = useState('Daily evening meter check');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.submitManualReading(householdId, date, Number(reading), remarks);
      setSuccess(true);
      if (onSaved) onSaved();
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      alert('Error saving reading');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center">
              <Gauge className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Record Water Reading</h3>
              <p className="text-xs text-slate-400">Flat {flatNo} Meter Dial Entry</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {success ? (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center text-emerald-400 space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto" />
              <div className="font-semibold text-sm">Reading Saved Successfully!</div>
              <p className="text-xs text-slate-300">Consumption and anomaly engine updated in real time.</p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Reading Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Current Dial Reading (Liters)</label>
                <input
                  type="number"
                  step="0.01"
                  value={reading}
                  onChange={(e) => setReading(e.target.value)}
                  placeholder="e.g. 137940"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono font-bold"
                  required
                />
                <span className="text-[11px] text-slate-500 mt-1 block">Previous reading: 137,510 L (+430 L today)</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Remarks / Observation</label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Routine evening check, guest visit"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white shadow-lg shadow-cyan-600/30 transition disabled:opacity-50"
                >
                  {saving ? 'Logging...' : 'Save Reading'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

