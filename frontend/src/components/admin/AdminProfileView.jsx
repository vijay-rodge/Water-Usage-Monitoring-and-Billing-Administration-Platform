import React, { useState } from 'react';
import { User, Mail, Phone, Shield, Building2, Save, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminProfileView = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    fullName: user.name || 'Dr. Arvind Mehra',
    title: 'Society General Secretary & Water In-Charge',
    email: user.email || 'admin@waterguard.io',
    phone: user.phone || '+91 99001 12233',
    society: 'Greenwoods Meadows Luxury Residency',
    societyCode: 'GWM-BLR-01',
    address: 'Plot 42, Sarjapur Outer Ring Road, Bellandur, Bengaluru',
    govId: 'AADHAAR-8921-4412-9012'
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
        <div className="h-36 sm:h-44 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-600 relative">
          <div className="absolute top-4 right-4 flex items-center space-x-2">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold text-white border border-white/30">
              Community Administration Credential
            </span>
          </div>
        </div>

        <div className="px-6 sm:px-8 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-8">
            <div className="flex items-end space-x-4">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-indigo-600 border-4 border-white shadow-lg flex items-center justify-center text-white text-4xl font-bold">
                {profile.fullName.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">{profile.fullName}</h2>
                <div className="flex items-center space-x-2 mt-0.5">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{profile.title}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500">{profile.society}</span>
                </div>
              </div>
            </div>
          </div>

          {saved && (
            <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-700 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Admin credentials updated successfully!</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400 font-medium">Administrator Name</div>
                <div className="text-xs font-bold text-slate-800 mt-0.5">{profile.fullName}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400 font-medium">Official Email</div>
                <div className="text-xs font-bold text-slate-800 mt-0.5">{profile.email}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400 font-medium">Helpline Contact</div>
                <div className="text-xs font-bold text-slate-800 mt-0.5 font-mono">{profile.phone}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400 font-medium">Society Code</div>
                <div className="text-xs font-bold text-slate-800 mt-0.5 font-mono">{profile.societyCode}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400 font-medium">RWA Registration ID</div>
                <div className="text-xs font-bold text-slate-800 mt-0.5 font-mono">{profile.govId}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

