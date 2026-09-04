import React, { useState } from 'react';
import { Truck, Plus, Scale, DollarSign, Calendar, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const BulkPurchasesView = () => {
  const { showToast } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [supplier, setSupplier] = useState('Kavery Clean Water Tankers Ltd');
  const [capacity, setCapacity] = useState('24000');
  const [cost, setCost] = useState('3600');
  const [method, setMethod] = useState('BY_FLAT_SIZE');
  const [notes, setNotes] = useState('Main society sump replenishment');

  const [purchases, setPurchases] = useState([
    { id: 1, purchaseDate: '2026-08-04', supplierName: 'Kavery Clean Water Tankers Ltd', capacityLiters: 24000, cost: 3600.00, method: 'BY_FLAT_SIZE', notes: 'Main sump replenishment' },
    { id: 2, purchaseDate: '2026-08-12', supplierName: 'AquaPure Express Tankers', capacityLiters: 12000, cost: 1950.00, method: 'BY_FLAT_SIZE', notes: 'Swimming pool refill' },
    { id: 3, purchaseDate: '2026-08-21', supplierName: 'Kavery Clean Water Tankers Ltd', capacityLiters: 24000, cost: 3600.00, method: 'BY_FLAT_SIZE', notes: 'Buffer storage refill' },
  ]);

  const handleAddPurchase = (e) => {
    e.preventDefault();
    const newPurchase = {
      id: Date.now(),
      purchaseDate: new Date().toISOString().split('T')[0],
      supplierName: supplier,
      capacityLiters: Number(capacity),
      cost: Number(cost),
      method,
      notes
    };

    setPurchases([newPurchase, ...purchases]);
    setShowAddForm(false);
    showToast(`Tanker delivery of ${Number(capacity).toLocaleString()} L logged and apportioned across 48 flats!`, 'success');
  };

  const totalLitres = purchases.reduce((acc, p) => acc + p.capacityLiters, 0);
  const totalCost = purchases.reduce((acc, p) => acc + p.cost, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            Bulk Water Tanker Inflows & Apportionment
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Log external tanker deliveries and divide purchase costs proportionately by flat area (Sq.Ft) or occupancy.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Tanker Delivery</span>
        </button>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs">
          <div className="text-xs text-slate-400 font-medium">Total Inflow This Month</div>
          <div className="text-2xl font-extrabold text-blue-600 font-mono mt-1">
            {totalLitres.toLocaleString()} L
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">{purchases.length} total deliveries</div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs">
          <div className="text-xs text-slate-400 font-medium">Total Bulk Spend</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
            ₹{totalCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">August 2026 Cycle</div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs">
          <div className="text-xs text-slate-400 font-medium">Active Apportionment Rule</div>
          <div className="text-base font-bold text-emerald-600 mt-1 flex items-center space-x-1.5">
            <Scale className="w-4 h-4" />
            <span>Proportional to Flat Carpet Area</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">As per society bye-law clause 14</div>
        </div>
      </div>

      {/* New Purchase Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Record Bulk Water Delivery</h3>
              <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleAddPurchase} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Supplier / Vendor Name</label>
                <input
                  type="text"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanker Capacity (Liters)</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Cost (₹)</label>
                  <input
                    type="number"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Apportionment Rule</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option value="BY_FLAT_SIZE">By Flat Size (Sq.Ft) - Recommended</option>
                  <option value="BY_OCCUPANCY">By Occupancy Count</option>
                  <option value="EQUAL_SPLIT">Equal Flat Split</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Purpose / Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md shadow-blue-600/20 transition cursor-pointer"
                >
                  Save Tanker Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deliveries Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
              <tr>
                <th className="px-5 py-3.5">Delivery Date</th>
                <th className="px-5 py-3.5">Supplier</th>
                <th className="px-5 py-3.5 text-right">Capacity (Liters)</th>
                <th className="px-5 py-3.5 text-right">Invoice Cost (₹)</th>
                <th className="px-5 py-3.5">Apportionment</th>
                <th className="px-5 py-3.5">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {purchases.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-5 py-3.5 font-mono font-semibold text-slate-800">
                    {p.purchaseDate}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-slate-900">
                    {p.supplierName}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono text-blue-600 font-bold">
                    {p.capacityLiters.toLocaleString()} L
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono font-extrabold text-slate-900">
                    ₹{p.cost.toFixed(2)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-[10px] font-bold">
                      {p.method}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">
                    {p.notes}
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
