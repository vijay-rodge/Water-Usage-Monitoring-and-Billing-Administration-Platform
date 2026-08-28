import React from 'react';
import { Layers, CheckCircle2 } from 'lucide-react';

export const TariffSlabCard = ({ plan, currentConsumption = 13010 }) => {
  if (!plan || !plan.tiers) return null;

  return (
    <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Progressive Tariff Slabs</h3>
            <p className="text-xs text-slate-400">{plan.planName}</p>
          </div>
        </div>
        <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 font-bold uppercase">
          Active Scheme
        </span>
      </div>

      <div className="space-y-3">
        {plan.tiers?.map((tier) => {
          const isCurrentTier = 
            currentConsumption >= (tier.minLiters || 0) && 
            (tier.maxLiters === null || tier.maxLiters === undefined || currentConsumption <= tier.maxLiters);

          return (
            <div
              key={tier.tierLevel || Math.random()}
              className={`p-4 rounded-2xl border transition-all ${
                isCurrentTier
                  ? 'bg-blue-50/60 border-blue-200 shadow-xs'
                  : 'bg-slate-50 border-slate-200/70'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                    isCurrentTier ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {tier.tierLevel}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-slate-900">{tier.tierName}</span>
                      {isCurrentTier && (
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                          Current Tier
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {tier.minLiters?.toLocaleString()} L – {tier.maxLiters ? `${tier.maxLiters.toLocaleString()} L` : 'Unlimited'}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-sm text-slate-900">
                    ₹{tier.ratePer1000Liters?.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-400">per 1,000 L</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div>Base Fixed Charge: <span className="text-slate-800 font-bold font-mono">₹{plan.baseFixedCharge?.toFixed(2)}</span></div>
        <div>Sewage / STP Levy: <span className="text-slate-800 font-bold font-mono">{plan.sewageMaintenancePct}%</span></div>
      </div>
    </div>
  );
};
