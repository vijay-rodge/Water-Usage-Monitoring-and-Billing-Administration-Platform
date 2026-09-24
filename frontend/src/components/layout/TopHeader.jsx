import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Globe, Moon, Sun, ChevronDown, User, Shield, RefreshCw, Menu, Search, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ALL_LANGUAGES, findLanguage } from '../../utils/languagesList';

export const TopHeader = () => {
  const { 
    role, 
    setRole, 
    user, 
    language, 
    setLanguage, 
    t,
    isDarkMode, 
    toggleDarkMode,
    toggleSidebar
  } = useAuth();

  const navigate = useNavigate();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const langDropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
    };
    if (isLangOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Auto-focus the search field when dropdown opens
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLangOpen]);

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

  const currentLang = useMemo(() => {
    return findLanguage(language);
  }, [language]);

  const filteredLanguages = useMemo(() => {
    if (!searchQuery.trim()) return ALL_LANGUAGES;
    const q = searchQuery.toLowerCase().trim();
    return ALL_LANGUAGES.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.native.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleSelectLanguage = (langCode) => {
    setLanguage(langCode);
    setIsLangOpen(false);
    setSearchQuery('');
  };

  return (
    <header className="h-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between sticky top-0 z-30 shadow-xs transition-colors shrink-0">
      {/* Left Area: Mobile Hamburger Menu & Role Title */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Mobile Hamburger Drawer Button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Role Title */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <h1 className="text-base sm:text-lg lg:text-xl font-bold text-slate-800 dark:text-white tracking-tight truncate max-w-[150px] sm:max-w-xs">
            {role === 'admin' ? t('header.communityAdmin', 'Community Admin') : t('header.residentPortal', 'Resident Portal')}
          </h1>

          {/* Role Switching Pill */}
          <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/70 dark:border-slate-700 text-xs font-semibold">
            <button
              onClick={() => handleRoleSwitch('admin')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                role === 'admin'
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('header.adminView', 'Admin View')}
            </button>
            <button
              onClick={() => handleRoleSwitch('resident')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                role === 'resident'
                  ? 'bg-cyan-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('header.residentView', 'Resident View')}
            </button>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* 100+ Searchable Language Selector */}
        <div className="relative" ref={langDropdownRef}>
          <button 
            onClick={() => setIsLangOpen(prev => !prev)}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 transition cursor-pointer shadow-xs"
            title="Translate website (100+ languages supported)"
            aria-expanded={isLangOpen}
          >
            <Globe className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="text-sm">{currentLang.flag}</span>
            <span className="hidden sm:inline font-semibold max-w-[90px] truncate">
              {currentLang.native}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Searchable Dropdown Popover */}
          {isLangOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 text-xs overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {/* Dropdown Header & Search Bar */}
              <div className="p-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60">
                <div className="flex items-center justify-between mb-1.5 px-1">
                  <div className="flex items-center space-x-1.5 font-bold text-slate-800 dark:text-white text-[11px]">
                    <Globe className="w-3 h-3 text-blue-500" />
                    <span>Select Language (Google Translate)</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {filteredLanguages.length} / {ALL_LANGUAGES.length}
                  </span>
                </div>
                
                {/* Search Input */}
                <div className="relative flex items-center">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search 100+ languages (e.g. Hindi, French)..."
                    className="w-full pl-8 pr-7 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                      aria-label="Clear search"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Scrollable Language List */}
              <div className="max-h-72 overflow-y-auto py-1 divide-y divide-slate-100/60 dark:divide-slate-800/60">
                {filteredLanguages.length > 0 ? (
                  filteredLanguages.map((opt) => {
                    const isSelected = currentLang.code.toLowerCase() === opt.code.toLowerCase();
                    return (
                      <button
                        key={opt.code}
                        onClick={() => handleSelectLanguage(opt.code)}
                        className={`w-full text-left px-3.5 py-2 flex items-center justify-between hover:bg-blue-50/80 dark:hover:bg-slate-800 cursor-pointer transition group ${
                          isSelected 
                            ? 'font-bold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-slate-800/80' 
                            : 'text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 truncate pr-2">
                          <span className="text-base leading-none shrink-0">{opt.flag}</span>
                          <div className="truncate">
                            <span className="font-semibold">{opt.native}</span>
                            <span className="text-[11px] text-slate-400 dark:text-slate-400 ml-1.5">
                              ({opt.name})
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="py-6 text-center text-slate-400 dark:text-slate-500 text-xs px-4">
                    No language matching &ldquo;<span className="text-slate-600 dark:text-slate-300 font-medium">{searchQuery}</span>&rdquo;
                  </div>
                )}
              </div>

              {/* Dropdown Footer */}
              <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-center text-[10px] text-slate-400 dark:text-slate-500">
                Powered by Google Translate &bull; Instant multi-language support
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
          title={isDarkMode ? t('header.switchedLight', 'Switch to Light Theme') : t('header.switchedDark', 'Switch to Dark Mode')}
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* User Profile Badge */}
        <div 
          onClick={handleProfileClick}
          className="flex items-center space-x-2 pl-1.5 sm:pl-2 border-l border-slate-200 dark:border-slate-700 cursor-pointer group"
          title="View Profile"
        >
          <div className="text-right hidden sm:block max-w-[220px] truncate">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition truncate">{user.name}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold tracking-wider uppercase">{user.role}</div>
          </div>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-blue-100 dark:ring-blue-900/40 group-hover:ring-blue-300 transition shrink-0">
            {user.name?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};
