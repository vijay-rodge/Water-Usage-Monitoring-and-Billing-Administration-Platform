import React, { useState } from 'react';
import { Headphones, CheckCircle2, Clock, AlertCircle, MessageSquare, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminSupportView = () => {
  const { showToast } = useAuth();

  const [tickets, setTickets] = useState([
    { id: 'TKT-1082', flatNo: 'A-101', resident: 'Rahul Sharma', category: 'PLUMBING_LEAK', subject: 'Flush Cistern Continuous Drip', message: 'The toilet flush valve is trickling at night causing night usage alerts. Need technician visit.', date: '2026-08-25', status: 'RESOLVED', technician: 'Manoj Kumar (Plumber)' },
    { id: 'TKT-1083', flatNo: 'B-202', resident: 'Priya Nair', category: 'BILLING_QUERY', subject: 'July Bulk Water Apportionment Clarification', message: 'Requesting breakdown of the shared pool refill apportionment on July bill.', date: '2026-08-26', status: 'OPEN', technician: 'Assigned to Accounts' },
    { id: 'TKT-1084', flatNo: 'C-101', resident: 'Vikram Patel', category: 'METER_HARDWARE', subject: 'Sub-Meter Dial Display Faint', message: 'LCD digital reading display on unit C-101 is dim. Battery replacement needed.', date: '2026-08-28', status: 'IN_PROGRESS', technician: 'IoT Vendor Team' },
  ]);

  const handleResolve = (id, flatNo) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: 'RESOLVED', technician: 'Resolved by Admin' } : t));
    showToast(`Support ticket ${id} for Flat ${flatNo} marked as Resolved!`, 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
          Support & Resident Concerns Helpdesk
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage plumbing issues, sub-meter hardware service requests, and billing disputes.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs">
          <div className="text-xs text-slate-400 font-medium">Open Tickets</div>
          <div className="text-2xl font-extrabold text-blue-600 font-mono mt-1">
            {tickets.filter(t => t.status !== 'RESOLVED').length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Pending resolution</div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs">
          <div className="text-xs text-slate-400 font-medium">Avg Resolution Time</div>
          <div className="text-2xl font-extrabold text-emerald-600 font-mono mt-1">3.4 hrs</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Fast Turnaround SLA</div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs">
          <div className="text-xs text-slate-400 font-medium">Resident Satisfaction</div>
          <div className="text-2xl font-extrabold text-purple-600 font-mono mt-1">98.2%</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Based on 48 units feedback</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-800">Support Queue</h3>

        <div className="space-y-3">
          {tickets.map((t) => {
            const isResolved = t.status === 'RESOLVED';
            const isOpen = t.status === 'OPEN';

            return (
              <div
                key={t.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isResolved ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <div className="mt-0.5 shrink-0">
                    {isResolved ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : isOpen ? (
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-blue-600 text-xs">{t.id}</span>
                      <span className="font-bold text-slate-900 text-sm">Flat {t.flatNo}</span>
                      <span className="text-xs text-slate-500">({t.resident})</span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                        isResolved
                          ? 'bg-emerald-100 text-emerald-700'
                          : isOpen
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-800 mt-1">{t.subject}</div>
                    <p className="text-xs text-slate-600 mt-0.5">{t.message}</p>
                    <div className="text-[11px] text-slate-400 font-mono mt-1">
                      Reported: {t.date} • {t.technician}
                    </div>
                  </div>
                </div>

                {!isResolved && (
                  <button
                    onClick={() => handleResolve(t.id, t.flatNo)}
                    className="self-end sm:self-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs transition flex items-center space-x-1.5 shrink-0 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Resolve Ticket</span>
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
