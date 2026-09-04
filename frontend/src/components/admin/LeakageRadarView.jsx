import React, { useState } from 'react';
import { Droplets, AlertTriangle, CheckCircle2, Search, Filter, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LeakageRadarView = () => {
  const { showToast } = useAuth();

  const [leaks, setLeaks] = useState([
    { id: 1, flatNo: 'A-101', resident: 'Rahul Sharma', leakType: 'Night Trickle Leak (2am-5am)', excessLiters: '2,070 L', estimatedLoss: '₹144.90', severity: 'CRITICAL', detectedOn: '2026-08-25 04:15', status: 'RESOLVED', notes: 'Replaced toilet flush cistern valve' },
    { id: 2, flatNo: 'C-402', resident: 'Meera Deshmukh', leakType: 'Sudden Flow Spike (>2.5x)', excessLiters: '4,600 L', estimatedLoss: '₹345.00', severity: 'HIGH', detectedOn: '2026-08-27 19:30', status: 'INVESTIGATING', notes: 'Terrace garden drip irrigation pipeline joint loose' },
    { id: 3, flatNo: 'B-101', resident: 'Deepak Verma', leakType: 'Baseline Micro-Leakage', excessLiters: '850 L', estimatedLoss: '₹59.50', severity: 'MEDIUM', detectedOn: '2026-08-28 02:00', status: 'PENDING', notes: 'Master bathroom continuous sink tap drip' },
  ]);

  const handleResolve = (id, flatNo) => {
    setLeaks(leaks.map(l => l.id === id ? { ...l, status: 'RESOLVED', notes: 'Fixed by society maintenance technician' } : l));
    showToast(`Leak on Flat ${flatNo} marked as Repaired & Resolved!`, 'success');
  };

  const handleScanNow = () => {
    showToast('Radar scanning 48 sub-meters for night flow baseline anomalies...', 'info');
    setTimeout(() => {
      showToast('Scan complete: 1 active leak investigated, 0 new leaks found.', 'success');
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            Water Leakage & Anomaly Radar
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time heuristic & ML baseline scanning for continuous night flows, pipe bursts, and fixture drips.
          </p>
        </div>

        <button
          onClick={handleScanNow}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition cursor-pointer"
        >
          <Droplets className="w-4 h-4" />
          <span>Trigger Radar Scan</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs">
          <div className="text-xs text-slate-400 font-medium">Active Anomalies</div>
          <div className="text-2xl font-extrabold text-amber-500 font-mono mt-1">
            {leaks.filter(l => l.status !== 'RESOLVED').length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Requiring plumbing attention</div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs">
          <div className="text-xs text-slate-400 font-medium">Estimated Water Wastage</div>
          <div className="text-2xl font-extrabold text-blue-600 font-mono mt-1">7,520 L</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Across society this month</div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs">
          <div className="text-xs text-slate-400 font-medium">Resolution Rate</div>
          <div className="text-2xl font-extrabold text-emerald-600 font-mono mt-1">88.5%</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Average repair turnaround: 4.2 hrs</div>
        </div>
      </div>

      {/* Leaks Feed */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-800">Flagged Leak Incidents</h3>

        <div className="space-y-3">
          {leaks.map((leak) => {
            const isResolved = leak.status === 'RESOLVED';
            const isCritical = leak.severity === 'CRITICAL';

            return (
              <div
                key={leak.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isResolved
                    ? 'bg-slate-50 border-slate-200 text-slate-500'
                    : isCritical
                    ? 'bg-red-50/60 border-red-200'
                    : 'bg-amber-50/60 border-amber-200'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <div className="mt-0.5 shrink-0">
                    {isResolved ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : isCritical ? (
                      <AlertTriangle className="w-5 h-5 text-red-600 animate-pulse" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">Flat {leak.flatNo}</span>
                      <span className="text-xs text-slate-500">({leak.resident})</span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                        isResolved
                          ? 'bg-emerald-100 text-emerald-700'
                          : isCritical
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {leak.status}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-800 mt-1">{leak.leakType}</div>
                    <p className="text-xs text-slate-500 mt-0.5">{leak.notes}</p>
                    <div className="text-[11px] text-slate-400 font-mono mt-1">
                      Detected: {leak.detectedOn} • Excess: {leak.excessLiters} ({leak.estimatedLoss})
                    </div>
                  </div>
                </div>

                {!isResolved && (
                  <button
                    onClick={() => handleResolve(leak.id, leak.flatNo)}
                    className="self-end sm:self-auto px-4 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold text-xs shadow-xs transition flex items-center space-x-1.5 shrink-0 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Mark Repaired & Resolved</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
