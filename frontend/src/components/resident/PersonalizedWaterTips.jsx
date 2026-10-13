import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Droplets, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  AlertTriangle, 
  CheckCircle2, 
  Circle, 
  Zap, 
  Leaf, 
  ShowerHead, 
  Wrench, 
  Cpu,
  Check
} from 'lucide-react';
import { api } from '../../services/api';

// Hardcoded resident-contextual tips if Gemini is unavailable or fails
const getHardcodedTips = (flatNo, residentName, monthlyUsage, occupancy = 4) => {
  const usageNum = monthlyUsage ? Number(monthlyUsage) : 14250;
  const isHigh = usageNum > 15000;
  return {
    success: true,
    source: 'local_storage',
    householdId: 1,
    flatNo: flatNo || 'A-101',
    residentName: residentName || 'Rahul Sharma',
    headline: isHigh
      ? `High Water Consumption Alert for Flat ${flatNo || 'A-101'}`
      : `Tailored Conservation Plan for Flat ${flatNo || 'A-101'}`,
    consumptionSummary: `Analysis grounded in Flat ${flatNo || 'A-101'}'s smart meter telemetry (${usageNum.toLocaleString()} L/month, ~${Math.round(usageNum / (occupancy * 30))} L/person/day).`,
    potentialMonthlySavingsEstimate: isHigh ? 'Save ~2,400 L / ₹350 monthly' : 'Save ~1,600 L / ₹220 monthly',
    trend: isHigh ? 'increasing' : 'stable',
    percentageChange: isHigh ? 8.5 : 0,
    generatedBy: 'Saved Local Rule Engine',
    generatedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    tips: [
      {
        id: 'tip-1',
        category: 'Leak Prevention',
        title: 'Inspect toilet flush flappers & cistern seals',
        description: 'A silent tank leak wastes 100-250 liters every 24 hours. Place food dye in the cistern to test for leakage.',
        message: 'A silent tank leak wastes 100-250 liters every 24 hours. Place food dye in the cistern to test for leakage.',
        potentialSavings: 'Save ~150 L/day',
        priority: isHigh ? 'high' : 'medium',
        iconType: 'alert'
      },
      {
        id: 'tip-2',
        category: 'Bathroom Conservation',
        title: 'Adopt 4-minute bucket or aerated showers',
        description: 'Standard overhead showers dispense 15 L/min. Aerators or bucket baths cut bath usage by 45% in 3BHK flats.',
        message: 'Standard overhead showers dispense 15 L/min. Aerators or bucket baths cut bath usage by 45% in 3BHK flats.',
        potentialSavings: 'Save ~40 L/person',
        priority: 'high',
        iconType: 'shower'
      },
      {
        id: 'tip-3',
        category: 'Kitchen & Appliances',
        title: 'Wash full washing machine loads on Eco Mode',
        description: 'Run laundry appliances only on full capacity to avoid wasting 50 liters on half-load cycles.',
        message: 'Run laundry appliances only on full capacity to avoid wasting 50 liters on half-load cycles.',
        potentialSavings: 'Save ~50 L/cycle',
        priority: 'medium',
        iconType: 'washer'
      },
      {
        id: 'tip-4',
        category: 'Smart Meter Monitoring',
        title: 'Verify zero-flow smart meter reading overnight',
        description: `Check your meter dial before sleep and first thing in the morning. Any dial movement confirms a hidden internal pipe leak.`,
        message: `Check your meter dial before sleep and first thing in the morning. Any dial movement confirms a hidden internal pipe leak.`,
        potentialSavings: 'Save ~60 L/day',
        priority: 'medium',
        iconType: 'faucet'
      }
    ]
  };
};

