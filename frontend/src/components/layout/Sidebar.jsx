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
  X
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = () => {
  const { 
    role, 
    notificationsCount,
    logout,
    sidebarOpen,
    closeSidebar
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  // Navigation config for Admin
  const adminNavItems = [
    { id: 'dashboard', path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'households', path: '/admin/households', label: 'Households Directory', icon: Users },
    { id: 'readings', path: '/admin/readings', label: 'Meter Readings', icon: Gauge },
    { id: 'billing', path: '/admin/billing', label: 'Billing Management', icon: Receipt },
    { id: 'bulk', path: '/admin/bulk', label: 'Bulk Purchases', icon: Truck },
    { id: 'reports', path: '/admin/reports', label: 'Reports', icon: BarChart3 },
    { id: 'leakage', path: '/admin/leakage', label: 'Water Leakage', icon: Droplets },
    { id: 'support', path: '/admin/support', label: 'Support / Concerns', icon: Headphones },
    { id: 'tariff', path: '/admin/tariff', label: 'Tariff Plans', icon: Layers },
    { id: 'announcements', path: '/admin/announcements', label: 'Announcements', icon: Megaphone },
    { id: 'profile', path: '/admin/profile', label: 'Profile', icon: User },
  ];

  // Navigation config for Resident
  const residentNavItems = [
    { id: 'dashboard', path: '/resident/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'history', path: '/resident/history', label: 'Usage History', icon: Droplets },
    { id: 'bills', path: '/resident/bills', label: 'My Bills', icon: Receipt },
    { id: 'reports', path: '/resident/reports', label: 'Reports', icon: BarChart3 },
    { id: 'support', path: '/resident/support', label: 'Support / Concerns', icon: Headphones },
    { id: 'notifications', path: '/resident/notifications', label: 'Notifications', icon: Bell, badge: notificationsCount },
    { id: 'profile', path: '/resident/profile', label: 'Profile', icon: User },
  ];

  const items = role === 'admin' ? adminNavItems : residentNavItems;

  const handleNavClick = (path) => {
    navigate(path);
    closeSidebar();
  };

  const handleLogout = () => {
    logout();
    closeSidebar();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div 
          onClick={closeSidebar}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Slide-out Drawer on Mobile, Static on Desktop */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 min-h-screen shadow-2xl lg:shadow-none transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="overflow-y-auto flex-1">
          {/* Brand Header */}
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
            <div 
              onClick={() => handleNavClick(role === 'admin' ? '/admin/dashboard' : '/resident/dashboard')}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 via-sky-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20 text-white font-bold group-hover:scale-105 transition p-2">
                <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M18 4C18 4 9 15 9 21.5C9 26.5 13 30.5 18 30.5C23 30.5 27 26.5 27 21.5C27 15 18 4 18 4Z" fill="#E0F2FE" fillOpacity="0.35"/>
                  <path d="M18 7C18 7 11 16 11 21.5C11 25.4 14.1 28.5 18 28.5C21.9 28.5 25 25.4 25 21.5C25 16 18 7 18 7Z" fill="#FFFFFF"/>
                  <path d="M14 20.5C15.2 19.3 16.5 19 18 20.5C19.5 22 20.8 21.7 22 20.5" stroke="#0284C7" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M15 24C16 23.2 17 23 18 24C19 25 20 24.8 21 24" stroke="#0284C7" strokeWidth="1.6" strokeLinecap="round" opacity="0.8"/>
                </svg>
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  <span className="font-extrabold text-slate-900 text-lg tracking-tight">Aqua<span className="text-cyan-600">Flow</span></span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">SMART WATER PLATFORM</p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={closeSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              aria-label="Close sidebar menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation List */}
          <div className="px-3 sm:px-4 py-4 sm:py-5">
            <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase px-3 mb-2">
              Navigation
            </div>
            <nav className="space-y-1">
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || (location.pathname === '/' && item.id === (role === 'admin' ? 'tariff' : 'profile'));

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.path)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 font-bold shadow-xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge ? (
                      <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold shrink-0">
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
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-50 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
