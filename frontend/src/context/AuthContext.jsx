import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('admin'); // 'admin' or 'resident'
  const [adminTab, setAdminTab] = useState('tariff');
  const [residentTab, setResidentTab] = useState('profile');
  const [language, setLanguage] = useState('English');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(2);
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    showToast(isDarkMode ? 'Switched to Light Theme' : 'Switched to Dark Mode', 'info');
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
      setLanguage: (lang) => {
        setLanguage(lang);
        showToast(`Language changed to ${lang}`, 'info');
      },
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
