import React, { useState, useEffect } from 'react';
import { 
  Droplets, 
  Layers, 
  CreditCard, 
  Sparkles, 
  Plus, 
  RefreshCw,
  FileText,
  AlertTriangle,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { api } from '../../services/api';
import { WaterUsageChart } from '../WaterUsageChart';
import { TariffSlabCard } from '../TariffSlabCard';
import { SharedCostApportionmentCard } from '../SharedCostApportionmentCard';
import { AnomalyAlertBanner } from '../AnomalyAlertBanner';
import { InvoiceModal } from '../InvoiceModal';
import { ManualReadingModal } from '../ManualReadingModal';
import { useAuth } from '../../context/AuthContext';

export const ResidentDashboardView = () => {
  const [data, setData] = useState(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showReadingModal, setShowReadingModal] = useState(false);
  const { setActiveTab, t } = useAuth();

  const loadData = async () => {
    setLoading(true);
    try {
      const [dash, tariff] = await Promise.all([
        api.getResidentDashboard(1),
        api.getTariffPlan(1)
      ]);
      setData(dash);
      setPlan(tariff);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading || !data) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-3 text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600 dark:text-cyan-400" />
        <span className="text-xs font-semibold">Loading your smart meter data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl shadow-xs">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-cyan-400 flex items-center justify-center font-bold text-xl shadow-xs">
            💧
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Flat {data.flatNo} — {data.residentName}
              </h2>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-blue-800">
                {data.blockWing}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
              Meter S/N: WM-SN-A101-2024 • 1,650 Sq.Ft (3BHK) • 4 Occupants
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowReadingModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Record Meter Dial</span>
          </button>
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Anomaly Alerts */}
      {data.recentAlerts && data.recentAlerts.length > 0 && (
        <AnomalyAlertBanner alerts={data.recentAlerts} />
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>{t('resident.currentUsage', 'Current Month Consumption')}</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
            {data.currentMonthConsumptionLiters?.toLocaleString()} <span className="text-xs font-normal text-slate-400">Liters</span>
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1">
            <span>{t('resident.dailyAvg', 'Daily Avg')}: {data.dailyAverageLiters} L/day</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>Active Tariff Slab</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-sm font-bold text-blue-600 dark:text-cyan-400 truncate">
            {data.currentTierName}
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-full rounded-full transition-all"
              style={{ width: `${data.currentTierProgressPct || 70}%` }}
            ></div>
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 text-right font-mono">
            {data.currentTierProgressPct}% of Tier 2 limit
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>{t('resident.estBill', 'Estimated Current Bill')}</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
            ₹{data.estimatedCurrentBillAmount?.toFixed(2)}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Fixed + Slabs + STP + Tankers
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>{t('resident.waterScore', 'Water Conservation Rating')}</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
            {data.waterEfficiencyScore} / 100
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            🌟 Efficient Household
          </div>
        </div>
      </div>

      {/* Telemetry Chart */}
      <WaterUsageChart data={data.dailyTrends} threshold={750} title="Flat A-101 — Daily Smart Meter Reading Log" />

      {/* Tariff Slabs & Tanker Apportionment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TariffSlabCard plan={plan} currentConsumption={data.currentMonthConsumptionLiters} />
        <SharedCostApportionmentCard
          bulkPurchases={[
            { id: 1, purchaseDate: '2026-08-04', supplierName: 'Kavery Clean Water Tankers Ltd', capacityLiters: 24000, cost: 3600.00 },
            { id: 2, purchaseDate: '2026-08-12', supplierName: 'AquaPure Express Tankers', capacityLiters: 12000, cost: 1950.00 },
            { id: 3, purchaseDate: '2026-08-21', supplierName: 'Kavery Clean Water Tankers Ltd', capacityLiters: 24000, cost: 3600.00 }
          ]}
          userFlatArea={1650}
          totalSocietyArea={78000}
        />
      </div>

      {/* Statements Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
            <h3 className="font-bold text-sm text-slate-800 dark:text-white">{t('resident.myBills', 'Your Monthly Statements')}</h3>
          </div>
          <button
            onClick={() => setActiveTab('bills')}
            className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 flex items-center space-x-1 cursor-pointer"
          >
            <span>View All Statements</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden text-xs">
          <div className="overflow-x-auto">
            <div className="min-w-[560px]">
              <div className="bg-slate-50 dark:bg-slate-800/80 px-4 py-3 font-bold text-slate-500 dark:text-slate-400 grid grid-cols-12">
                <div className="col-span-3">Invoice #</div>
                <div className="col-span-3">Billing Cycle</div>
                <div className="col-span-2 text-right">Volume (L)</div>
                <div className="col-span-2 text-right">Amount (₹)</div>
                <div className="col-span-2 text-right">Action</div>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {data.invoicesHistory?.map((inv) => (
                  <div key={inv.id} className="px-4 py-3 grid grid-cols-12 items-center hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                    <div className="col-span-3 font-mono font-bold text-blue-600 dark:text-cyan-400">{inv.invoiceNumber}</div>
                    <div className="col-span-3 text-slate-600 dark:text-slate-300">{inv.cycleName}</div>
                    <div className="col-span-2 text-right font-mono">{inv.totalConsumptionLiters.toLocaleString()} L</div>
                    <div className="col-span-2 text-right font-mono font-bold text-slate-900 dark:text-white">₹{inv.totalAmountDue.toFixed(2)}</div>
                    <div className="col-span-2 text-right">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="px-3 py-1 bg-blue-50 dark:bg-blue-900/40 hover:bg-blue-600 hover:text-white text-blue-600 dark:text-cyan-400 rounded-lg font-semibold transition text-xs cursor-pointer"
                      >
                        View Bill
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <InvoiceModal
        invoice={selectedInvoice}
        isOpen={Boolean(selectedInvoice)}
        onClose={() => setSelectedInvoice(null)}
        onPaid={() => {
          loadData();
          setSelectedInvoice(null);
        }}
      />

      <ManualReadingModal
        isOpen={showReadingModal}
        onClose={() => setShowReadingModal(false)}
        onSaved={loadData}
        householdId={1}
        flatNo="A-101"
      />
    </div>
  );
};

