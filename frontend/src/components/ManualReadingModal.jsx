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
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-50 px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-xs">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Record Water Reading</h3>
              <p className="text-xs text-slate-400">Flat {flatNo} Meter Dial Entry</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
          {success ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center text-emerald-700 space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" />
              <div className="font-bold text-sm">Reading Saved Successfully!</div>
              <p className="text-xs text-emerald-600">Consumption and anomaly engine updated in real time.</p>
            </div>
          ) : (
            <>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reading Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Current Dial Reading (Liters)</label>
                <input
                  type="number"
                  step="0.01"
                  value={reading}
                  onChange={(e) => setReading(e.target.value)}
                  placeholder="e.g. 137940"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 font-mono font-bold"
                  required
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Previous reading: 137,510 L (+430 L today)</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Remarks / Observation</label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Routine evening check, guest visit"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-600 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition disabled:opacity-50 cursor-pointer"
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
