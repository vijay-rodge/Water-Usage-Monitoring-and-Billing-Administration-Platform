import React from 'react';
import { Sparkles, TrendingDown, Award, Users, Droplets } from 'lucide-react';

export const ResidentReportsView = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
          Conservation & Efficiency Reports
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Household per-capita metrics, efficiency grading, and community benchmarking.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-xs space-y-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-sm text-slate-800">Water Efficiency Rating</h3>
          </div>
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-center space-y-1">
            <div className="text-4xl font-extrabold font-mono text-amber-600">84 / 100</div>
            <div className="text-xs font-bold text-slate-800">Grade A — Conservation Leader</div>
            <p className="text-[11px] text-slate-500">Your household is in the top 15% most efficient flats</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-xs space-y-4">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-800">Per-Capita Daily Draw</h3>
          </div>
          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-center space-y-1">
            <div className="text-4xl font-extrabold font-mono text-blue-600">108.5 L</div>
            <div className="text-xs font-bold text-slate-800">Liters per person / day</div>
            <p className="text-[11px] text-slate-500">Below WHO benchmark limit of 135 L/person/day</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-xs space-y-4">
          <div className="flex items-center space-x-2">
            <TrendingDown className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-800">Leak Prevention Savings</h3>
          </div>
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center space-y-1">
            <div className="text-4xl font-extrabold font-mono text-emerald-600">₹840.00</div>
            <div className="text-xs font-bold text-slate-800">Saved This Month</div>
            <p className="text-[11px] text-slate-500">Rapid detection and repair of flush valve on Aug 25</p>
          </div>
        </div>
      </div>
    </div>
  );
};

