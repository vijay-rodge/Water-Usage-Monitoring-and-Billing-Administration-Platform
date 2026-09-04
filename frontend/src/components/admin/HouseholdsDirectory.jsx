import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Plus, Home, Phone, Mail, CheckCircle2, XCircle, Clock, ShieldCheck } from 'lucide-react';
import { RegisterUnitModal } from '../modals/RegisterUnitModal';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export const HouseholdsDirectory = () => {
  const { showToast } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [bhkFilter, setBhkFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [pendingResidents, setPendingResidents] = useState([]);
  const [loadingApprovals, setLoadingApprovals] = useState(false);

  const [flats, setFlats] = useState([
    { id: 1, flatNo: 'A-101', wing: 'Wing A', floor: 1, bhk: '3BHK', area: 1650, occupancy: 4, meterSerial: 'WM-SN-A101-2024', owner: 'Rahul Sharma', email: 'resident3@gmail.com', phone: '+91 98765 43210', status: 'ACTIVE' },
    { id: 2, flatNo: 'A-102', wing: 'Wing A', floor: 1, bhk: '2BHK', area: 1200, occupancy: 3, meterSerial: 'WM-SN-A102-2024', owner: 'Ananya Sen', email: 'ananya.sen@example.com', phone: '+91 98765 43211', status: 'ACTIVE' },
    { id: 3, flatNo: 'A-201', wing: 'Wing A', floor: 2, bhk: '3BHK', area: 1650, occupancy: 4, meterSerial: 'WM-SN-A201-2024', owner: 'Suresh Iyer', email: 'suresh.iyer@example.com', phone: '+91 98765 43212', status: 'ACTIVE' },
    { id: 4, flatNo: 'B-101', wing: 'Wing B', floor: 1, bhk: '2BHK', area: 1150, occupancy: 2, meterSerial: 'WM-SN-B101-2024', owner: 'Deepak Verma', email: 'deepak.verma@example.com', phone: '+91 98765 43213', status: 'ACTIVE' },
    { id: 5, flatNo: 'B-202', wing: 'Wing B', floor: 2, bhk: '3BHK', area: 1700, occupancy: 4, meterSerial: 'WM-SN-B202-2024', owner: 'Priya Nair', email: 'priya.nair@waterguard.io', phone: '+91 98765 43214', status: 'ACTIVE' },
    { id: 6, flatNo: 'B-301', wing: 'Wing B', floor: 3, bhk: '4BHK', area: 2300, occupancy: 5, meterSerial: 'WM-SN-B301-2024', owner: 'Arjun Reddy', email: 'arjun.reddy@example.com', phone: '+91 98765 43215', status: 'ACTIVE' },
    { id: 7, flatNo: 'C-101', wing: 'Wing C', floor: 1, bhk: '1BHK', area: 750, occupancy: 1, meterSerial: 'WM-SN-C101-2024', owner: 'Vikram Patel', email: 'vikram.patel@waterguard.io', phone: '+91 98765 43216', status: 'ACTIVE' },
    { id: 8, flatNo: 'C-402', wing: 'Wing C', floor: 4, bhk: 'PENTHOUSE', area: 3100, occupancy: 6, meterSerial: 'WM-SN-C402-2024', owner: 'Meera Deshmukh', email: 'meera.deshmukh@example.com', phone: '+91 98765 43217', status: 'ACTIVE' },
  ]);

  // Load pending approvals on mount
  useEffect(() => {
    loadPending();
  }, []);

  const loadPending = async () => {
    try {
      setLoadingApprovals(true);
      const list = await api.getPendingResidents();
      setPendingResidents(list || []);
    } catch (e) {
      console.warn('Could not load pending residents:', e);
    } finally {
      setLoadingApprovals(false);
    }
  };

  const handleApprove = async (resident) => {
    try {
      await api.approveResident(resident.id);
      showToast(`Resident ${resident.fullName} for Flat ${resident.flatNo} approved successfully!`, 'success');
      
      // Remove from pending list
      setPendingResidents(pendingResidents.filter(p => p.id !== resident.id));

      // Add to active directory list
      const newActiveFlat = {
        id: resident.id,
        flatNo: resident.flatNo,
        wing: resident.blockWing || 'Wing A',
        floor: 1,
        bhk: '2BHK',
        area: 1200,
        occupancy: 3,
        meterSerial: `WM-SN-${resident.flatNo.replace('-', '')}-2026`,
        owner: resident.fullName,
        email: resident.email,
        phone: resident.phone || '+91 98765 00000',
        status: 'ACTIVE'
      };
      setFlats([newActiveFlat, ...flats]);
    } catch (err) {
      showToast(err.message || 'Failed to approve resident', 'error');
    }
  };

  const handleReject = async (resident) => {
    try {
      await api.rejectResident(resident.id, 'Declined by Administrator');
      showToast(`Registration request for Flat ${resident.flatNo} was declined.`, 'info');
      setPendingResidents(pendingResidents.filter(p => p.id !== resident.id));
    } catch (err) {
      showToast(err.message || 'Failed to decline request', 'error');
    }
  };

  const handleUnitAdded = (newUnit) => {
    setFlats([newUnit, ...flats]);
  };

  const filtered = flats.filter(f => {
    const matchesSearch = f.flatNo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          f.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.meterSerial.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBhk = bhkFilter === 'ALL' || f.bhk === bhkFilter;
    return matchesSearch && matchesBhk;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            Households Directory
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Community flat registry, unique administrator approvals, and sub-meter telemetry hardware.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Unit</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* PENDING RESIDENT APPROVALS SECTION (Unique Admin Workflow)                 */}
      {/* ========================================================================= */}
      {pendingResidents.length > 0 && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-amber-950 text-sm">
                  Pending Resident Registration Requests ({pendingResidents.length})
                </h3>
                <p className="text-xs text-amber-700">
                  Residents who registered for your community and are awaiting your authorization.
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold uppercase tracking-wider">
              Action Required
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            {pendingResidents.map((resident) => (
              <div key={resident.id} className="bg-white border border-amber-200/90 rounded-2xl p-4 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-slate-900 text-xs flex items-center space-x-2">
                      <span className="text-sm">{resident.fullName}</span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-mono text-[10px] font-bold">
                        Flat {resident.flatNo}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 flex flex-col gap-0.5 font-mono">
                      <span>✉️ {resident.email}</span>
                      {resident.phone && <span>📞 {resident.phone}</span>}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {resident.blockWing || 'Wing A'}
                  </span>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleReject(resident)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-xs font-semibold transition cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Decline</span>
                  </button>
                  <button
                    onClick={() => handleApprove(resident)}
                    className="flex items-center space-x-1 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve Flat</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search flat, resident, meter S/N..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-500 font-medium shrink-0">BHK:</span>
          {['ALL', '1BHK', '2BHK', '3BHK', '4BHK', 'PENTHOUSE'].map((bhk) => (
            <button
              key={bhk}
              onClick={() => setBhkFilter(bhk)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                bhkFilter === bhk 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {bhk}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
              <tr>
                <th className="px-5 py-3.5">Unit</th>
                <th className="px-5 py-3.5">Owner / Resident</th>
                <th className="px-5 py-3.5">Area & Occupancy</th>
                <th className="px-5 py-3.5">Meter Serial Number</th>
                <th className="px-5 py-3.5">Contact</th>
                <th className="px-5 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((flat) => (
                <tr key={flat.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-5 py-4">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        <Home className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{flat.flatNo}</div>
                        <div className="text-[10px] text-slate-400">{flat.wing} • Floor {flat.floor}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 font-semibold text-slate-800">
                    {flat.owner}
                  </td>

                  <td className="px-5 py-4">
                    <div className="font-medium text-slate-900">{flat.bhk} • {flat.area} sq.ft</div>
                    <div className="text-[10px] text-slate-400">{flat.occupancy} residents</div>
                  </td>

                  <td className="px-5 py-4">
                    <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded-md text-slate-700 font-semibold">
                      {flat.meterSerial}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="text-slate-800 flex items-center space-x-1.5 font-mono text-[11px]">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>{flat.email}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center space-x-1.5 font-mono mt-0.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{flat.phone}</span>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-center">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200/80">
                      {flat.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Unit Modal */}
      <RegisterUnitModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onUnitAdded={handleUnitAdded}
      />
    </div>
  );
};

export default HouseholdsDirectory;
