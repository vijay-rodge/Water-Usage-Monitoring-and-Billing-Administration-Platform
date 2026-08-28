import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // default true for instant preview, can logout to test login screen
  const [role, setRole] = useState('admin'); // 'admin' or 'resident'
  const [adminTab, setAdminTab] = useState('tariff'); // default to 'tariff' matching screenshot 573
  const [residentTab, setResidentTab] = useState('profile'); // default to 'profile' matching screenshot 574
  const [language, setLanguage] = useState('English');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(2);

  const residentUser = {
    id: 2,
    name: 'Resident3',
    email: 'resident3@gmail.com',
    role: 'RESIDENT',
    phone: '54622578356',
    flatNo: 'A-101',
    blockWing: 'Wing A',
    carpetArea: 1650,
    occupancy: 4,
    gender: 'Not provided',
    dob: 'Not provided',
    govId: '2459553245254'
  };

  const adminUser = {
    id: 1,
    name: 'Test Admin',
    email: 'admin@waterguard.io',
    role: 'COMMUNITY ADMIN',
    phone: '+91 99001 12233',
    flatNo: null,
    gender: 'Male',
    dob: '1985-06-15',
    govId: 'AADHAAR-8921-4412-9012'
  };

  const [user, setUser] = useState(adminUser);

  const switchRole = (newRole) => {
    setRole(newRole);
    if (newRole === 'admin') {
      setUser(adminUser);
      setAdminTab('tariff');
    } else {
      setUser(residentUser);
      setResidentTab('profile');
    }
  };

  const logout = () => {
    localStorage.removeItem('waterguard_token');
    setIsAuthenticated(false);
  };

  const login = (roleType = 'admin') => {
    switchRole(roleType);
    setIsAuthenticated(true);
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      setIsAuthenticated,
      login,
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
      isDarkMode,
      toggleDarkMode,
      notificationsCount,
      setNotificationsCount,
      user: role === 'admin' ? adminUser : residentUser,
      isAdmin: role === 'admin',
      isResident: role === 'resident'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
