import React, { useState } from 'react';
import { Megaphone, Plus, Bell, Send, CheckCircle2, Pin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AnnouncementsView = () => {
  const { showToast } = useAuth();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [priority, setPriority] = useState('NORMAL');

  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'Annual Overhead Tank Deep Cleaning & Disinfection', body: 'The central overhead water tank will be isolated for bi-annual chemical disinfection on Sunday, Aug 31 from 9:00 AM to 1:00 PM. Please store adequate drinking water in advance.', priority: 'URGENT', postedBy: 'Society Secretary', date: '2026-08-27', isPinned: true },
    { id: 2, title: 'Bulk Tanker Water Tariff Revision (August Cycle)', body: 'Due to municipal summer supply cuts, bulk tanker procurements have been apportioned as per flat square footage according to society bye-laws.', priority: 'NORMAL', postedBy: 'Managing Committee', date: '2026-08-15', isPinned: false },
    { id: 3, title: 'Smart Sub-Meter Automated Leak Alert Calibration', body: 'Continuous night flow sensors (2 AM - 5 AM) are now actively triggering WhatsApp & SMS alert notifications for all residents.', priority: 'INFO', postedBy: 'Technical Team', date: '2026-08-01', isPinned: false },
  ]);

  const handlePost = (e) => {
    e.preventDefault();
    if (!title || !body) return;

    const newPost = {
      id: Date.now(),
      title,
      body,
      priority,
      postedBy: 'Society Admin',
      date: new Date().toISOString().split('T')[0],
      isPinned: priority === 'URGENT'
    };

    setAnnouncements([newPost, ...announcements]);
    setTitle('');
    setBody('');
    showToast('Society announcement published & broadcast to all 48 residents!', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
          Society Announcements & Broadcasts
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Publish maintenance notices, water rationing alerts, and RWA resolutions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left: Compose Announcement */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Megaphone className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-800">Compose Notice</h3>
          </div>

          <form onSubmit={handlePost} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Notice Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Tank cleaning schedule"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Broadcast Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="NORMAL">Normal Notice</option>
                <option value="URGENT">Urgent (Red Alert & Pinned)</option>
                <option value="INFO">Informational</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Notice Body & Details *</label>
              <textarea
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Type notice message to all residents..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast to All Flats</span>
            </button>
          </form>
        </div>

        {/* Right: Published Feed */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-sm text-slate-800">Active Notice Board</h3>
          <div className="space-y-3">
            {announcements.map((post) => (
              <div
                key={post.id}
                className={`bg-white border rounded-3xl p-6 shadow-xs space-y-2.5 ${
                  post.priority === 'URGENT' ? 'border-red-200 bg-red-50/20' : 'border-slate-200/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {post.isPinned && <Pin className="w-4 h-4 text-red-500 rotate-45" />}
                    <h4 className="font-bold text-sm text-slate-900">{post.title}</h4>
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                    post.priority === 'URGENT'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {post.priority}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{post.body}</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Posted by: {post.postedBy}</span>
                  <span>{post.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
