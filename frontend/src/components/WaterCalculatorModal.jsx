import React, { useState } from 'react';
import { X, Calculator, Droplets, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export const WaterCalculatorModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [liters, setLiters] = useState(13010);
  const [commonCost, setCommonCost] = useState(192.40);

  const calc = api.calculateTariffPreview(liters, undefined, Number(commonCost) || 0);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Tiered Tariff Simulator</h3>
              <p className="text-xs text-slate-400">Interactive Bill & Slab Computation Engine</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Monthly Consumption: <span className="font-mono text-cyan-400 font-bold">{Number(liters).toLocaleString()} L</span>
              </label>
              <input
                type="range"
                min="1000"
                max="40000"
                step="500"
                value={liters}
                onChange={(e) => setLiters(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>1,000 L</span>
                <span>15,000 L</span>
                <span>40,000 L</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Apportioned Common Cost (₹)
              </label>
              <input
                type="number"
                value={commonCost}
                onChange={(e) => setCommonCost(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          {/* Slabs Output */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Tier Breakdown Analysis</div>
            <div className="border border-slate-800 rounded-xl overflow-hidden text-xs divide-y divide-slate-800/80">
              {calc.tierBreakdown.map((t) => (
                <div key={t.tierLevel} className="p-2.5 bg-slate-950/40 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-200">{t.tierName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{t.consumedLiters.toLocaleString()} L @ ₹{t.ratePer1000Liters}/kL</div>
                  </div>
                  <div className="font-mono font-bold text-white">₹{t.cost.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Final Computed Total Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs text-slate-400">Estimated Total Bill</div>
              <div className="text-[11px] text-slate-500">Fixed (₹150) + Metered + 10% STP + Apportioned</div>
            </div>
            <div className="text-2xl font-bold font-mono text-cyan-400">
              ₹{calc.totalPayable.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white transition"
          >
            Close Calculator
          </button>
        </div>
      </div>
    </div>
  );
};