export const PersonalizedWaterTips = ({
  householdId = 1,
  flatNo = 'A-101',
  residentName = 'Rahul Sharma',
  monthlyUsage = 14250,
  occupancy = 4
}) => {
  // Local storage cache key
  const storageKey = `resident_saved_water_tips_${householdId}`;

  // Initial state: check localStorage first, else fallback to hardcoded contextual tips
  const [tipsData, setTipsData] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.tips && parsed.tips.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read saved water tips from localStorage:', e);
    }
    return getHardcodedTips(flatNo, residentName, monthlyUsage, occupancy);
  });

  const [isGeneratingWithGemini, setIsGeneratingWithGemini] = useState(false);
  const [appliedTips, setAppliedTips] = useState({});

  // Isolated Gemini call: ONLY updates this specific div, NEVER blocks the dashboard
  const generateGeminiTips = async (forceRefresh = false) => {
    setIsGeneratingWithGemini(true);
    try {
      const data = await api.getPersonalizedWaterTips(householdId, forceRefresh);
      if (data && data.tips && data.tips.length > 0) {
        setTipsData(data);
        // Save successfully generated tips into local storage for the resident
        try {
          localStorage.setItem(storageKey, JSON.stringify(data));
        } catch (e) {
          console.warn('Failed to save water tips to localStorage:', e);
        }
      }
    } catch (e) {
      console.warn('Gemini call failed or unavailable; displaying locally saved / hardcoded tips:', e);
      // If Gemini fails, ensure we have local fallback tips
      if (!tipsData || !tipsData.tips || tipsData.tips.length === 0) {
        const fallback = getHardcodedTips(flatNo, residentName, monthlyUsage, occupancy);
        setTipsData(fallback);
      }
    } finally {
      setIsGeneratingWithGemini(false);
    }
  };

  useEffect(() => {
    // Isolated background generation without blocking any part of the dashboard
    generateGeminiTips(false);
  }, [householdId, flatNo, monthlyUsage]);

  const toggleApplied = (tipId) => {
    setAppliedTips((prev) => ({
      ...prev,
      [tipId]: !prev[tipId]
    }));
  };

  const getCategoryIcon = (category, iconType) => {
    const cat = (category || '').toLowerCase();
    const icon = (iconType || '').toLowerCase();

    if (icon.includes('shower') || cat.includes('shower') || cat.includes('bath')) {
      return <ShowerHead className="w-4 h-4 text-blue-500" />;
    }
    if (icon.includes('alert') || cat.includes('leak') || cat.includes('anomaly') || cat.includes('fixture')) {
      return <AlertTriangle className="w-4 h-4 text-rose-500" />;
    }
    if (icon.includes('leaf') || cat.includes('kitchen') || cat.includes('garden')) {
      return <Leaf className="w-4 h-4 text-emerald-500" />;
    }
    if (icon.includes('washer') || icon.includes('appliance') || cat.includes('laundry')) {
      return <Zap className="w-4 h-4 text-purple-500" />;
    }
    if (icon.includes('faucet') || icon.includes('tap') || cat.includes('fixtures')) {
      return <Wrench className="w-4 h-4 text-cyan-500" />;
    }
    return <Droplets className="w-4 h-4 text-blue-500" />;
  };

  const getPriorityBadge = (priority) => {
    const p = (priority || 'medium').toLowerCase();
    if (p === 'high') {
      return (
        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
          HIGH PRIORITY
        </span>
      );
    }
    if (p === 'medium') {
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

  const renderTrendBadge = (trend, pct) => {
    const t = (trend || 'stable').toLowerCase();
    if (t === 'increasing') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{pct ? `+${Math.abs(pct)}%` : 'Increasing'} vs last month</span>
        </span>
      );
    }
    if (t === 'decreasing') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50">
          <TrendingDown className="w-3.5 h-3.5" />
          <span>{pct ? `-${Math.abs(pct)}%` : 'Decreasing'} vs last month</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-blue-900/50">
        <Minus className="w-3.5 h-3.5" />
        <span>Stable usage</span>
      </span>
    );
  };

  const isGemini = tipsData?.source === 'gemini' || (tipsData?.generatedBy && tipsData.generatedBy.toLowerCase().includes('gemini'));

  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-50/90 via-white to-indigo-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 border-2 border-blue-200/90 dark:border-indigo-900/60 p-6 shadow-sm space-y-5 transition-all">
      {/* Decorative ambient background accent */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-blue-400/10 dark:bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header section of Water Tips Div */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                💧 Personalized Water-Saving Tips
              </h3>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                isGemini
                  ? 'bg-blue-100/90 dark:bg-blue-900/50 text-blue-700 dark:text-cyan-300 border-blue-300 dark:border-blue-800'
                  : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
              }`}>
                {isGemini ? (
                  <>
                    <Cpu className="w-3 h-3 text-blue-600 dark:text-cyan-400" />
                    <span>Gemini AI Generated</span>
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Locally Saved Smart Tips</span>
                  </>
                )}
              </span>
              {isGeneratingWithGemini && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 dark:text-cyan-400 animate-pulse">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Gemini is generating...</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
              {tipsData?.headline || `Tailored conservation plan for Flat ${flatNo}`}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-end sm:self-center">
          <button
            onClick={() => generateGeminiTips(true)}
            disabled={isGeneratingWithGemini}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-blue-700 dark:text-cyan-400 border border-blue-200 dark:border-slate-700 font-bold text-xs shadow-xs transition cursor-pointer disabled:opacity-50"
            title="Re-run Gemini analysis with your smart meter readings"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingWithGemini ? 'animate-spin' : ''}`} />
            <span>{isGeneratingWithGemini ? 'Analyzing with Gemini...' : 'Regenerate Tips with Gemini'}</span>
          </button>
        </div>
      </div>

      {/* Telemetry context banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-blue-100 dark:border-slate-700/70 backdrop-blur-xs">
        <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
          <Droplets className="w-4 h-4 text-blue-500 shrink-0" />
          <span>
            {tipsData?.consumptionSummary || `Telemetry-grounded analysis for Flat ${flatNo}.`}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {renderTrendBadge(tipsData?.trend, tipsData?.percentageChange)}
          {tipsData?.potentialMonthlySavingsEstimate && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold text-xs whitespace-nowrap">
              <span>🎯 Target:</span>
              <span>{tipsData.potentialMonthlySavingsEstimate}</span>
            </div>
          )}
        </div>
      </div>

      {/* Grid of personalized tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(tipsData?.tips || []).map((tip, idx) => {
          const tipKey = tip.id || `tip-${idx}`;
          const isDone = appliedTips[tipKey];
          const tipTitle = tip.title || `Water Conservation Habit ${idx + 1}`;
          const tipMessage = tip.message || tip.description || '';

          return (
            <div
              key={tipKey}
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
                      {tip.category || 'Conservation'}
                    </span>
                  </div>
                  {getPriorityBadge(tip.priority)}
                </div>

                <div>
                  <h4 className={`text-sm font-bold tracking-tight ${
                    isDone ? 'line-through text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-white'
                  }`}>
                    {tipTitle}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed font-normal">
                    {tipMessage}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                <div className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-100 dark:border-emerald-900/50">
                  {tip.potentialSavings || 'Save water daily'}
                </div>

                <button
                  type="button"
                  onClick={() => toggleApplied(tipKey)}
                  className={`flex items-center space-x-1 text-[11px] font-semibold px-2 py-1 rounded-lg transition cursor-pointer ${
                    isDone
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                  title={isDone ? 'Mark as pending' : 'Mark tip as applied in household'}
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
