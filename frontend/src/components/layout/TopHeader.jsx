import React from 'react';
import { Globe, Moon, Sun, ChevronDown, User, Shield, RefreshCw, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
    toggleSidebar
  } = useAuth();

  const navigate = useNavigate();

  const handleRoleSwitch = (newRole) => {
    setRole(newRole);
    if (newRole === 'admin') {
      navigate('/admin/tariff');
    } else {
      navigate('/resident/profile');
    }
  };

  const handleProfileClick = () => {
    if (role === 'admin') {
      navigate('/admin/profile');
    } else {
      navigate('/resident/profile');
    }
  };

  return (
    <header className="h-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200/80 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left Area: Mobile Hamburger Menu & Role Title */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Mobile Hamburger Drawer Button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Role Title */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <h1 className="text-base sm:text-lg lg:text-xl font-bold text-slate-800 tracking-tight truncate max-w-[150px] sm:max-w-xs">
            {role === 'admin' ? 'Community Admin' : 'Resident Portal'}
          </h1>

          {/* Quick Role Switcher Pill */}
          <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => handleRoleSwitch('admin')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                role === 'admin' 
                  ? 'bg-blue-600 text-white shadow-xs font-bold' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Admin View
            </button>
            <button
              onClick={() => handleRoleSwitch('resident')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                role === 'resident' 
                  ? 'bg-blue-600 text-white shadow-xs font-bold' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Resident View
            </button>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Language Selector */}
        <div className="relative group">
          <button className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 transition cursor-pointer">
            <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="hidden sm:inline">{language}</span>
            <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
          </button>
          <div className="absolute right-0 mt-1 w-28 bg-white border border-slate-200 rounded-xl shadow-lg py-1 hidden group-hover:block z-50 text-xs">
            {['English', 'Hindi', 'Kannada'].map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`w-full text-left px-3 py-1.5 hover:bg-blue-50 hover:text-blue-600 cursor-pointer ${language === lang ? 'font-bold text-blue-600 bg-blue-50/50' : 'text-slate-700'}`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition cursor-pointer"
          title="Toggle theme"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* User Profile Badge */}
        <div 
          onClick={handleProfileClick}
          className="flex items-center space-x-2 pl-1.5 sm:pl-2 border-l border-slate-200 cursor-pointer group"
          title="View Profile"
        >
          <div className="text-right hidden sm:block max-w-[220px] truncate">
            <div className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition truncate">{user.name}</div>
            <div className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">{user.role}</div>
          </div>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-blue-100 group-hover:ring-blue-300 transition shrink-0">
            {user.name?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};
