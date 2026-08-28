import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Gauge, 
  Receipt, 
  Truck, 
  BarChart3, 
  Droplets, 
  Headphones, 
  Layers, 
  Megaphone, 
  User, 
  Bell, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = () => {
  const { 
    role, 
    activeTab, 
    setActiveTab, 
    notificationsCount,
    logout
  } = useAuth();

  // Navigation config for Admin
  const adminNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'households', label: 'Households Directory', icon: Users },
    { id: 'readings', label: 'Meter Readings', icon: Gauge },
    { id: 'billing', label: 'Billing Management', icon: Receipt },
    { id: 'bulk', label: 'Bulk Purchases', icon: Truck },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'leakage', label: 'Water Leakage', icon: Droplets },
    { id: 'support', label: 'Support / Concerns', icon: Headphones },
    { id: 'tariff', label: 'Tariff Plans', icon: Layers },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  // Navigation config for Resident
  const residentNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'history', label: 'Usage History', icon: Droplets },
    { id: 'bills', label: 'My Bills', icon: Receipt },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'support', label: 'Support / Concerns', icon: Headphones },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: notificationsCount },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const items = role === 'admin' ? adminNavItems : residentNavItems;

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20 text-white font-bold">
            💧
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-slate-800 text-base tracking-tight">Smart Water</span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">SMARTER BILLS</p>
          </div>
        </div>

        {/* Navigation List */}
        <div className="px-4 py-5">
          <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase px-3 mb-2">
            Navigation
          </div>
          <nav className="space-y-1">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-bold shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge ? (
                    <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Logout button at bottom */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-50 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

