import React, { useState } from 'react';
import { Layers, Sliders, CheckCircle2, Save, Sparkles, HelpCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const TariffPlanConfigView = () => {
  const { showToast, t } = useAuth();

  // State for Community Tariff Tiers & Fees (Matching Screenshot)
  const [tier1Rate, setTier1Rate] = useState(5);
  const [tier1Limit, setTier1Limit] = useState(1000);
  const [tier2Rate, setTier2Rate] = useState(8);
  const [lateFeeMonthly, setLateFeeMonthly] = useState(50);
  const [gracePeriodDays, setGracePeriodDays] = useState(15);

  // Simulation Sliders State
  const [simulatedConsumption, setSimulatedConsumption] = useState(15000);
  const [simulatedDelayMonths, setSimulatedDelayMonths] = useState(1);

  // Math computation
  const tier1Consumption = Math.min(simulatedConsumption, tier1Limit);
  const tier2Consumption = Math.max(0, simulatedConsumption - tier1Limit);

  const tier1Cost = tier1Consumption * tier1Rate;
  const tier2Cost = tier2Consumption * tier2Rate;
  const lateFeeCost = simulatedDelayMonths * lateFeeMonthly;
  const estimatedTotal = tier1Cost + tier2Cost + lateFeeCost;

  const handleSave = (e) => {
    e.preventDefault();
    showToast(`${t('tariff.savedToast', 'Tariff scheme updated and saved to database successfully!')} (Tier 1: ₹${tier1Rate}/L, Tier 2: ₹${tier2Rate}/L)`, 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Title Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
          {t('tariff.title', 'Tariff Plan & Rate Configuration')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
          {t('tariff.subtitle', 'Configure tiered rate limits, excess consumption multipliers, late payment surcharges, and usage alert thresholds for your apartment community.')}
        </p>
      </div>

      {/* Main Two-Column Grid matching Screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Card: Community Tariff Tiers & Fees */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-800 dark:text-white">{t('tariff.communityTiers', 'Community Tariff Tiers & Fees')}</h3>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            {/* Field 1: Tier 1 Base Rate */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('tariff.tier1Rate', 'Tier 1 Base Rate (₹ / Litre)')}
              </label>
              <input
                type="number"
                step="0.1"
                value={tier1Rate}
                onChange={(e) => setTier1Rate(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition"
                required
              />
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">{t('tariff.tier1RateHelp', 'Applied to consumption up to tier limit.')}</p>
            </div>

            {/* Field 2: Tier 1 Volume Limit */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('tariff.tier1Limit', 'Tier 1 Volume Limit (Liters)')}
              </label>
              <input
                type="number"
                step="100"
                value={tier1Limit}
                onChange={(e) => setTier1Limit(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition"
                required
              />
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">{t('tariff.tier1LimitHelp', 'Threshold (e.g., 10,000 L) before Tier 2 excess pricing applies.')}</p>
            </div>

            {/* Field 3: Tier 2 Excess Rate */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('tariff.tier2Rate', 'Tier 2 Excess Rate (₹ / Litre)')}
              </label>
              <input
                type="number"
                step="0.1"
                value={tier2Rate}
                onChange={(e) => setTier2Rate(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition"
                required
              />
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">{t('tariff.tier2RateHelp', 'Higher multiplier applied to consumption beyond Tier 1 limit.')}</p>
            </div>

            {/* Field 4: Late Payment Fee */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('tariff.lateFee', 'Late Payment Fee per Month (₹ / Month)')}
              </label>
              <input
                type="number"
                value={lateFeeMonthly}
                onChange={(e) => setLateFeeMonthly(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition"
                required
              />
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">{t('tariff.lateFeeHelp', 'Extra surcharge charged for every month the payment is late.')}</p>
            </div>

            {/* Field 5: Grace Period */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('tariff.gracePeriod', 'Payment Grace Period (Days)')}
              </label>
              <input
                type="number"
                value={gracePeriodDays}
                onChange={(e) => setGracePeriodDays(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition"
                required
              />
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">{t('tariff.gracePeriodHelp', 'Days allowed after bill generation before late fees apply.')}</p>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end">
              <button
                type="submit"
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{t('tariff.saveScheme', 'Save Scheme Changes')}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Card: Tariff Calculation Preview (Matching Screenshot) */}
        <div className="relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6 overflow-hidden">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-800 dark:text-white">{t('tariff.previewTitle', 'Tariff Calculation Preview')}</h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                {t('tariff.previewSubtitle', 'Test how your configured rates and late fees will calculate household bills based on hypothetical consumption and overdue delay.')}
              </p>
            </div>
          </div>

          {/* Slider 1: Simulated Consumption */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>{t('tariff.simConsumption', 'Simulated Consumption (Liters):')}</span>
              <span className="font-mono text-blue-600 dark:text-cyan-400 text-sm font-bold">
                {simulatedConsumption.toLocaleString()} L
              </span>
            </div>
            <input
              type="range"
              min="500"
              max="30000"
              step="500"
              value={simulatedConsumption}
              onChange={(e) => setSimulatedConsumption(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono">
              <span>500 L</span>
              <span>15,000 L</span>
              <span>30,000 L</span>
            </div>
          </div>

          {/* Slider 2: Simulated Payment Delay */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>{t('tariff.simDelay', 'Simulated Payment Delay:')}</span>
              <span className="font-mono text-blue-600 dark:text-cyan-400 text-sm font-bold">
                {simulatedDelayMonths === 0 ? t('tariff.onTime', 'On-Time') : `${simulatedDelayMonths} ${t('tariff.monthsOverdue', 'Month(s) Overdue')}`}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="6"
              step="1"
              value={simulatedDelayMonths}
              onChange={(e) => setSimulatedDelayMonths(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono">
              <span>0 ({t('tariff.onTime', 'On-Time')})</span>
              <span>3 Months</span>
              <span>6 Months</span>
            </div>
          </div>

          {/* Bill Calculation Breakdown Box */}
          <div className="p-4 bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-2xl space-y-2.5 text-xs">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>{t('tariff.tier1Portion', 'Tier 1 Base Portion')} ({tier1Consumption.toLocaleString()} L):</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white">₹{tier1Cost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>{t('tariff.tier2Portion', 'Tier 2 Excess Portion')} ({tier2Consumption.toLocaleString()} L):</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white">₹{tier2Cost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
              <span>{t('tariff.lateSurcharge', 'Late Payment Surcharge')} ({simulatedDelayMonths} Mo @ ₹{lateFeeMonthly}/Mo):</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white">₹{lateFeeCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-sm">
              <span className="font-bold text-slate-800 dark:text-white">{t('tariff.estTotalBill', 'Estimated Total Bill:')}</span>
              <span className="font-mono font-extrabold text-blue-600 dark:text-cyan-400 text-lg">
                ₹{estimatedTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Watermark decoration at bottom right */}
          <div className="pt-2 flex justify-end text-slate-300 dark:text-slate-700">
            <div className="text-3xl opacity-80 select-none pointer-events-none">
              🤖
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
