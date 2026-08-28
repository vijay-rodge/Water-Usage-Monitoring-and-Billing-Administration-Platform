import React from 'react';
import { BarChart3, TrendingDown, ArrowUpRight, Droplets, CheckCircle, PieChart } from 'lucide-react';

export const AdminReportsView = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
          Society Water Balance & Audit Reports
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Comprehensive monthly consumption analytics, water loss audits, and cost recovery reports.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-xs space-y-4">
          <div className="flex items-center space-x-2">
            <Droplets className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-800">Water Balance Sheet (August 2026)</h3>
          </div>
          <div className="space-y-2 text-xs divide-y divide-slate-100">
            <div className="pt-2 flex justify-between text-slate-600">
              <span>Borewell Inflow:</span>
              <span className="font-mono font-bold text-slate-900">460,000 L</span>
            </div>
            <div className="pt-2 flex justify-between text-slate-600">
              <span>Bulk Tankers Inflow:</span>
              <span className="font-mono font-bold text-slate-900">60,000 L</span>
            </div>
            <div className="pt-2 flex justify-between text-blue-600 font-semibold">
              <span>Total Society Inflow:</span>
              <span className="font-mono font-bold">520,000 L</span>
            </div>
            <div className="pt-2 flex justify-between text-slate-600">
              <span>Metered Flats Draw:</span>
              <span className="font-mono font-bold text-slate-900">512,400 L</span>
            </div>
            <div className="pt-2 flex justify-between text-emerald-600 font-semibold">
              <span>Unaccounted Water Loss:</span>
              <span className="font-mono font-bold">&lt; 1.5% (Optimal)</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-xs space-y-4">
          <div className="flex items-center space-x-2">
            <TrendingDown className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-800">Conservation Impact</h3>
          </div>
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center space-y-1">
            <div className="text-3xl font-extrabold font-mono text-emerald-700">32.4%</div>
            <div className="text-xs font-bold text-emerald-800">Average Consumption Reduction</div>
            <p className="text-[11px] text-emerald-600">Since introducing progressive tiered pricing in Jan 2026</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-xs space-y-4">
          <div className="flex items-center space-x-2">
            <PieChart className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-800">Cost Recovery Rate</h3>
          </div>
          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-center space-y-1">
            <div className="text-3xl font-extrabold font-mono text-blue-700">100%</div>
            <div className="text-xs font-bold text-blue-800">Tanker & STP Cost Recovered</div>
            <p className="text-[11px] text-blue-600">Equitably apportioned across all 48 flat owners</p>
          </div>
        </div>
      </div>
    </div>
  );
};

