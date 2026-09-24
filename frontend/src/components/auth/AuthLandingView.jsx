import React, { useState, useEffect } from 'react';
import {
  Building2, 
  Home, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  MapPin, 
  Hash, 
  Phone, 
  ArrowRight, 
  Shield, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  Sparkles,
  Droplets,
  Layers,
  ArrowLeft,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export const AuthLandingView = ({ onLoginSuccess, initialMode = 'landing' }) => {
  const { setRole, loginWithGoogle, showToast } = useAuth();
  const navigate = useNavigate();

  // Mode: 'landing' | 'register_community' | 'register_resident' | 'login' | 'resident_pending_success'
  const [authMode, setAuthMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pendingResidentData, setPendingResidentData] = useState(null);

  // Sync mode with route prop changes
  useEffect(() => {
    setAuthMode(initialMode);
    setError(null);
  }, [initialMode]);

  const switchMode = (newMode) => {
    setAuthMode(newMode);
    setError(null);
    if (newMode === 'landing') {
      navigate('/', { replace: true });
    } else if (newMode === 'login') {
      navigate('/login', { replace: true });
    } else if (newMode === 'register_community') {
      navigate('/register-community', { replace: true });
    } else if (newMode === 'register_resident') {
      navigate('/register-resident', { replace: true });
    }
  };

  // Available Registered Communities from PostgreSQL
  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState(null);

  // Form States for Community Registration
  const [communityForm, setCommunityForm] = useState({
    apartmentName: '',
    societyEmail: '', // New Community Email Field
    address: '',
    totalFlats: '24',
    adminFullName: '',
    adminEmail: '',
    password: ''
  });

  // Form States for Resident Registration
  const [residentForm, setResidentForm] = useState({
    apartmentId: '',
    apartmentName: '',
    flatNo: '',
    wing: 'Wing A',
    bhk: '2BHK',
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });

  // Form States for Login
  const [loginForm, setLoginForm] = useState({
    email: 'admin@waterguard.io',
    password: 'Admin@123'
  });

  // Fetch registered communities on mount and mode switch
  useEffect(() => {
    loadCommunities();
  }, [authMode]);

  const loadCommunities = async () => {
    try {
      const list = await api.getCommunities();
      const validList = Array.isArray(list) ? list : [];
      setCommunities(validList);
      if (validList.length > 0) {
        setSelectedCommunity(prev => {
          const found = validList.find(c => c.id === prev?.id) || validList[0];
          setResidentForm(rf => ({
            ...rf,
            apartmentId: found.id,
            apartmentName: found.name
          }));
          return found;
        });
      }
    } catch (e) {
      console.warn('Failed to load communities:', e);
    }
  };

  const handleCommunityChange = (e) => {
    const aptId = Number(e.target.value);
    const found = communities.find(c => c.id === aptId);
    setSelectedCommunity(found || null);
    setResidentForm({
      ...residentForm,
      apartmentId: aptId,
      apartmentName: found ? found.name : ''
    });
  };

  // Handle Community Registration (Unique Single Admin per Community)
  const handleRegisterCommunity = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.register({
        communityName: communityForm.apartmentName,
        societyEmail: communityForm.societyEmail,
        address: communityForm.address,
        city: communityForm.address || 'Bengaluru',
        totalFlats: Number(communityForm.totalFlats) || 24,
        adminName: communityForm.adminFullName,
        adminEmail: communityForm.adminEmail,
        password: communityForm.password,
        role: 'ADMIN'
      });

      showToast(`Community "${communityForm.apartmentName}" and Admin registered successfully!`, 'success');
      setRole('admin');
      if (onLoginSuccess) onLoginSuccess(res);
      navigate('/admin/tariff');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Resident Registration (Verified Community -> Sent to Admin for Approval)
  const handleRegisterResident = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const aptId = Number(residentForm.apartmentId || (selectedCommunity ? selectedCommunity.id : 1));
      const res = await api.register({
        apartmentId: residentForm.apartmentId || (selectedCommunity ? selectedCommunity.id : undefined),
        apartmentName: residentForm.apartmentName || (selectedCommunity ? selectedCommunity.name : undefined),
        communityName: residentForm.apartmentName || (selectedCommunity ? selectedCommunity.name : undefined),
        apartmentId: aptId,
        flatNo: residentForm.flatNo,
        wing: residentForm.wing,
        bhk: residentForm.bhk,
        fullName: residentForm.fullName,
        email: residentForm.email,
        phone: residentForm.phone,
        password: residentForm.password,
        role: 'RESIDENT'
      });

      setPendingResidentData({
        name: residentForm.fullName,
        email: residentForm.email,
        flatNo: residentForm.flatNo,
        community: residentForm.apartmentName || (selectedCommunity ? selectedCommunity.name : 'Your Society'),
        adminName: selectedCommunity ? selectedCommunity.adminName : 'Community Administrator'
      });
      setAuthMode('resident_pending_success');
      showToast(`Registration request for Flat ${residentForm.flatNo} sent to Community Administrator!`, 'info');
    } catch (err) {
      setError(err.message || 'Registration failed. Please verify community.');
    } finally {
      setLoading(false);
    }
  };

  // Handle User Login (With Approval Check)
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.login(loginForm.email, loginForm.password);
      const userObj = res.user || res;
      const roleStr = userObj.role || res.role || '';
      const isAdmin = roleStr.toUpperCase().includes('ADMIN') || loginForm.email.toLowerCase().includes('admin');
      
      const normalizedUser = {
        ...userObj,
        role: isAdmin ? 'ADMIN' : 'RESIDENT'
      };

      setRole(isAdmin ? 'admin' : 'resident');
      showToast(`Welcome back, ${normalizedUser.name || normalizedUser.fullName || loginForm.email}!`, 'success');
      
      if (onLoginSuccess) onLoginSuccess(res);
      navigate(isAdmin ? '/admin/tariff' : '/resident/profile');
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Quick One-Click Credentials
  const quickFillAdmin = () => {
    setLoginForm({ email: 'admin@waterguard.io', password: 'Admin@123' });
    switchMode('login');
  };

  const quickFillResident = () => {
    setLoginForm({ email: 'resident3@gmail.com', password: 'Resident@123' });
    switchMode('login');
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      await loginWithGoogle('resident3@gmail.com');
      if (onLoginSuccess) onLoginSuccess({ email: 'resident3@gmail.com', role: 'RESIDENT' });
      navigate('/resident/profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#081528] text-slate-800 font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* ========================================================================= */}
      {/* 1. MOBILE DEDICATED LANDING PAGE (Visible ONLY on mobile when mode=landing) */}
      {/* ========================================================================= */}
      {authMode === 'landing' && (
        <div className="lg:hidden min-h-screen w-full bg-gradient-to-b from-[#081528] via-[#0d2a4a] to-[#081528] text-white flex flex-col justify-between p-5 sm:p-7 relative overflow-hidden">
          {/* Background Ambient Glows */}
          <div className="absolute top-10 -left-10 w-72 h-72 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-20 right-0 w-80 h-80 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]" />

          {/* Top Brand Header */}
          <div className="relative z-10 flex items-center justify-between pb-4 border-b border-cyan-900/40">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 via-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 text-white p-2 shrink-0">
                <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M18 4C18 4 9 15 9 21.5C9 26.5 13 30.5 18 30.5C23 30.5 27 26.5 27 21.5C27 15 18 4 18 4Z" fill="#E0F2FE" fillOpacity="0.3"/>
                  <path d="M18 7C18 7 11 16 11 21.5C11 25.4 14.1 28.5 18 28.5C21.9 28.5 25 25.4 25 21.5C25 16 18 7 18 7Z" fill="#FFFFFF"/>
                  <path d="M14 20.5C15.2 19.3 16.5 19 18 20.5C19.5 22 20.8 21.7 22 20.5" stroke="#0284C7" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M15 24C16 23.2 17 23 18 24C19 25 20 24.8 21 24" stroke="#0284C7" strokeWidth="1.6" strokeLinecap="round" opacity="0.8"/>
                </svg>
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-white leading-none">Aqua<span className="text-cyan-400">Flow</span></span>
                <span className="block text-[9px] font-bold text-cyan-300/80 tracking-wider uppercase">Smart Water Platform</span>
              </div>
            </div>

            <button
              onClick={() => switchMode('login')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/30 transition cursor-pointer"
            >
              Sign In
            </button>
          </div>

          {/* Hero Content & Platform Statements */}
          <div className="relative z-10 py-6 space-y-4">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-[11px] font-semibold text-cyan-300 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Smart Water Telemetry Platform</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight text-white">
              Smart Water Management for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-teal-300">
                Modern Communities.
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              AquaFlow connects residential apartment societies with digital meter tracking, tiered fairness tariffs, and verified single-admin resident authorization.
            </p>

            {/* Feature Badges */}
            <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-cyan-200">
              <span className="px-2.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>1 Unique Admin</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>Verified Flat Join</span>
              </span>
              <span className="px-2.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>Live IoT Telemetry</span>
              </span>
            </div>
          </div>

          {/* Interactive Option Cards */}
          <div className="relative z-10 space-y-2.5 pt-1">
            <div className="text-[11px] font-bold text-cyan-300/80 uppercase tracking-wider">
              Select an option to get started:
            </div>

            {/* Option 1: Sign In */}
            <button
              onClick={() => switchMode('login')}
              className="w-full text-left p-3.5 rounded-2xl bg-gradient-to-r from-blue-900/60 to-blue-800/40 border border-blue-400/40 hover:border-blue-300 text-white flex items-center justify-between shadow-lg shadow-blue-950/40 transition active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/90 border border-blue-400/40 flex items-center justify-center shrink-0 shadow-inner">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white flex items-center space-x-1.5">
                    <span>Sign In to Portal</span>
                    <span className="text-[9px] font-semibold text-blue-200 px-1.5 py-0.5 rounded bg-blue-700/60">Google / Email</span>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">Access meter stats, billing & community dashboard</div>
                </div>
              </div>
              <div className="w-7 h-7 rounded-lg bg-blue-500/30 flex items-center justify-center text-blue-300 shrink-0 ml-2">
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            {/* Option 2: Register as Resident */}
            <button
              onClick={() => switchMode('register_resident')}
              className="w-full text-left p-3.5 rounded-2xl bg-gradient-to-r from-cyan-900/60 to-cyan-800/40 border border-cyan-400/40 hover:border-cyan-300 text-white flex items-center justify-between shadow-lg shadow-cyan-950/40 transition active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-600/90 border border-cyan-400/40 flex items-center justify-center shrink-0 shadow-inner">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white">Register as Resident</div>
                  <div className="text-[11px] text-slate-300 mt-0.5">Connect your apartment flat to verified society</div>
                </div>
              </div>
              <div className="w-7 h-7 rounded-lg bg-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0 ml-2">
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            {/* Option 3: Register Community (Society Admin) */}
            <button
              onClick={() => switchMode('register_community')}
              className="w-full text-left p-3.5 rounded-2xl bg-gradient-to-r from-indigo-900/60 to-indigo-800/40 border border-indigo-400/40 hover:border-indigo-300 text-white flex items-center justify-between shadow-lg shadow-indigo-950/40 transition active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/90 border border-indigo-400/40 flex items-center justify-center shrink-0 shadow-inner">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white">Register Your Community</div>
                  <div className="text-[11px] text-slate-300 mt-0.5">Onboard entire residential society as Society Admin</div>
                </div>
              </div>
              <div className="w-7 h-7 rounded-lg bg-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0 ml-2">
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            {/* Quick Test Demo Accounts */}
            <div className="pt-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center mb-1.5">
                Quick Demo Accounts (1-Tap Auto-fill & Login)
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={quickFillAdmin}
                  className="p-2 rounded-xl bg-blue-950/80 border border-blue-500/30 text-left hover:bg-blue-900/60 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-1 text-xs font-bold text-blue-300">
                    <Shield className="w-3.5 h-3.5 text-blue-400" />
                    <span>Admin Demo</span>
                  </div>
                  <div className="text-[10px] text-slate-300 truncate">admin@waterguard.io</div>
                </button>
                <button
                  type="button"
                  onClick={quickFillResident}
                  className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-left hover:bg-cyan-900/60 transition cursor-pointer"
                >
                  <div className="flex items-center space-x-1 text-xs font-bold text-cyan-300">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Resident Demo</span>
                  </div>
                  <div className="text-[10px] text-slate-300 truncate">resident3@gmail.com</div>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Landing Footer */}
          <div className="relative z-10 pt-4 border-t border-cyan-900/40 text-center text-[10px] text-slate-400">
            © 2026 AquaFlow Platform. Smart Water Management & Billing Platform.
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MOBILE FORM HEADER (Visible on mobile ONLY when a form mode is active)  */}
      {/* ========================================================================= */}
      {authMode !== 'landing' && (
        <div className="lg:hidden bg-gradient-to-r from-[#0a2540] via-[#0d3b66] to-[#081b33] px-4 py-3.5 text-white border-b border-cyan-900/40 sticky top-0 z-30 shadow-md backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center space-x-2.5 cursor-pointer" 
              onClick={() => switchMode('landing')}
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 via-sky-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/25 text-white p-1.5 shrink-0">
                <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M18 4C18 4 9 15 9 21.5C9 26.5 13 30.5 18 30.5C23 30.5 27 26.5 27 21.5C27 15 18 4 18 4Z" fill="#E0F2FE" fillOpacity="0.3"/>
                  <path d="M18 7C18 7 11 16 11 21.5C11 25.4 14.1 28.5 18 28.5C21.9 28.5 25 25.4 25 21.5C25 16 18 7 18 7Z" fill="#FFFFFF"/>
                  <path d="M14 20.5C15.2 19.3 16.5 19 18 20.5C19.5 22 20.8 21.7 22 20.5" stroke="#0284C7" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M15 24C16 23.2 17 23 18 24C19 25 20 24.8 21 24" stroke="#0284C7" strokeWidth="1.6" strokeLinecap="round" opacity="0.8"/>
                </svg>
              </div>
              <div>
                <span className="text-base font-extrabold tracking-tight text-white leading-none">Aqua<span className="text-cyan-400">Flow</span></span>
                <span className="block text-[8px] font-bold text-cyan-300/80 tracking-wider uppercase">Smart Water Platform</span>
              </div>
            </div>

            <button
              onClick={() => switchMode('landing')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 text-xs font-semibold border border-cyan-500/40 transition cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Overview</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. DESKTOP LEFT PANEL: HERO BRANDING & PRODUCT STATEMENT (AquaFlow)        */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex lg:w-1/2 lg:h-screen lg:sticky lg:top-0 relative bg-gradient-to-br from-[#0a2540] via-[#0d3b66] to-[#081b33] p-8 sm:p-12 lg:p-14 flex-col justify-between overflow-hidden text-white border-r border-cyan-900/40 shrink-0">
        {/* Background Overlay */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

        {/* Top Logo: AquaFlow */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => switchMode('landing')}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-400 via-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 text-white p-2">
              <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <defs>
                  <linearGradient id="landingGrad" x1="2" y1="2" x2="34" y2="34" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#E0F2FE"/>
                    <stop offset="1" stopColor="#BAE6FD"/>
                  </linearGradient>
                </defs>
                <path d="M18 4C18 4 9 15 9 21.5C9 26.5 13 30.5 18 30.5C23 30.5 27 26.5 27 21.5C27 15 18 4 18 4Z" fill="url(#landingGrad)" fillOpacity="0.3"/>
                <path d="M18 7C18 7 11 16 11 21.5C11 25.4 14.1 28.5 18 28.5C21.9 28.5 25 25.4 25 21.5C25 16 18 7 18 7Z" fill="#FFFFFF"/>
                <path d="M14 20.5C15.2 19.3 16.5 19 18 20.5C19.5 22 20.8 21.7 22 20.5" stroke="#0284C7" strokeWidth="2" strokeLinecap="round"/>
                <path d="M15 24C16 23.2 17 23 18 24C19 25 20 24.8 21 24" stroke="#0284C7" strokeWidth="1.6" strokeLinecap="round" opacity="0.8"/>
              </svg>
            </div>
            <div className="text-2xl font-extrabold tracking-tight text-white flex items-center">
              Aqua<span className="text-cyan-400">Flow</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={() => switchMode('login')}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
                authMode === 'login' 
                  ? 'bg-white/20 text-white border border-white/30' 
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => switchMode('register_community')}
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
                authMode === 'register_community' 
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30' 
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Register Community
            </button>
          </div>
        </div>

        {/* Center Hero Statement */}
        <div className="relative z-10 my-auto max-w-xl space-y-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-white">
            Smart Water Management for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-teal-300">
              Modern Communities.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-lg font-normal">
            AquaFlow connects residential apartment societies with digital meter tracking, tiered fairness tariffs, and verified single-admin resident authorization.
          </p>

          {/* Quick Feature Pills */}
          <div className="pt-2 flex flex-wrap gap-2.5 text-xs text-cyan-200">
            <span className="px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span>1 Unique Admin Per Community</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span>Verified Society Join Requests</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span>PostgreSQL & JWT Telemetry</span>
            </span>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-6 border-t border-white/10">
          <span>© 2026 AquaFlow Platform. All rights reserved.</span>
          <button 
            onClick={() => switchMode('register_resident')}
            className="text-cyan-300 hover:text-cyan-200 font-semibold flex items-center space-x-1.5 transition cursor-pointer"
          >
            <span>Register as Resident</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. RIGHT PANEL: REGISTRATION, LOGIN & WELCOME PORTAL FORMS                */}
      {/* ========================================================================= */}
      <div className={`${authMode === 'landing' ? 'hidden lg:flex' : 'flex'} flex-1 min-h-[calc(100vh-60px)] lg:min-h-screen bg-slate-50 dark:bg-[#0b1120] flex-col justify-center items-center px-4 py-6 sm:px-8 sm:py-10 lg:p-12 overflow-y-auto transition-colors`}>
        <div className="w-full max-w-lg space-y-4 sm:space-y-6 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Universal 3-Mode Segmented Switcher (Instant 1-tap switching on all devices) */}
          <div className="grid grid-cols-3 p-1 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xs text-xs font-semibold gap-1">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`py-2 px-1 sm:px-2 rounded-xl transition-all text-center truncate cursor-pointer ${
                authMode === 'login'
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchMode('register_resident')}
              className={`py-2 px-1 sm:px-2 rounded-xl transition-all text-center truncate cursor-pointer ${
                authMode === 'register_resident'
                  ? 'bg-cyan-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Resident Flat
            </button>
            <button
              type="button"
              onClick={() => switchMode('register_community')}
              className={`py-2 px-1 sm:px-2 rounded-xl transition-all text-center truncate cursor-pointer ${
                authMode === 'register_community'
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Society Admin
            </button>
          </div>
          
          {/* Error Message Box */}
          {error && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-2xl text-xs text-rose-700 dark:text-rose-300 flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <div className="flex-1 font-medium leading-relaxed">{error}</div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* SCREEN 0: WELCOME PORTAL HUB (For Desktop when authMode === 'landing')  */}
          {/* ===================================================================== */}
          {authMode === 'landing' && (
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950/60 border border-cyan-300 dark:border-cyan-800 text-xs font-semibold text-cyan-800 dark:text-cyan-300 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>Welcome to AquaFlow Portal</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Get Started with AquaFlow
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Select your role or desired action below to access your water management portal.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xl shadow-slate-100 dark:shadow-none space-y-4">
                {/* Option 1: Sign In */}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="w-full text-left p-4 rounded-2xl border border-blue-200 dark:border-blue-800/80 bg-blue-50/70 dark:bg-blue-950/30 hover:bg-blue-100/70 dark:hover:bg-blue-900/40 transition flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/30 shrink-0">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                        <span>Sign In to Portal</span>
                        <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 rounded-full">Gmail / Email</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Access your existing society admin or resident flat account
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs group-hover:translate-x-1 transition">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>

                {/* Option 2: Register Flat */}
                <button
                  type="button"
                  onClick={() => switchMode('register_resident')}
                  className="w-full text-left p-4 rounded-2xl border border-cyan-200 dark:border-cyan-800/80 bg-cyan-50/70 dark:bg-cyan-950/30 hover:bg-cyan-100/70 dark:hover:bg-cyan-900/40 transition flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-11 h-11 rounded-xl bg-cyan-600 text-white flex items-center justify-center shadow-md shadow-cyan-600/30 shrink-0">
                      <Home className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        Register as Flat Resident
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Connect your flat to a verified society and send join request to admin
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shadow-xs group-hover:translate-x-1 transition">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>

                {/* Option 3: Register Community */}
                <button
                  type="button"
                  onClick={() => switchMode('register_community')}
                  className="w-full text-left p-4 rounded-2xl border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/70 dark:bg-indigo-950/30 hover:bg-indigo-100/70 dark:hover:bg-indigo-900/40 transition flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30 shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        Register Your Community
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Onboard your apartment society and create the single verified admin
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs group-hover:translate-x-1 transition">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>

                {/* Quick Demo Test Accounts */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-center">
                    Quick Test Credentials (Auto-fill)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={quickFillAdmin}
                      className="p-2.5 rounded-xl border border-blue-200 dark:border-blue-800/60 bg-blue-50/70 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-left transition cursor-pointer"
                    >
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-700 dark:text-blue-300">
                        <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span>Admin Demo</span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">admin@waterguard.io</div>
                      <div className="text-[9px] text-slate-400 dark:text-slate-500 font-mono">Password: Admin@123</div>
                    </button>

                    <button
                      type="button"
                      onClick={quickFillResident}
                      className="p-2.5 rounded-xl border border-cyan-200 dark:border-cyan-800/60 bg-cyan-50/70 dark:bg-cyan-950/30 hover:bg-cyan-100 dark:hover:bg-cyan-900/40 text-left transition cursor-pointer"
                    >
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-cyan-700 dark:text-cyan-300">
                        <User className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                        <span>Resident Demo</span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">resident3@gmail.com</div>
                      <div className="text-[9px] text-slate-400 dark:text-slate-500 font-mono">Password: Resident@123</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* SCREEN: RESIDENT PENDING APPROVAL CONFIRMATION                         */}
          {/* ===================================================================== */}
          {authMode === 'resident_pending_success' && pendingResidentData && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl dark:shadow-none text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-inner">
                <Clock className="w-8 h-8 animate-pulse" />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Request Sent to Community Admin!</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
                  Your registration for <strong className="text-slate-800 dark:text-slate-200">Flat {pendingResidentData.flatNo}</strong> in <strong className="text-slate-800 dark:text-slate-200">{pendingResidentData.community}</strong> has been submitted.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-left text-xs text-amber-900 dark:text-amber-200 space-y-2">
                <div className="font-bold flex items-center space-x-1.5 text-amber-800 dark:text-amber-300">
                  <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>Awaiting Approval from: {pendingResidentData.adminName}</span>
                </div>
                <p className="text-[11px] text-amber-700 dark:text-amber-300/80 leading-snug">
                  To protect community water data, each flat request must be authorized by your society's designated administrator. As soon as the admin approves, your dashboard and live meter telemetry will be activated and you can sign in with {pendingResidentData.email}.
                </p>
              </div>

              <button
                onClick={() => switchMode('login')}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                Go to Sign In Page
              </button>
            </div>
          )}

          {/* ===================================================================== */}
          {/* FORM 1: REGISTER YOUR COMMUNITY (With Community Email & Unique Admin) */}
          {/* ===================================================================== */}
          {authMode === 'register_community' && (
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Register Your Community
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Onboard your residential society or apartment community on AquaFlow. Each community has one designated administrator.
                </p>
              </div>

              {/* Responsive Card Container */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-xl dark:shadow-none space-y-4 sm:space-y-5">
                <form onSubmit={handleRegisterCommunity} className="space-y-4 text-xs">
                  {/* Section 1 Header */}
                  <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-bold text-[11px] tracking-wider uppercase">
                    <Building2 className="w-4 h-4" />
                    <span>1. COMMUNITY / SOCIETY INFORMATION</span>
                  </div>

                  {/* Apartment / Community Name */}
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">
                      Apartment / Community Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="e.g. Palm Meadows Residences"
                        value={communityForm.apartmentName}
                        onChange={(e) => setCommunityForm({ ...communityForm, apartmentName: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 transition"
                        required
                      />
                    </div>
                  </div>

                  {/* Community Official Email */}
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">
                      Community Official Email <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        placeholder="e.g. office@palmmeadows.com"
                        value={communityForm.societyEmail}
                        onChange={(e) => setCommunityForm({ ...communityForm, societyEmail: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 transition font-mono"
                        required
                      />
                    </div>
                  </div>

                  {/* Address & Total Flats Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">Address / City</label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="e.g. Sector 4, Bangalore"
                          value={communityForm.address}
                          onChange={(e) => setCommunityForm({ ...communityForm, address: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">
                        Total Flats <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Home className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="number"
                          placeholder="24"
                          value={communityForm.totalFlats}
                          onChange={(e) => setCommunityForm({ ...communityForm, totalFlats: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 transition font-mono"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2 Header */}
                  <div className="pt-2 flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-bold text-[11px] tracking-wider uppercase border-t border-slate-100 dark:border-slate-800">
                    <Shield className="w-4 h-4" />
                    <span>2. COMMUNITY ADMINISTRATOR CREDENTIALS (UNIQUE)</span>
                  </div>

                  {/* Admin Full Name */}
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">
                      Admin Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Robert Vance"
                        value={communityForm.adminFullName}
                        onChange={(e) => setCommunityForm({ ...communityForm, adminFullName: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 transition"
                        required
                      />
                    </div>
                  </div>

                  {/* Admin Email & Password Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">
                        Admin Email <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          placeholder="admin@palmmeadows.com"
                          value={communityForm.adminEmail}
                          onChange={(e) => setCommunityForm({ ...communityForm, adminEmail: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 transition font-mono"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">
                        Password <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={communityForm.password}
                          onChange={(e) => setCommunityForm({ ...communityForm, password: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-9 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 transition font-mono"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/25 transition disabled:opacity-50 cursor-pointer"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>{loading ? 'Creating Community...' : 'Create Community Account'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Bottom Switchers */}
              <div className="text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
                <div>
                  Already have an AquaFlow account?{' '}
                  <button
                    onClick={() => switchMode('login')}
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Sign In here
                  </button>
                </div>
                <div>
                  Are you an apartment resident?{' '}
                  <button
                    onClick={() => switchMode('register_resident')}
                    className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
                  >
                    Register as Resident
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* FORM 2: REGISTER AS RESIDENT (Community Verified & Admin Directed)   */}
          {/* ===================================================================== */}
          {authMode === 'register_resident' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Register as Resident
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Connect your apartment flat to AquaFlow. Registration requests are verified against registered communities and sent to your unique Community Administrator.
                </p>
              </div>

              {/* White Card Container */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-xl shadow-slate-100 dark:shadow-none space-y-5">
                <form onSubmit={handleRegisterResident} className="space-y-4 text-xs">
                  {/* Section 1: Residential Unit */}
                  <div className="flex items-center space-x-2 text-cyan-600 dark:text-cyan-400 font-bold text-[11px] tracking-wider uppercase">
                    <Home className="w-4 h-4" />
                    <span>1. SELECT VERIFIED RESIDENTIAL COMMUNITY</span>
                  </div>

                  {/* Registered Community Select Dropdown */}
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Residential Society / Community <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        value={residentForm.apartmentId || ''}
                        onChange={handleCommunityChange}
                        className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 font-semibold focus:outline-none focus:border-cyan-500 focus:bg-white dark:focus:bg-slate-800 transition cursor-pointer"
                        required
                      >
                        {communities.length === 0 ? (
                          <option value="" disabled>Loading active communities...</option>
                        ) : (
                          <option value="" disabled>-- Select Your Residential Community --</option>
                        )}
                        {communities.map(c => (
                          <option key={c.id} value={c.id} className="dark:bg-slate-800">
                            {c.name} ({c.city || 'Bengaluru'}) — Admin: {c.adminName || 'Secretary'}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Community Admin Verification Indicator */}
                    {selectedCommunity && (
                      <div className="mt-2 p-2.5 rounded-xl bg-cyan-50/80 dark:bg-cyan-950/40 border border-cyan-200/80 dark:border-cyan-800/60 text-[11px] text-cyan-900 dark:text-cyan-200 flex items-center justify-between">
                        <div className="flex items-center space-x-1.5">
                          <Check className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0 font-bold" />
                          <span>
                            Verified Community: <strong>{selectedCommunity.name}</strong>
                          </span>
                        </div>
                        <span className="text-cyan-700 dark:text-cyan-300 font-medium">
                          Admin: {selectedCommunity.adminName}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Flat No and Wing */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Flat / Unit No. <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="e.g. A-101"
                          value={residentForm.flatNo}
                          onChange={(e) => setResidentForm({ ...residentForm, flatNo: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500 focus:bg-white dark:focus:bg-slate-800 transition font-mono"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Wing / Typology</label>
                      <select
                        value={residentForm.bhk}
                        onChange={(e) => setResidentForm({ ...residentForm, bhk: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500"
                      >
                        <option value="1BHK" className="dark:bg-slate-800">1BHK</option>
                        <option value="2BHK" className="dark:bg-slate-800">2BHK</option>
                        <option value="3BHK" className="dark:bg-slate-800">3BHK</option>
                        <option value="4BHK" className="dark:bg-slate-800">4BHK</option>
                        <option value="PENTHOUSE" className="dark:bg-slate-800">PENTHOUSE</option>
                      </select>
                    </div>
                  </div>

                  {/* Section 2: Resident Credentials */}
                  <div className="pt-2 flex items-center space-x-2 text-cyan-600 dark:text-cyan-400 font-bold text-[11px] tracking-wider uppercase border-t border-slate-100 dark:border-slate-800">
                    <User className="w-4 h-4" />
                    <span>2. RESIDENT ACCOUNT CREDENTIALS</span>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Rahul Sharma"
                        value={residentForm.fullName}
                        onChange={(e) => setResidentForm({ ...residentForm, fullName: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500 focus:bg-white dark:focus:bg-slate-800 transition"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          placeholder="resident@example.com"
                          value={residentForm.email}
                          onChange={(e) => setResidentForm({ ...residentForm, email: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500 focus:bg-white dark:focus:bg-slate-800 transition font-mono"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="+91 98765 43210"
                          value={residentForm.phone}
                          onChange={(e) => setResidentForm({ ...residentForm, phone: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500 focus:bg-white dark:focus:bg-slate-800 transition font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={residentForm.password}
                        onChange={(e) => setResidentForm({ ...residentForm, password: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-9 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500 focus:bg-white dark:focus:bg-slate-800 transition font-mono"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/25 transition disabled:opacity-50 cursor-pointer"
                  >
                    <Home className="w-4 h-4" />
                    <span>{loading ? 'Submitting Request...' : 'Submit Flat Join Request'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Bottom Navigation Switcher */}
              <div className="text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
                <div>
                  Already registered & approved?{' '}
                  <button
                    onClick={() => switchMode('login')}
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Sign In here
                  </button>
                </div>
                <div>
                  Are you a Society Administrator?{' '}
                  <button
                    onClick={() => switchMode('register_community')}
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Register Your Community
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================== */}
          {/* FORM 3: SIGN IN TO AQUAFLOW (Registered Users)                         */}
          {/* ===================================================================== */}
          {authMode === 'login' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Welcome Back to AquaFlow
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Sign in with your registered credentials to access your community water portal.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-xl shadow-slate-100 dark:shadow-none space-y-5">
                {/* Google One-Click Login */}
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-3 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs transition hover:border-slate-300 dark:hover:border-slate-600 disabled:opacity-50 cursor-pointer"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Continue with Google (Gmail)</span>
                </button>

                <div className="flex items-center space-x-2 text-slate-300 dark:text-slate-700">
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
                  <span className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 font-medium uppercase text-center">Or Sign In with Email</span>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition font-mono"
                        placeholder="name@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">Password</label>
                      <span className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Forgot?</span>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-9 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition font-mono"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/25 transition disabled:opacity-50 cursor-pointer"
                  >
                    <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Quick 1-Click Demo Accounts */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-center">
                    Quick Test Credentials (Auto-fill)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={quickFillAdmin}
                      className="p-2.5 rounded-xl border border-blue-200 dark:border-blue-800/60 bg-blue-50/70 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-left transition cursor-pointer"
                    >
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-700 dark:text-blue-300">
                        <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span>Admin Demo</span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">admin@waterguard.io</div>
                      <div className="text-[9px] text-slate-400 dark:text-slate-500 font-mono">Password: Admin@123</div>
                    </button>

                    <button
                      type="button"
                      onClick={quickFillResident}
                      className="p-2.5 rounded-xl border border-cyan-200 dark:border-cyan-800/60 bg-cyan-50/70 dark:bg-cyan-950/30 hover:bg-cyan-100 dark:hover:bg-cyan-900/40 text-left transition cursor-pointer"
                    >
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-cyan-700 dark:text-cyan-300">
                        <User className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                        <span>Resident Demo</span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">resident3@gmail.com</div>
                      <div className="text-[9px] text-slate-400 dark:text-slate-500 font-mono">Password: Resident@123</div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Switchers */}
              <div className="text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
                <div>
                  Don't have an account yet?
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-xs">
                  <button
                    onClick={() => switchMode('register_community')}
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    🏢 Register Your Community
                  </button>
                  <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
                  <button
                    onClick={() => switchMode('register_resident')}
                    className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
                  >
                    🏠 Register as Resident
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
