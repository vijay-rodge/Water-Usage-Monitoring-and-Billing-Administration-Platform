import React, { useState } from 'react';
import { Users, Search, Filter, Plus, Home, Phone, Mail } from 'lucide-react';

export const HouseholdsDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bhkFilter, setBhkFilter] = useState('ALL');

  const flats = [
    { id: 1, flatNo: 'A-101', wing: 'Wing A', floor: 1, bhk: '3BHK', area: 1650, occupancy: 4, meterSerial: 'WM-SN-A101-2024', owner: 'Rahul Sharma', email: 'rahul.sharma@waterguard.io', phone: '+91 98765 43210', status: 'ACTIVE' },
    { id: 2, flatNo: 'A-102', wing: 'Wing A', floor: 1, bhk: '2BHK', area: 1200, occupancy: 3, meterSerial: 'WM-SN-A102-2024', owner: 'Ananya Sen', email: 'ananya.sen@example.com', phone: '+91 98765 43211', status: 'ACTIVE' },
    { id: 3, flatNo: 'A-201', wing: 'Wing A', floor: 2, bhk: '3BHK', area: 1650, occupancy: 4, meterSerial: 'WM-SN-A201-2024', owner: 'Suresh Iyer', email: 'suresh.iyer@example.com', phone: '+91 98765 43212', status: 'ACTIVE' },
    { id: 4, flatNo: 'B-101', wing: 'Wing B', floor: 1, bhk: '2BHK', area: 1150, occupancy: 2, meterSerial: 'WM-SN-B101-2024', owner: 'Deepak Verma', email: 'deepak.verma@example.com', phone: '+91 98765 43213', status: 'ACTIVE' },
    { id: 5, flatNo: 'B-202', wing: 'Wing B', floor: 2, bhk: '3BHK', area: 1700, occupancy: 4, meterSerial: 'WM-SN-B202-2024', owner: 'Priya Nair', email: 'priya.nair@waterguard.io', phone: '+91 98765 43214', status: 'ACTIVE' },
    { id: 6, flatNo: 'B-301', wing: 'Wing B', floor: 3, bhk: '4BHK', area: 2300, occupancy: 5, meterSerial: 'WM-SN-B301-2024', owner: 'Arjun Reddy', email: 'arjun.reddy@example.com', phone: '+91 98765 43215', status: 'ACTIVE' },
    { id: 7, flatNo: 'C-101', wing: 'Wing C', floor: 1, bhk: '1BHK', area: 750, occupancy: 1, meterSerial: 'WM-SN-C101-2024', owner: 'Vikram Patel', email: 'vikram.patel@waterguard.io', phone: '+91 98765 43216', status: 'ACTIVE' },
    { id: 8, flatNo: 'C-402', wing: 'Wing C', floor: 4, bhk: 'PENTHOUSE', area: 3100, occupancy: 6, meterSerial: 'WM-SN-C402-2024', owner: 'Meera Deshmukh', email: 'meera.deshmukh@example.com', phone: '+91 98765 43217', status: 'ACTIVE' },
  ];

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
            Complete database of 48 apartment units, sub-meter hardware serials, and resident contacts.
          </p>
        </div>

        <button
          onClick={() => alert('Add New Flat Dialog')}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Unit</span>
        </button>
      </div>

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

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-500 font-medium">BHK:</span>
          {['ALL', '1BHK', '2BHK', '3BHK', '4BHK', 'PENTHOUSE'].map((bhk) => (
            <button
              key={bhk}
              onClick={() => setBhkFilter(bhk)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
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
              {filtered.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-5 py-3.5 font-bold font-mono text-slate-900">
                    Flat {f.flatNo}
                    <div className="text-[11px] text-slate-400 font-normal">{f.wing} • Fl {f.floor}</div>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-slate-800">
                    {f.owner}
                    <div className="text-[11px] text-slate-400">{f.email}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-semibold text-blue-600">{f.bhk}</span> • {f.area} sq.ft
                    <div className="text-[11px] text-slate-400">{f.occupancy} Occupants</div>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-slate-600">
                    {f.meterSerial}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-slate-600">
                    {f.phone}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-bold">
                      {f.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

