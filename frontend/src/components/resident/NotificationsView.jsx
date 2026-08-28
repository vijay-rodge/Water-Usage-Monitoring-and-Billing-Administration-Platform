import React, { useState } from 'react';
import { Bell, AlertTriangle, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const NotificationsView = () => {
  const { notificationsCount, setNotificationsCount } = useAuth();

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Severe Water Leakage Suspected',
      message: 'Continuous night flow between 2:00 AM - 5:00 AM totaling 1,120 Liters. Maintenance replaced flush valve.',
      type: 'LEAK',
      severity: 'CRITICAL',
      date: '2026-08-25 07:30',
      read: false
    },
    {
      id: 2,
      title: 'Approaching Tier 2 Threshold',
      message: 'Your monthly consumption reached 12,500 Liters (83% of Tier 1 limit). Subsequent usage will be billed at Tier 2 rate.',
      type: 'SPIKE',
      severity: 'MEDIUM',
      date: '2026-08-26 18:00',
      read: false
    },
    {
      id: 3,
      title: 'August 2026 Water Statement Generated',
      message: 'Your monthly water statement of ₹626.49 is generated. Due date: 10 Sep 2026.',
      type: 'BILLING',
      severity: 'INFO',
      date: '2026-08-28 09:00',
      read: true
    },
    {
      id: 4,
      title: 'Bulk Water Tanker Inflow Received',
      message: '60,000 Liters delivered from Kavery Clean Water Tankers to replenish society sump.',
      type: 'SOCIETY',
      severity: 'INFO',
      date: '2026-08-21 16:30',
      read: true
    }
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setNotificationsCount(0);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            Notifications & Alerts
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time leak detection triggers, tier threshold alerts, and society announcements.
          </p>
        </div>

        {notificationsCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl transition"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((n) => {
          const isCritical = n.severity === 'CRITICAL';
          const isMedium = n.severity === 'MEDIUM';

          return (
            <div
              key={n.id}
              className={`p-5 rounded-3xl border transition flex items-start space-x-4 ${
                !n.read
                  ? isCritical
                    ? 'bg-red-50/50 border-red-200'
                    : 'bg-blue-50/40 border-blue-200'
                  : 'bg-white border-slate-200/80'
              }`}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shrink-0 ${
                isCritical
                  ? 'bg-red-100 text-red-600'
                  : isMedium
                  ? 'bg-amber-100 text-amber-600'
                  : 'bg-blue-100 text-blue-600'
              }`}>
                {isCritical ? <AlertTriangle className="w-5 h-5" /> : isMedium ? <AlertCircle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900">{n.title}</h4>
                  <span className="text-xs font-mono text-slate-400">{n.date}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

