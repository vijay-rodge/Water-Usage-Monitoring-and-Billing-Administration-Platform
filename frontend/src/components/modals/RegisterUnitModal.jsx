import React, { useState } from 'react';
import { X, Home, Plus, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const RegisterUnitModal = ({ isOpen, onClose, onUnitAdded }) => {
  if (!isOpen) return null;

  const { showToast } = useAuth();
  const [flatNo, setFlatNo] = useState('');
  const [wing, setWing] = useState('Wing A');
  const [floor, setFloor] = useState(1);
  const [bhk, setBhk] = useState('2BHK');
  const [area, setArea] = useState('1200');
  const [occupancy, setOccupancy] = useState(3);
  const [meterSerial, setMeterSerial] = useState('');
  const [owner, setOwner] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!flatNo || !owner) return;

    const newUnit = {
      id: Date.now(),
      flatNo,
      wing,
      floor: Number(floor),
      bhk,
      area: Number(area),
      occupancy: Number(occupancy),
      meterSerial: meterSerial || `WM-SN-${flatNo.replace('-', '')}-2026`,
      owner,
      email: email || `${owner.toLowerCase().replace(' ', '.')}@example.com`,
      phone: phone || '+91 98765 00000',
      status: 'ACTIVE'
    };

    if (onUnitAdded) onUnitAdded(newUnit);
    showToast(`Flat ${flatNo} registered successfully in the society directory!`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Register New Household Unit</h3>
              <p className="text-xs text-slate-400">Add apartment flat & sub-meter hardware</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Flat Number *</label>
              <input
                type="text"
                placeholder="e.g. A-302"
                value={flatNo}
                onChange={(e) => setFlatNo(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Block / Wing</label>
              <select
                value={wing}
                onChange={(e) => setWing(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option>Wing A</option>
                <option>Wing B</option>
                <option>Wing C</option>
                <option>Wing D</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Typology</label>
              <select
                value={bhk}
                onChange={(e) => setBhk(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option>1BHK</option>
                <option>2BHK</option>
                <option>3BHK</option>
                <option>4BHK</option>
                <option>PENTHOUSE</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Carpet Area (Sq.Ft)</label>
              <input
                type="number"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Occupancy</label>
              <input
                type="number"
                value={occupancy}
                onChange={(e) => setOccupancy(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Owner / Primary Resident Name *</label>
            <input
              type="text"
              placeholder="e.g. Ramesh Chandra"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="+91 98765 00000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Sub-Meter Hardware Serial Number</label>
            <input
              type="text"
              placeholder="e.g. WM-SN-A302-2026"
              value={meterSerial}
              onChange={(e) => setMeterSerial(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md shadow-blue-600/20 transition"
            >
              Add Flat to Directory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterUnitModal;

