import React, { useState } from 'react';
import { Headphones, Plus, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export const SupportConcernsView = () => {
  const [showForm, setShowForm] = useState(false);
  const [tickets, setTickets] = useState([
    { id: 1, category: 'Plumbing Leak', subject: 'Toilet flush valve continuous trickle', date: '2026-08-25', status: 'RESOLVED', response: 'Maintenance technician replaced flush seal. Leak fixed.' },
    { id: 2, category: 'Billing Query', subject: 'Inquiry regarding Tier 2 rate calculation', date: '2026-08-15', status: 'RESOLVED', response: 'Clarification provided: Tier 2 applies to volume exceeding 10,000 L.' },
  ]);

  const [category, setCategory] = useState('Plumbing / Leak Inspection');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject) return;

    setTickets([
      {
        id: Date.now(),
        category,
        subject,
        date: new Date().toISOString().split('T')[0],
        status: 'OPEN',
        response: 'Under review by society maintenance staff.'
      },
      ...tickets
    ]);

    setSubject('');
    setDescription('');
    setShowForm(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            Support & Maintenance Concerns
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Report plumbing leak emergencies, request sub-meter recalibration, or contact society maintenance.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Raise Support Ticket</span>
        </button>
      </div>

      {submitted && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Your support ticket has been submitted to the society estate management team!</span>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4 text-xs">
          <h3 className="font-bold text-sm text-slate-800">New Request / Plumbing Ticket</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Issue Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option>Plumbing / Leak Inspection</option>
                <option>Smart Sub-Meter Telemetry Error</option>
                <option>Billing Statement Dispute</option>
                <option>Water Quality / Tanker Inquiry</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Master bathroom tap dripping constantly"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Detailed Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe when the issue started and preferred visit time..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold shadow-xs"
            >
              Submit Ticket
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {tickets.map((t) => (
          <div key={t.id} className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-blue-600 font-bold text-xs">TCK-00{t.id}</span>
                <h4 className="font-bold text-sm text-slate-900">{t.subject}</h4>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                t.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-amber-50 text-amber-600 border border-amber-200'
              }`}>
                {t.status}
              </span>
            </div>
            <p className="text-xs text-slate-600">{t.response}</p>
            <div className="text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-100 flex justify-between">
              <span>Category: {t.category}</span>
              <span>Logged: {t.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

