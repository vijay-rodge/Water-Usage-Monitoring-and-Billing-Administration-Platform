import React from 'react';
import { Droplets, Home, User, ShieldCheck, LogOut, Bell, FileText, Calculator } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ onOpenCalculator }) => {
  const { user, activeTab, setActiveTab, loginAsResident, loginAsAdmin, logout, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 via-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform p-2 text-white">
              <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M18 4C18 4 9 15 9 21.5C9 26.5 13 30.5 18 30.5C23 30.5 27 26.5 27 21.5C27 15 18 4 18 4Z" fill="#E0F2FE" fillOpacity="0.35"/>
                <path d="M18 7C18 7 11 16 11 21.5C11 25.4 14.1 28.5 18 28.5C21.9 28.5 25 25.4 25 21.5C25 16 18 7 18 7Z" fill="#FFFFFF"/>
                <path d="M14 20.5C15.2 19.3 16.5 19 18 20.5C19.5 22 20.8 21.7 22 20.5" stroke="#0284C7" strokeWidth="2" strokeLinecap="round"/>
                <path d="M15 24C16 23.2 17 23 18 24C19 25 20 24.8 21 24" stroke="#0284C7" strokeWidth="1.6" strokeLinecap="round" opacity="0.8"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-white">
                  Aqua<span className="text-cyan-400">Flow</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded">Smart IoT</span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Smart Monitoring & Tiered Billing</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-1 md:space-x-2">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'home' 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => setActiveTab('resident')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'resident' 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Resident Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'admin' 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Society Admin</span>
            </button>
          </nav>

          {/* Actions / User Profile */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenCalculator}
              className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-400 border border-slate-700 transition"
              title="Interactive Tariff Calculator"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Slab Calculator</span>
            </button>

            {user ? (
              <div className="flex items-center space-x-3 pl-2 border-l border-slate-800">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-semibold text-white">{user.fullName}</div>
                  <div className="text-[10px] text-cyan-400 font-mono">
                    {user.flatNo ? `Flat ${user.flatNo}` : 'Society Admin'}
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg bg-slate-800/80 hover:bg-red-500/20 hover:text-red-400 text-slate-400 border border-slate-700 transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => loginAsResident()}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/30 transition"
                >
                  Resident Demo
                </button>
                <button
                  onClick={() => loginAsAdmin()}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
                >
                  Admin Demo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

