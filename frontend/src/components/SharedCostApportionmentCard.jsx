import React from 'react';
import { Truck, Scale, Building2 } from 'lucide-react';

export const SharedCostApportionmentCard = ({ bulkPurchases = [], userFlatArea = 1650, totalSocietyArea = 78000 }) => {
  const totalBulkCost = bulkPurchases.reduce((acc, curr) => acc + (curr.cost || 0), 0);
  const totalLitres = bulkPurchases.reduce((acc, curr) => acc + (curr.capacityLiters || 0), 0);

  const flatRatio = totalSocietyArea > 0 ? (userFlatArea / totalSocietyArea) : 0;
  const userShareCost = (totalBulkCost * flatRatio).toFixed(2);

  return (
    <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Bulk Water Apportionment</h3>
            <p className="text-xs text-slate-400">Proportional division of community tanker & shared water purchases</p>
          </div>
        </div>
        <span className="text-[10px] px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200 font-bold uppercase flex items-center space-x-1">
          <Scale className="w-3 h-3" />
          <span>By Flat Size</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-50 border border-slate-200/70 p-3.5 rounded-2xl">
          <div className="text-[11px] text-slate-400 font-medium">Bulk Inflow</div>
          <div className="text-base font-bold text-slate-900 font-mono mt-1">{totalLitres.toLocaleString()} L</div>
          <div className="text-[10px] text-slate-500 mt-0.5">{bulkPurchases.length} deliveries</div>
        </div>

        <div className="bg-slate-50 border border-slate-200/70 p-3.5 rounded-2xl">
          <div className="text-[11px] text-slate-400 font-medium">Society Cost</div>
          <div className="text-base font-bold text-blue-600 font-mono mt-1">₹{totalBulkCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Aug 2026 Cycle</div>
        </div>

        <div className="bg-slate-50 border border-slate-200/70 p-3.5 rounded-2xl">
          <div className="text-[11px] text-slate-400 font-medium">Your Share</div>
          <div className="text-base font-bold text-emerald-600 font-mono mt-1">₹{userShareCost}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">{(flatRatio * 100).toFixed(2)}% of community</div>
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tanker Deliveries This Month</div>
        {bulkPurchases.map((purchase) => (
          <div key={purchase.id} className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <div>
              <div className="font-semibold text-slate-800">{purchase.supplierName}</div>
              <div className="text-[10px] text-slate-400 font-mono">{purchase.purchaseDate}</div>
            </div>
            <div className="text-right">
              <div className="font-mono text-slate-700 font-medium">{purchase.capacityLiters?.toLocaleString()} L</div>
              <div className="font-mono text-blue-600 font-bold">₹{purchase.cost?.toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
