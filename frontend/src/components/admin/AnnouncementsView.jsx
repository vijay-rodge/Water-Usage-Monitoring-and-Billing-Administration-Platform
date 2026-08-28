import React, { useState } from 'react';
import { Megaphone, Plus, Bell, Calendar, CheckCircle2 } from 'lucide-react';

export const AnnouncementsView = () => {
  const [showNew, setShowNew] = useState(false);
  const [notices, setNotices] = useState([
    { id: 1, title: 'Overhead Tank Cleaning Schedule — Wing A & B', date: '2026-08-27', author: 'Society Management Office', content: 'Water supply to Wing A & B will be regulated between 1:00 PM and 4:00 PM on Sunday for overhead storage tank bi-monthly chlorination and sanitization.', category: 'MAINTENANCE' },
    { id: 2, title: 'Borewell Sump Replenishment Notice', date: '2026-08-21', author: 'Water Committee', content: '3 bulk tanker deliveries totaling 60,000 Liters were added to the main underground sump this week. Shared costs are apportioned in the August billing statement.', category: 'WATER_SUPPLY' },
    { id: 3, title: 'Smart Sub-Meter Anomaly Alerts Activated', date: '2026-08-10', author: 'Technical Operations', content: 'Automated 24/7 leak detection is now live. Any abnormal continuous night flows (>2.5x baseline) will trigger automated alerts to resident phones.', category: 'FEATURE_UPDATE' },
  ]);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handlePost = (e) => {
    e.preventDefault();
    if (!title || !content) return;
    setNotices([
      {
        id: Date.now(),
        title,
        date: new Date().toISOString().split('T')[0],
        author: 'Society Secretary',
        content,
        category: 'ANNOUNCEMENT'
      },
      ...notices
    ]);
    setTitle('');
    setContent('');
    setShowNew(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            Society Announcements & Broadcasts
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish water supply schedules, maintenance notices, and conservation guidelines to all residents.
          </p>
        </div>

        <button
          onClick={() => setShowNew(!showNew)}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Post Announcement</span>
        </button>
      </div>

      {showNew && (
        <form onSubmit={handlePost} className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4 text-xs">
          <h3 className="font-bold text-sm text-slate-800">Compose Notice</h3>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Notice Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Scheduled Pipe Maintenance on Wing C"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Message Content</label>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Provide exact timings, affected wings, and instructions..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowNew(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold shadow-sm"
            >
              Broadcast to Residents
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {notices.map((n) => (
          <div key={n.id} className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <h3 className="font-bold text-sm text-slate-900">{n.title}</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">{n.date}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{n.content}</p>
            <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span>Posted by: {n.author}</span>
              <span className="font-semibold text-blue-600 font-mono">Sent to 48 Households</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

