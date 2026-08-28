import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, Shield, Edit3, Camera, Home, CheckCircle2, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ResidentProfileView = () => {
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: user.name || 'Resident3',
    email: user.email || 'resident3@gmail.com',
    phone: user.phone || '54622578356',
    gender: user.gender || 'Not provided',
    dob: user.dob || 'Not provided',
    govId: user.govId || '2459553245254',
    flatNo: user.flatNo || 'A-101',
    blockWing: user.blockWing || 'Wing A',
    carpetArea: '1,650 Sq.Ft',
    occupancy: '4 Persons'
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setIsEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Profile Card Container (Matching Screenshot 574) */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
        {/* Blue Cover Header Banner */}
        <div className="h-36 sm:h-44 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 relative">
          <div className="absolute top-4 right-4 flex items-center space-x-2">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold text-white border border-white/30">
              Verified Resident Sub-Meter
            </span>
          </div>
        </div>

        {/* Profile Avatar & Info Row */}
        <div className="px-6 sm:px-8 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-8">
            <div className="flex items-end space-x-4">
              {/* Avatar Circle with Camera Icon */}
              <div className="relative group">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-blue-600 border-4 border-white shadow-lg flex items-center justify-center text-white text-4xl font-bold">
                  {profile.fullName?.charAt(0) || 'R'}
                </div>
                <button
                  onClick={() => alert('Photo upload dialog')}
                  className="absolute bottom-1 right-1 p-2 bg-white text-slate-700 rounded-full border border-slate-200 shadow-md hover:bg-slate-50 transition"
                  title="Upload profile picture"
                >
                  <Camera className="w-4 h-4 text-blue-600" />
                </button>
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">{profile.fullName}</h2>
                <div className="flex items-center space-x-2 mt-0.5">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{user.role || 'RESIDENT'}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs font-mono font-semibold text-blue-600">Flat {profile.flatNo} ({profile.blockWing})</span>
                </div>
              </div>
            </div>

            {/* Edit Profile Button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition self-end sm:self-auto"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
          </div>

          {saved && (
            <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-700 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Profile information updated successfully!</span>
            </div>
          )}

          {/* Profile Details Grid (Matching Screenshot 574) */}
          {isEditing ? (
            <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Government ID</label>
                <input
                  type="text"
                  value={profile.govId}
                  onChange={(e) => setProfile({ ...profile, govId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2 pt-2 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Card 1: Full Name */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Full Name</div>
                  <div className="text-xs font-bold text-slate-800 mt-0.5">{profile.fullName}</div>
                </div>
              </div>

              {/* Card 2: Email Address */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Email Address</div>
                  <div className="text-xs font-bold text-slate-800 mt-0.5">{profile.email}</div>
                </div>
              </div>

              {/* Card 3: Phone Number */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Phone Number</div>
                  <div className="text-xs font-bold text-slate-800 mt-0.5 font-mono">{profile.phone}</div>
                </div>
              </div>

              {/* Card 4: Gender */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Gender</div>
                  <div className="text-xs font-bold text-slate-800 mt-0.5">{profile.gender}</div>
                </div>
              </div>

              {/* Card 5: Date of Birth */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Date of Birth</div>
                  <div className="text-xs font-bold text-slate-800 mt-0.5">{profile.dob}</div>
                </div>
              </div>

              {/* Card 6: Government ID */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Government ID</div>
                  <div className="text-xs font-bold text-slate-800 mt-0.5 font-mono">{profile.govId}</div>
                </div>
              </div>
            </div>
          )}

          {/* Household Metadata Summary */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center space-x-2">
              <Home className="w-4 h-4 text-blue-600" />
              <span>Unit: <strong className="text-slate-800">Flat {profile.flatNo} ({profile.blockWing})</strong></span>
              <span>•</span>
              <span>Carpet Area: <strong className="text-slate-800">{profile.carpetArea}</strong></span>
              <span>•</span>
              <span>Occupancy: <strong className="text-slate-800">{profile.occupancy}</strong></span>
            </div>
            <div className="font-mono text-slate-400">
              Meter Serial: WM-SN-A101-2024
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

