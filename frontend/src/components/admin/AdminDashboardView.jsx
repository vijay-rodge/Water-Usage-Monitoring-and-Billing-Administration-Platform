import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Droplets, 
  UploadCloud, 
  AlertTriangle, 
  Truck, 
  Users, 
  CreditCard, 
  RefreshCw, 
  ArrowRight,
  TrendingUp,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { api } from '../../services/api';
import { WaterUsageChart } from '../WaterUsageChart';
import { AnomalyAlertBanner } from '../AnomalyAlertBanner';
import { CSVUploadModal } from '../CSVUploadModal';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboardView = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const { setActiveTab } = useAuth();

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
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="text-xs font-semibold">Loading society water monitoring telemetry...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200/80 p-6 rounded-3xl shadow-xs">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl shadow-xs">
            🏢
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {data.apartmentName}
              </h2>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-200">
                Live Community
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              48 Total Units • 18,500 Sq.Ft Common Area • Sub-Meter Telemetry
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
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Critical Leak Alerts */}
      {data.criticalAlerts && data.criticalAlerts.length > 0 && (
        <AnomalyAlertBanner alerts={data.criticalAlerts} />
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Community Sub-Meter Draw</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900">
            {data.totalCommunityConsumptionLiters?.toLocaleString()} <span className="text-xs font-normal text-slate-400">Liters</span>
          </div>
          <div className="text-xs text-emerald-600 font-semibold flex items-center space-x-1">
            <span>46 Active Sub-Meters Online</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>External Tanker Inflow</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-cyan-600">
            {data.totalBulkWaterPurchasedLiters?.toLocaleString()} <span className="text-xs font-normal text-slate-400">Liters</span>
          </div>
          <div className="text-xs text-slate-500">
            Apportioned by Flat Area (Sq.Ft)
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Aug 2026 Billing Total</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-emerald-600">
            ₹{data.totalBilledAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-500">
            Collected: <span className="text-slate-800 font-mono font-bold">₹{data.totalCollectedAmount?.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Active Leak Anomalies</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-amber-600">
            {data.unresolvedAnomaliesCount} <span className="text-xs font-normal text-slate-400">Flats</span>
          </div>
          <div className="text-xs text-amber-600 font-semibold cursor-pointer hover:underline" onClick={() => setActiveTab('leakage')}>
            Investigate Leak Radar →
          </div>
        </div>
      </div>

      {/* Community Chart */}
      <WaterUsageChart
        data={data.communityDailyTrends}
        threshold={18500}
        title="Society-Wide Daily Water Draw (Sumps & Sub-Meters)"
      />

      {/* Household Leaderboard Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800">Flat Consumption & Billing Summary</h3>
              <p className="text-xs text-slate-400">Sub-metered volume, estimated charge, and anomaly status</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('households')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <span>View All 48 Flats</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="border border-slate-100 rounded-2xl overflow-hidden text-xs">
          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
              <div className="bg-slate-50 px-4 py-3 font-bold text-slate-500 grid grid-cols-12">
                <div className="col-span-2">Flat / Wing</div>
                <div className="col-span-3">Primary Resident</div>
                <div className="col-span-2">Typology & Area</div>
                <div className="col-span-2 text-right">Consumption (L)</div>
                <div className="col-span-2 text-right">Est. Bill (₹)</div>
                <div className="col-span-1 text-center">Status</div>
              </div>

          <div className="divide-y divide-slate-100">
            {data.topConsumingHouseholds?.map((h) => (
              <div key={h.householdId} className="px-4 py-3 grid grid-cols-12 items-center text-slate-700 hover:bg-slate-50/80 transition">
                <div className="col-span-2 font-mono font-bold text-slate-900">Flat {h.flatNo}</div>
                <div className="col-span-3 font-medium text-slate-800">{h.ownerName}</div>
                <div className="col-span-2 text-slate-500">{h.bhk} • {h.carpetArea} sq.ft</div>
                <div className="col-span-2 text-right font-mono font-semibold text-blue-600">
                  {h.monthlyConsumptionLiters?.toLocaleString()} L
                </div>
                <div className="col-span-2 text-right font-mono font-bold text-slate-900">
                  ₹{h.estimatedCost?.toFixed(2)}
                </div>
                <div className="col-span-1 text-center">
                  {h.hasAnomaly ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 font-bold">
                      Spike
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 font-semibold">
                      Normal
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
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

