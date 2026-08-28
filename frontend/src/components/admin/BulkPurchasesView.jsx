import React, { useState } from 'react';
import { Truck, Plus, Scale, Calendar, CheckCircle2 } from 'lucide-react';

export const BulkPurchasesView = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  const purchases = [
    { id: 1, date: '2026-08-04', supplier: 'Kavery Clean Water Tankers Ltd', capacity: 24000, cost: 3600.00, method: 'BY_FLAT_SIZE', notes: 'Main sump replenishment' },
    { id: 2, date: '2026-08-12', supplier: 'AquaPure Express Tankers', capacity: 12000, cost: 1950.00, method: 'BY_FLAT_SIZE', notes: 'Swimming pool refill' },
    { id: 3, date: '2026-08-21', supplier: 'Kavery Clean Water Tankers Ltd', capacity: 24000, cost: 3600.00, method: 'BY_FLAT_SIZE', notes: 'Buffer storage refill' },
  ];

  const totalCost = purchases.reduce((a, c) => a + c.cost, 0);
  const totalVolume = purchases.reduce((a, c) => a + c.capacity, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            Bulk Water Tanker Purchases
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            External water procurement tracking and proportional common-area cost apportionment.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Log Tanker Delivery</span>
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total Tanker Deliveries</div>
          <div className="text-2xl font-extrabold font-mono text-slate-900 mt-1">{purchases.length} Tankers</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Month of August 2026</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total Bulk Volume Inflow</div>
          <div className="text-2xl font-extrabold font-mono text-cyan-600 mt-1">{totalVolume.toLocaleString()} L</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Discharged into Main Underground Sump</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total Procurement Cost</div>
          <div className="text-2xl font-extrabold font-mono text-blue-600 mt-1">₹{totalCost.toFixed(2)}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Apportioned by Flat Carpet Area</div>
        </div>
      </div>

      {/* Tankers Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Truck className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-800">Tanker Delivery Log</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Apportionment: By Flat Size (Sq.Ft)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
              <tr>
                <th className="px-5 py-3.5">Delivery Date</th>
                <th className="px-5 py-3.5">Water Supplier</th>
                <th className="px-5 py-3.5 font-mono text-right">Capacity (Liters)</th>
                <th className="px-5 py-3.5 font-mono text-right">Total Invoice (₹)</th>
                <th className="px-5 py-3.5">Apportionment</th>
                <th className="px-5 py-3.5">Delivery Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {purchases.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-5 py-3.5 font-mono text-slate-600">{p.date}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-800">{p.supplier}</td>
                  <td className="px-5 py-3.5 font-mono text-right font-medium text-slate-900">{p.capacity.toLocaleString()} L</td>
                  <td className="px-5 py-3.5 font-mono text-right font-bold text-blue-600">₹{p.cost.toFixed(2)}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-[10px] font-semibold">
                      By Carpet Area
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">{p.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

