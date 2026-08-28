import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Droplets, 
  UploadCloud, 
  AlertTriangle, 
  FileSpreadsheet, 
  Truck, 
  Users, 
  ShieldCheck, 
  ArrowUpRight, 
  RefreshCw,
  PlusCircle,
  FileText,
  CreditCard
} from 'lucide-react';
import { api } from '../services/api';
import { WaterUsageChart } from '../components/WaterUsageChart';
import { AnomalyAlertBanner } from '../components/AnomalyAlertBanner';
import { CSVUploadModal } from '../components/CSVUploadModal';

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCsvModal, setShowCsvModal] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminDashboard(1);
      setData(res);
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
        <RefreshCw className="w-8 h-8 animate-spin text-cyan-400" />
        <span className="text-sm font-medium">Loading society water telemetry and accounting...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4 text-slate-100">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-3xl">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {data.apartmentName}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold font-mono">
                Admin Console
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              48 Total Flats • 18,500 Sq.Ft Common Area • Bengaluru Central
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCsvModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Daily CSV Batch</span>
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

      {/* Critical Alerts */}
      {data.criticalAlerts && data.criticalAlerts.length > 0 && (
        <AnomalyAlertBanner alerts={data.criticalAlerts} />
      )}

      {/* Society High-level KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Community Metered Use</span>
            <Droplets className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
            {data.totalCommunityConsumptionLiters?.toLocaleString()} <span className="text-sm font-normal text-slate-400">L</span>
          </div>
          <div className="text-xs text-emerald-400 font-semibold">46 Active Sub-Meters Online</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>External Bulk Tankers Inflow</span>
            <Truck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-400">
            {data.totalBulkWaterPurchasedLiters?.toLocaleString()} <span className="text-sm font-normal text-slate-400">L</span>
          </div>
          <div className="text-xs text-slate-400">Apportioned by Flat Carpet Area</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Aug 2026 Society Billing Total</span>
            <CreditCard className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">
            ₹{data.totalBilledAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-400">Collected: <span className="text-white font-mono font-bold">₹{data.totalCollectedAmount?.toLocaleString('en-IN')}</span></div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Unresolved Leak Anomalies</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
            {data.unresolvedAnomaliesCount} <span className="text-sm font-normal text-slate-400">Flats</span>
          </div>
          <div className="text-xs text-amber-400 font-semibold">Under Investigation</div>
        </div>
      </div>

      {/* Community Chart */}
      <WaterUsageChart
        data={data.communityDailyTrends}
        threshold={18500}
        title="Entire Society Daily Water Draw (Sumps & Tankers)"
      />

      {/* Household Water Leaderboard */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">Apartment Consumption Breakdown</h3>
              <p className="text-xs text-slate-400">Individual flat metered volume, estimated charge, and anomaly status</p>
            </div>
          </div>
        </div>

        <div className="border border-slate-800 rounded-xl overflow-hidden text-xs">
          <div className="bg-slate-950 px-4 py-3 font-semibold text-slate-400 grid grid-cols-12">
            <div className="col-span-2">Flat / Wing</div>
            <div className="col-span-3">Primary Resident</div>
            <div className="col-span-2">Typology & Area</div>
            <div className="col-span-2 text-right">Consumption (L)</div>
            <div className="col-span-2 text-right">Est. Bill (₹)</div>
            <div className="col-span-1 text-center">Status</div>
          </div>

          <div className="divide-y divide-slate-800/60 bg-slate-900/40">
            {data.topConsumingHouseholds?.map((h) => (
              <div key={h.householdId} className="px-4 py-3 grid grid-cols-12 items-center text-slate-300 hover:bg-slate-800/40 transition">
                <div className="col-span-2 font-mono font-bold text-white">Flat {h.flatNo}</div>
                <div className="col-span-3 text-slate-200">{h.ownerName}</div>
                <div className="col-span-2 text-slate-400">{h.bhk} • {h.carpetArea} sq.ft</div>
                <div className="col-span-2 text-right font-mono font-medium text-cyan-300">
                  {h.monthlyConsumptionLiters?.toLocaleString()} L
                </div>
                <div className="col-span-2 text-right font-mono font-bold text-white">
                  ₹{h.estimatedCost?.toFixed(2)}
                </div>
                <div className="col-span-1 text-center">
                  {h.hasAnomaly ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-semibold">
                      Spike
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                      Normal
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CSVUploadModal
        isOpen={showCsvModal}
        onClose={() => setShowCsvModal(false)}
        onUploaded={loadData}
      />
    </div>
  );
};

