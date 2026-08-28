import React from 'react';
import { Globe, Moon, Sun, ChevronDown, User, Shield, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const TopHeader = () => {
  const { 
    role, 
    setRole, 
    user, 
    language, 
    setLanguage, 
    isDarkMode, 
    toggleDarkMode,
    setActiveTab
  } = useAuth();

  return (
    <header className="h-16 px-6 sm:px-8 bg-white border-b border-slate-200/80 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Role Title */}
      <div className="flex items-center space-x-3">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">
          {role === 'admin' ? 'Community Admin' : 'Resident'}
        </h1>

        {/* Quick Role Switcher Pill */}
        <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setRole('admin')}
            className={`px-3 py-1 rounded-lg transition ${
              role === 'admin' 
                ? 'bg-blue-600 text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Admin View
          </button>
          <button
            onClick={() => setRole('resident')}
            className={`px-3 py-1 rounded-lg transition ${
              role === 'resident' 
                ? 'bg-blue-600 text-white shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Resident View
          </button>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-4">
        {/* Language Selector */}
        <div className="relative group">
          <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 transition">
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>{language}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
          <div className="absolute right-0 mt-1 w-28 bg-white border border-slate-200 rounded-xl shadow-lg py-1 hidden group-hover:block z-50 text-xs">
            {['English', 'Hindi', 'Kannada'].map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`w-full text-left px-3 py-1.5 hover:bg-blue-50 hover:text-blue-600 ${language === lang ? 'font-bold text-blue-600 bg-blue-50/50' : 'text-slate-700'}`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition"
          title="Toggle theme"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* User Profile Badge */}
        <div 
          onClick={() => setActiveTab('profile')}
          className="flex items-center space-x-2.5 pl-2 border-l border-slate-200 cursor-pointer group"
          title="View Profile"
        >
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition">{user.name}</div>
            <div className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">{user.role}</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-blue-100">
            {user.name?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

