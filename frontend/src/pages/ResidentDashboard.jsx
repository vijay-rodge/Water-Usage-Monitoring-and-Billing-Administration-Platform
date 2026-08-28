import React, { useState, useEffect } from 'react';
import { 
  Droplets, 
  Gauge, 
  FileText, 
  AlertTriangle, 
  Layers, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Plus, 
  Sparkles,
  RefreshCw,
  Home,
  User
} from 'lucide-react';
import { api } from '../services/api';
import { WaterUsageChart } from '../components/WaterUsageChart';
import { TariffSlabCard } from '../components/TariffSlabCard';
import { SharedCostApportionmentCard } from '../components/SharedCostApportionmentCard';
import { AnomalyAlertBanner } from '../components/AnomalyAlertBanner';
import { InvoiceModal } from '../components/InvoiceModal';
import { ManualReadingModal } from '../components/ManualReadingModal';

export const ResidentDashboard = ({ onOpenCalculator }) => {
  const [data, setData] = useState(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showReadingModal, setShowReadingModal] = useState(false);

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

  const handleResolveAlert = async (alertId) => {
    await api.resolveAlert(alertId);
    loadData();
  };

  if (loading || !data) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-3 text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin text-cyan-400" />
        <span className="text-sm font-medium">Fetching real-time metered telemetry...</span>
      </div>
    );
  }

  const latestInv = data.latestInvoice;
  const isInvoicePaid = latestInv?.paymentStatus === 'PAID';

  return (
    <div className="space-y-8 py-4 text-slate-100">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-3xl">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-600/20">
            <Droplets className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Flat {data.flatNo} — {data.residentName}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold font-mono">
                {data.blockWing}
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono mt-1 flex items-center space-x-3">
              <span>Meter S/N: {data.meterSerialNo || 'WM-SN-A101-2024'}</span>
              <span>•</span>
              <span>Area: 1,650 Sq.Ft (3BHK)</span>
              <span>•</span>
              <span>Occupancy: 4 Persons</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowReadingModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Record Meter Dial</span>
          </button>
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Alerts Bar */}
      {data.recentAlerts && data.recentAlerts.length > 0 && (
        <AnomalyAlertBanner alerts={data.recentAlerts} onResolve={handleResolveAlert} />
      )}

      {/* Key KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Monthly Consumption */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Aug 2026 Consumption</span>
            <Droplets className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
            {data.currentMonthConsumptionLiters?.toLocaleString()} <span className="text-sm font-normal text-slate-400">L</span>
          </div>
          <div className="text-xs text-slate-400 flex items-center space-x-1">
            <span className="text-emerald-400 font-semibold font-mono">Daily Avg: {data.dailyAverageLiters} L</span>
          </div>
        </div>

        {/* Card 2: Current Tier */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Tariff Slab</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-lg font-bold text-cyan-300 truncate">
            {data.currentTierName}
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${data.currentTierProgressPct || 65}%` }}
            ></div>
          </div>
          <div className="text-[11px] text-slate-400 text-right font-mono">
            {data.currentTierProgressPct}% of Tier 2 limit
          </div>
        </div>

        {/* Card 3: Estimated Bill Amount */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Current Estimated Bill</span>
            <CreditCard className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">
            ₹{data.estimatedCurrentBillAmount?.toFixed(2)}
          </div>
          <div className="text-xs text-slate-400">
            Fixed ₹150 + Slabs + STP + Tankers
          </div>
        </div>

        {/* Card 4: Water Efficiency Score */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Conservation Rating</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white flex items-center space-x-2">
            <span>{data.waterEfficiencyScore} / 100</span>
          </div>
          <div className="text-xs text-emerald-400 font-semibold">
            {data.waterEfficiencyScore >= 80 ? '🌟 Efficient Household' : '⚠️ Elevated Consumption'}
          </div>
        </div>
      </div>

      {/* Main Telemetry Chart */}
      <WaterUsageChart data={data.dailyTrends} threshold={750} title="Flat A-101 — Daily Smart Meter Reading Log" />

      {/* Grid: Tariff Slabs & Apportionment */}
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

      {/* Invoices History Table */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">Monthly Water Billing Statements</h3>
              <p className="text-xs text-slate-400">Download, view breakdowns, and settle bills online</p>
            </div>
          </div>
        </div>

        <div className="border border-slate-800 rounded-xl overflow-hidden text-xs">
          <div className="bg-slate-950 px-4 py-3 font-semibold text-slate-400 grid grid-cols-12">
            <div className="col-span-3">Invoice #</div>
            <div className="col-span-3">Cycle Period</div>
            <div className="col-span-2 text-right">Consumption</div>
            <div className="col-span-2 text-right">Amount (₹)</div>
            <div className="col-span-2 text-right">Action</div>
          </div>

          <div className="divide-y divide-slate-800/60 bg-slate-900/40">
            {data.invoicesHistory?.map((inv) => (
              <div key={inv.id} className="px-4 py-3 grid grid-cols-12 items-center text-slate-300 hover:bg-slate-800/40 transition">
                <div className="col-span-3 font-mono font-medium text-white">{inv.invoiceNumber}</div>
                <div className="col-span-3 text-slate-400">{inv.cycleName}</div>
                <div className="col-span-2 text-right font-mono">{inv.totalConsumptionLiters?.toLocaleString()} L</div>
                <div className="col-span-2 text-right font-mono font-bold text-white">₹{inv.totalAmountDue?.toFixed(2)}</div>
                <div className="col-span-2 text-right">
                  <button
                    onClick={() => setSelectedInvoice(inv)}
                    className="px-3 py-1 rounded-lg bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/30 transition text-xs font-semibold"
                  >
                    View Bill
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
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

