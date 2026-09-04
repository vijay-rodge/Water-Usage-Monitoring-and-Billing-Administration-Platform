import React, { useState } from 'react';
import { Camera, Edit3, User, Mail, Phone, Calendar, Shield, Save, X, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ResidentProfileView = () => {
  const { user, setUser, showToast } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || 'Resident3 (Rahul Sharma)',
    email: user?.email || 'resident3@gmail.com',
    phone: user?.phone || '54622578356',
    flatNo: user?.flatNo || 'A-101',
    gender: user?.gender || 'Not provided',
    dob: user?.dob || 'Not provided',
    govId: user?.govId || '2459553245254'
  });

  const handleSaveProfile = (e) => {
    e?.preventDefault();
    setUser({
      ...user,
      ...formData
    });
    setIsEditing(false);
    showToast('Resident profile details updated successfully!', 'success');
  };

  const handleAvatarChange = () => {
    showToast('Profile photo updated! Saved to database.', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Profile Header (Matching Screenshot 574) */}
      <div className="relative bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
        {/* Sky-Blue Gradient Header Banner */}
        <div className="h-40 sm:h-48 w-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 relative flex items-center justify-between px-8 text-white">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold uppercase tracking-wider">
              Flat {formData.flatNo} • Wing A
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight drop-shadow-xs">
              Smart Water Resident Portal
            </h2>
          </div>
          <div className="hidden sm:block text-5xl opacity-80 select-none">
            💧
          </div>
        </div>

        {/* Profile Details Bar */}
        <div className="px-6 sm:px-8 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 pb-6 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              {/* Avatar with Camera icon */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white p-1.5 shadow-xl shrink-0">
                <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-4xl font-extrabold text-white shadow-inner">
                  {formData.name.charAt(0) || 'R'}
                </div>
                <button
                  onClick={handleAvatarChange}
                  className="absolute bottom-1 right-1 p-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 shadow-md transition cursor-pointer"
                  title="Change Photo"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* User Name & Role Badge */}
              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
                    {formData.name}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-200">
                    Resident
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Primary resident & metered account owner for Greenwoods Meadows Flat {formData.flatNo}
                </p>
              </div>
            </div>

            {/* Actions: Edit Profile Button */}
            <div className="flex items-center space-x-3 self-start sm:self-auto pb-1">
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Information Cards Grid (Matching Screenshot 574) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Full Name Card */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs space-y-1">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-medium">
            <User className="w-4 h-4 text-blue-500" />
            <span>Full Name</span>
          </div>
          <div className="text-sm font-bold text-slate-800 pt-1">{formData.name}</div>
        </div>

        {/* Email Address Card */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs space-y-1">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-medium">
            <Mail className="w-4 h-4 text-blue-500" />
            <span>Email Address</span>
          </div>
          <div className="text-sm font-bold text-slate-800 pt-1 font-mono">{formData.email}</div>
        </div>

        {/* Phone Number Card */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs space-y-1">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-medium">
            <Phone className="w-4 h-4 text-blue-500" />
            <span>Phone Number</span>
          </div>
          <div className="text-sm font-bold text-slate-800 pt-1 font-mono">{formData.phone}</div>
        </div>

        {/* Gender Card */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs space-y-1">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-medium">
            <User className="w-4 h-4 text-slate-400" />
            <span>Gender</span>
          </div>
          <div className="text-sm font-semibold text-slate-500 pt-1">{formData.gender}</div>
        </div>

        {/* Date of Birth Card */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs space-y-1">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-medium">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Date of Birth</span>
          </div>
          <div className="text-sm font-semibold text-slate-500 pt-1">{formData.dob}</div>
        </div>

        {/* Govt ID Card */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs space-y-1">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-medium">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>Government ID / Aadhaar</span>
          </div>
          <div className="text-sm font-bold text-slate-800 pt-1 font-mono">{formData.govId}</div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Edit Resident Profile</h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Government ID</label>
                  <input
                    type="text"
                    value={formData.govId}
                    onChange={(e) => setFormData({ ...formData, govId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option>Not provided</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="text"
                    placeholder="YYYY-MM-DD"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md shadow-blue-600/20 transition cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
