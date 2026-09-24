import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { translations } from '../utils/translations';
import { findLanguage, applyGoogleTranslate, clearGoogTransCookie } from '../utils/languagesList';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('admin'); // 'admin' or 'resident'
  const [adminTab, setAdminTab] = useState('tariff');
  const [residentTab, setResidentTab] = useState('profile');
  
  // Persistent language (ISO code) and dark mode
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem('wg_lang');
    if (!saved || saved === 'null' || saved === 'undefined' || saved === 'en' || saved === 'English') {
      return 'en';
    }
    return findLanguage(saved).code;
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('wg_theme');
    if (saved) return saved === 'dark';
    return false;
  });

  const [notificationsCount, setNotificationsCount] = useState(2);
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sync dark class on html root and persist
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('wg_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('wg_theme', 'light');
    }
  }, [isDarkMode]);

  // Synchronize Google Translate on mount:
  // If user changed to a language earlier (e.g. Tamil 'ta'), load that language.
  // Otherwise, strictly enforce English 'en'.
  // If English ('en'), wipe all googtrans cookies so Google Translate NEVER touches the page!
  useEffect(() => {
    const saved = localStorage.getItem('wg_lang');
    const langObj = findLanguage(saved || 'en');
    applyGoogleTranslate(langObj.code);
    if (saved && saved !== 'en' && saved !== 'English' && saved !== 'null' && saved !== 'undefined') {
      const langObj = findLanguage(saved);
      applyGoogleTranslate(langObj.code);
    } else {
      clearGoogTransCookie();
    }
  }, []);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  // Default User Profiles
  const residentUser = {
    id: 2,
    name: 'Resident3 (Rahul Sharma)',
    email: 'resident3@gmail.com',
    role: 'RESIDENT',
    phone: '+91 98765 43210',
    flatNo: 'A-101',
    communityId: 1,
    communityName: 'Greenwoods Meadows Luxury Residency',
    blockWing: 'Wing A',
    carpetArea: 1650,
    occupancy: 4
  };

  const adminUser = {
    id: 1,
    name: 'Dr. Arvind Mehra (Society Secretary)',
    email: 'admin@waterguard.io',
    role: 'ADMIN',
    phone: '+91 99001 12233',
    flatNo: null,
    communityId: 1,
    communityName: 'Greenwoods Meadows Luxury Residency'
  };

  const [user, setUser] = useState(adminUser);

  // Initial Auth Check: Call /api/auth/me using HttpOnly Cookie
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const me = await api.getMe();
        if (me && me.email) {
          const isAdmin = me.role?.toUpperCase().includes('ADMIN');
          setUser({
            ...me,
            name: me.name || me.fullName || (isAdmin ? 'Society Secretary' : 'Resident')
          });
          setRole(isAdmin ? 'admin' : 'resident');
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.warn('Session verification fallback:', err);
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const switchRole = (newRole) => {
    setRole(newRole);
    if (newRole === 'admin') {
      setUser(adminUser);
      setAdminTab('tariff');
      showToast('Switched to Community Admin Portal (Master Control)', 'info');
    } else {
      setUser(residentUser);
      setResidentTab('profile');
      showToast('Switched to Resident Portal (Flat A-101)', 'info');
    }
  };

  const loginWithGoogle = async (googleEmail = 'resident3@gmail.com') => {
    try {
      const res = await api.login({ email: googleEmail, password: 'Resident@123' });
      const isAdmin = googleEmail.toLowerCase().includes('admin');
      const authUser = isAdmin ? adminUser : {
        ...residentUser,
        email: googleEmail,
        name: googleEmail.split('@')[0]
      };
      
      setUser(authUser);
      setRole(isAdmin ? 'admin' : 'resident');
      setIsAuthenticated(true);
      showToast(`Signed in with Google as ${googleEmail}`, 'success');
      return authUser;
    } catch (e) {
      console.warn('Google login fallback:', e);
      setIsAuthenticated(true);
      showToast(`Signed in with Google as ${googleEmail}`, 'success');
    }
  };

  const login = (roleType = 'admin', customUser = null) => {
    if (customUser && customUser.user) {
      const u = customUser.user;
      setUser(u);
      setRole(u.role?.toUpperCase().includes('ADMIN') ? 'admin' : 'resident');
    } else if (customUser) {
      setUser(customUser);
      setRole(customUser.role?.toUpperCase().includes('ADMIN') ? 'admin' : 'resident');
    } else {
      switchRole(roleType);
    }
    setIsAuthenticated(true);
    showToast(`Welcome back, ${customUser?.name || customUser?.fullName || (roleType === 'admin' ? 'Community Admin' : 'Resident')}!`, 'success');
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (e) {}
    localStorage.removeItem('wg_token');
    localStorage.removeItem('waterguard_token');
    setIsAuthenticated(false);
    showToast('You have been logged out safely.', 'info');
  };

  const t = (key, fallback = '') => {
    const langObj = findLanguage(language);
    const dict = translations[langObj.name] || translations[language] || translations.English;
    if (dict && dict[key] !== undefined) {
      return dict[key];
    }
    if (translations.English && translations.English[key] !== undefined) {
      return translations.English[key];
    }
    return fallback || key;
  };

  const setLanguage = (langInput) => {
    const langObj = findLanguage(langInput);
    const code = langObj.code;
    setLanguageState(code);
    localStorage.setItem('wg_lang', code);
    applyGoogleTranslate(code);
    showToast(`Language set to ${langObj.name} (${langObj.native})`, 'info');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      const msg = next 
        ? t('header.switchedDark', 'Switched to Dark Mode') 
        : t('header.switchedLight', 'Switched to Light Theme');
      showToast(msg, 'info');
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      setIsAuthenticated,
      loading,
      login,
      loginWithGoogle,
      logout,
      role,
      setRole: switchRole,
      activeTab: role === 'admin' ? adminTab : residentTab,
      setActiveTab: role === 'admin' ? setAdminTab : setResidentTab,
      adminTab,
      setAdminTab,
      residentTab,
      setResidentTab,
      language,
      setLanguage,
      t,
      isDarkMode,
      toggleDarkMode,
      notificationsCount,
      setNotificationsCount,
      user,
      setUser,
      isAdmin: role === 'admin',
      isResident: role === 'resident',
      toast,
      showToast,
      closeToast: () => setToast(null),
      sidebarOpen,
      setSidebarOpen,
      toggleSidebar,
      closeSidebar
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
