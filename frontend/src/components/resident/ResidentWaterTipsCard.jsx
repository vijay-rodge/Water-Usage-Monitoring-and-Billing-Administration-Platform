import React, { useState } from 'react';
import { 
  Sparkles, 
  Droplets, 
  RefreshCw, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Circle, 
  Zap,
  Leaf,
  Layers,
  Clock,
  ShowerHead,
  ShieldAlert
} from 'lucide-react';
import { api } from '../../services/api';

export const ResidentWaterTipsCard = ({ initialTips, householdId = 1, flatNo = 'A-101' }) => {
  const [tipsData, setTipsData] = useState(initialTips || null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [appliedTips, setAppliedTips] = useState({});

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const updated = await api.getResidentWaterTips(householdId);
      if (updated) {
        setTipsData(updated);
      }
    } catch (e) {
      console.error('Failed to regenerate water tips:', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  const toggleApplied = (tipId) => {
    setAppliedTips((prev) => ({
      ...prev,
      [tipId]: !prev[tipId]
    }));
  };

  if (!tipsData) {
    return null;
  }

  const getCategoryIcon = (category, iconType) => {
    const cat = (category || '').toLowerCase();
    const icon = (iconType || '').toLowerCase();

    if (icon.includes('shower') || cat.includes('shower') || cat.includes('bath')) {
      return <ShowerHead className="w-4 h-4 text-blue-500" />;
    }
    if (icon.includes('alert') || cat.includes('leak') || cat.includes('anomaly')) {
      return <AlertTriangle className="w-4 h-4 text-rose-500" />;
    }
    if (icon.includes('leaf') || cat.includes('kitchen') || cat.includes('garden')) {
      return <Leaf className="w-4 h-4 text-emerald-500" />;
    }
    if (icon.includes('washer') || icon.includes('appliance') || cat.includes('appliance')) {
      return <Zap className="w-4 h-4 text-purple-500" />;
    }
    if (cat.includes('tariff') || cat.includes('tier') || cat.includes('billing')) {
      return <TrendingDown className="w-4 h-4 text-amber-500" />;
    }
    return <Droplets className="w-4 h-4 text-cyan-500" />;
  };

  const getPriorityBadge = (priority) => {
    const p = (priority || 'MEDIUM').toUpperCase();
    if (p === 'HIGH') {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
          HIGH PRIORITY
        </span>
      );
    }
    if (p === 'MEDIUM') {
      return (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60">
          RECOMMENDED
        </span>
      );
    }
    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60">
        GOOD HABIT
      </span>
    );
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-50/70 via-white to-indigo-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30 border border-blue-200/80 dark:border-indigo-900/40 p-6 shadow-sm space-y-5 transition-all">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-blue-400/10 dark:bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                AI Water Conservation Advisory
              </h3>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100/80 dark:bg-blue-900/50 text-blue-700 dark:text-cyan-300 border border-blue-200/60 dark:border-blue-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {tipsData.generatedBy || 'Google Gemini 2.5 Flash'}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
              {tipsData.headline || `Tailored conservation plan for Flat ${flatNo}`}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-end sm:self-center">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-blue-700 dark:text-cyan-400 border border-blue-200 dark:border-slate-700 font-bold text-xs shadow-xs transition cursor-pointer disabled:opacity-50"
            title="Generate fresh tips with Google Gemini"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Analyzing Telemetry...' : 'Refresh AI Tips'}</span>
          </button>
        </div>
      </div>

      {/* Telemetry context banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700/70 backdrop-blur-xs">
        <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
          <Droplets className="w-4 h-4 text-blue-500 shrink-0" />
          <span>
            {tipsData.consumptionSummary || 'Telemetry-grounded analysis of your household flow meter readings.'}
          </span>
        </div>
        {tipsData.potentialMonthlySavingsEstimate && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold text-xs whitespace-nowrap self-start md:self-auto">
            <span>🎯 Target:</span>
            <span>{tipsData.potentialMonthlySavingsEstimate}</span>
          </div>
        )}
      </div>

      {/* Grid of personalized tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tipsData.tips && tipsData.tips.map((tip, idx) => {
          const isDone = appliedTips[tip.id];
          return (
            <div
              key={tip.id || idx}
              className={`group flex flex-col justify-between p-4 rounded-2xl border transition-all duration-200 ${
                isDone
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/70 opacity-90'
                  : 'bg-white dark:bg-slate-800/90 border-slate-200/80 dark:border-slate-700/70 hover:border-blue-300 dark:hover:border-cyan-600 hover:shadow-md'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {getCategoryIcon(tip.category, tip.iconType)}
                    <span className="uppercase text-[11px] tracking-wide font-bold">
                      {tip.category}
                    </span>
                  </div>
                  {getPriorityBadge(tip.priority)}
                </div>

                <div>
                  <h4 className={`text-sm font-bold tracking-tight ${
                    isDone ? 'line-through text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-white'
                  }`}>
                    {tip.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed font-normal">
                    {tip.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                <div className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-100 dark:border-emerald-900/50">
                  {tip.potentialSavings}
                </div>

                <button
                  type="button"
                  onClick={() => toggleApplied(tip.id)}
                  className={`flex items-center space-x-1 text-[11px] font-semibold px-2 py-1 rounded-lg transition cursor-pointer ${
                    isDone
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                  title={isDone ? 'Mark as not done' : 'Mark tip as implemented'}
                >
                  {isDone ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Applied</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-3.5 h-3.5" />
                      <span>Apply</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
