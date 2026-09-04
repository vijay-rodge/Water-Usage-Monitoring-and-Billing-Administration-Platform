import React, { useState } from 'react';
import { Headphones, Plus, Send, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SupportConcernsView = () => {
  const { showToast } = useAuth();
  const [category, setCategory] = useState('PLUMBING_LEAK');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [tickets, setTickets] = useState([
    { id: 'TKT-1082', category: 'PLUMBING_LEAK', subject: 'Flush Cistern Continuous Drip', message: 'The toilet flush valve is trickling at night causing night usage alerts. Need technician visit.', date: '2026-08-25', status: 'RESOLVED', update: 'Maintenance technician Manoj replaced the cistern valve on Aug 25 11:30 AM.' },
    { id: 'TKT-1070', category: 'BILLING_QUERY', subject: 'Previous July Invoice Receipt Copy', message: 'Need signed receipt copy for tax filing.', date: '2026-08-09', status: 'RESOLVED', update: 'Receipt PDF generated and emailed to resident3@gmail.com.' },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject || !message) return;

    const newTicket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      category,
      subject,
      message,
      date: new Date().toISOString().split('T')[0],
      status: 'OPEN',
      update: 'Ticket logged with RWA Helpdesk. Technician will be assigned within 2 hours.'
    };

    setTickets([newTicket, ...tickets]);
    setSubject('');
    setMessage('');
    showToast(`Support ticket ${newTicket.id} submitted successfully!`, 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
          Support & Resident Concerns
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Raise plumbing repair requests, meter accuracy checks, and billing queries directly with RWA management.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Raise Ticket Form */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Headphones className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-800">Raise New Ticket</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Issue Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="PLUMBING_LEAK">Plumbing / Fixture Leak</option>
                <option value="METER_HARDWARE">Sub-Meter Hardware Issue</option>
                <option value="BILLING_QUERY">Billing & Tariff Query</option>
                <option value="WATER_QUALITY">Water Quality Concern</option>
                <option value="OTHER">General RWA Request</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Subject *</label>
              <input
                type="text"
                placeholder="e.g. Master bathroom tap dripping"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Detailed Description *</label>
              <textarea
                rows={4}
                placeholder="Describe the issue, location, or anomaly..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit Ticket</span>
            </button>
          </form>
        </div>

        {/* Tickets History List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-sm text-slate-800">My Raised Tickets</h3>

          <div className="space-y-3">
            {tickets.map((t) => {
              const isResolved = t.status === 'RESOLVED';

              return (
                <div
                  key={t.id}
                  className={`bg-white border rounded-3xl p-6 shadow-xs space-y-3 ${
                    isResolved ? 'border-slate-200/80' : 'border-blue-200 bg-blue-50/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs text-blue-600">{t.id}</span>
                      <h4 className="font-bold text-sm text-slate-900">{t.subject}</h4>
                    </div>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                      isResolved
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {t.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">{t.message}</p>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs space-y-1">
                    <div className="text-[11px] font-bold text-slate-500">RWA Helpdesk Response:</div>
                    <div className="text-slate-700">{t.update}</div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Category: {t.category.replace('_', ' ')}</span>
                    <span>Date: {t.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
