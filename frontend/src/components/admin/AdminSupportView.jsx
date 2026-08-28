import React, { useState } from 'react';
import { Headphones, MessageSquare, CheckCircle2, Clock } from 'lucide-react';

export const AdminSupportView = () => {
  const [tickets, setTickets] = useState([
    { id: 1, flat: 'A-101', resident: 'Rahul Sharma', category: 'Plumbing / Leak', subject: 'Flush tank valve continuous running', date: '2026-08-25', status: 'RESOLVED', priority: 'HIGH' },
    { id: 2, flat: 'B-202', resident: 'Priya Nair', category: 'Meter Telemetry', subject: 'Requesting sub-meter recalibration check', date: '2026-08-27', status: 'IN_PROGRESS', priority: 'MEDIUM' },
    { id: 3, flat: 'C-101', resident: 'Vikram Patel', category: 'Billing Query', subject: 'Clarification on common area tanker apportionment', date: '2026-08-28', status: 'OPEN', priority: 'LOW' },
  ]);

  const handleResolveTicket = (id) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: 'RESOLVED' } : t));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
          Support & Resident Concerns Queue
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review and resolve resident plumbing maintenance requests, meter telemetry issues, and billing questions.
        </p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
              <tr>
                <th className="px-5 py-3.5">Ticket #</th>
                <th className="px-5 py-3.5">Flat & Resident</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Subject & Description</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-5 py-3.5 font-mono font-bold text-blue-600">TCK-00{t.id}</td>
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-slate-900">Flat {t.flat}</div>
                    <div className="text-[11px] text-slate-400">{t.resident}</div>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-slate-700">{t.category}</td>
                  <td className="px-5 py-3.5 text-slate-800 font-medium">{t.subject}</td>
                  <td className="px-5 py-3.5 font-mono text-slate-500">{t.date}</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      t.status === 'RESOLVED'
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : t.status === 'IN_PROGRESS'
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'bg-amber-50 text-amber-600 border border-amber-200'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {t.status !== 'RESOLVED' && (
                      <button
                        onClick={() => handleResolveTicket(t.id)}
                        className="px-3 py-1 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 rounded-lg text-xs font-semibold transition"
                      >
                        Resolve
                      </button>
                    )}
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

