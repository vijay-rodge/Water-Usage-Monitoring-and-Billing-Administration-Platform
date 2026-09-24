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
  CheckCircle2,
  Clock,
  XCircle,
  Trash2,
  Mail,
  Phone
} from 'lucide-react';
import { api } from '../../services/api';
import { WaterUsageChart } from '../WaterUsageChart';
import { AnomalyAlertBanner } from '../AnomalyAlertBanner';
import { CSVUploadModal } from '../CSVUploadModal';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboardView = () => {
  const { user, setActiveTab, showToast, t } = useAuth();
  const [data, setData] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [showCsvModal, setShowCsvModal] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const aptId = user?.communityId || user?.apartmentId || 1;
      const [res, pendingRes] = await Promise.all([
        api.getAdminDashboard(aptId),
        api.getPendingResidents(aptId)
      ]);
      setData(res);
      setPendingRequests(pendingRes || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.communityId, user?.apartmentId]);

  const handleApproveRequest = async (req) => {
    setActionLoading(req.id);
    try {
      const aptId = user?.communityId || user?.apartmentId || 1;
      await api.approveResident(req.id, aptId);
      showToast(`Approved Flat ${req.flatNo} for ${req.fullName}!`, 'success');
      setPendingRequests(prev => prev.filter(p => p.id !== req.id));
      const updatedData = await api.getAdminDashboard(aptId);
      setData(updatedData);
    } catch (err) {
      showToast(err.message || 'Failed to approve resident request', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectRequest = async (req) => {
    setActionLoading(req.id);
    try {
      const aptId = user?.communityId || user?.apartmentId || 1;
      await api.rejectResident(req.id, 'Declined by Administrator', aptId);
      showToast(`Request for Flat ${req.flatNo} was declined.`, 'info');
      setPendingRequests(prev => prev.filter(p => p.id !== req.id));
    } catch (err) {
      showToast(err.message || 'Failed to decline resident request', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteRequest = async (req) => {
    if (!window.confirm(`Are you sure you want to delete the pending request from ${req.fullName} (Flat ${req.flatNo})?`)) {
      return;
    }
    setActionLoading(req.id);
    try {
      const aptId = user?.communityId || user?.apartmentId || 1;
      await api.deletePendingResident(req.id, aptId);
      showToast(`Deleted request for Flat ${req.flatNo}.`, 'success');
      setPendingRequests(prev => prev.filter(p => p.id !== req.id));
    } catch (err) {
      showToast(err.message || 'Failed to delete resident request', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading || !data) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-3 text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600 dark:text-cyan-400" />
        <span className="text-xs font-semibold">Loading society water monitoring telemetry...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl shadow-xs">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-cyan-400 flex items-center justify-center font-bold text-xl shadow-xs">
            🏢
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {data.apartmentName || user?.communityName || 'Community Dashboard'}
              </h2>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-blue-800">
                {t('dashboard.liveCommunity', 'Live Community')}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {data.totalHouseholds || user?.totalFlats || 0} {t('dashboard.totalUnits', 'Total Units')} • {data.commonAreaSqft ? `${Number(data.commonAreaSqft).toLocaleString()} ${t('dashboard.commonArea', 'Sq.Ft Common Area')}` : 'Sub-Meter Telemetry'} • {data.apartmentCode ? `Code: ${data.apartmentCode}` : 'Digital Monitoring'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCsvModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{t('dashboard.uploadBatch', 'Upload Daily CSV Batch')}</span>
          </button>
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
            title={t('dashboard.refresh', 'Refresh Data')}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Pending Resident Flat Access Requests Section */}
      {pendingRequests.length > 0 ? (
        <div className="bg-gradient-to-br from-amber-50/90 dark:from-amber-950/30 via-orange-50/40 dark:via-amber-950/20 to-amber-50/90 dark:to-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    {t('dashboard.pendingRequests', 'Pending Resident Flat Requests')}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 text-xs font-bold font-mono">
                    {pendingRequests.length} {t('dashboard.pendingBadge', 'Pending')}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  {t('dashboard.pendingDesc', 'Residents who registered for your community and need your authorization for flat access.')}
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('households')}
              className="text-xs font-bold text-amber-900 dark:text-amber-300 hover:text-amber-950 dark:hover:text-amber-200 flex items-center space-x-1 underline decoration-amber-400 self-start sm:self-auto cursor-pointer"
            >
              <span>{t('dashboard.manageDirectory', 'Manage in Directory')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
            {pendingRequests.map((req) => (
              <div 
                key={req.id} 
                className="bg-white dark:bg-slate-900 border border-amber-200/90 dark:border-amber-800/80 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3 hover:border-amber-400 dark:hover:border-amber-600 transition"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{req.fullName}</h4>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-300 font-mono text-xs font-bold border border-blue-200 dark:border-blue-800">
                        Flat {req.flatNo} • {req.blockWing || 'Wing A'}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300">
                      {req.approvalStatus || 'PENDING'}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 font-mono pt-1">
                    <div className="flex items-center space-x-1.5 truncate" title={req.email}>
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{req.email}</span>
                    </div>
                    {req.phone && (
                      <div className="flex items-center space-x-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{req.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleDeleteRequest(req)}
                    disabled={actionLoading === req.id}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:border-rose-200 dark:hover:border-rose-800 transition text-xs cursor-pointer"
                    title={t('dashboard.delete', 'Delete Request')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => handleRejectRequest(req)}
                      disabled={actionLoading === req.id}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition cursor-pointer"
                    >
                      {t('dashboard.decline', 'Decline')}
                    </button>
                    <button
                      onClick={() => handleApproveRequest(req)}
                      disabled={actionLoading === req.id}
                      className="flex items-center space-x-1 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t('dashboard.approveAccess', 'Approve Access')}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/90 dark:border-emerald-800/60 px-5 py-3 rounded-2xl text-xs text-emerald-900 dark:text-emerald-300">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold">{t('dashboard.allUpToDate', 'All Resident Flat Requests Up-to-Date (0 Pending)')}</span>
          </div>
          <button
            onClick={() => setActiveTab('households')}
            className="font-bold underline hover:text-emerald-950 dark:hover:text-emerald-100 text-[11px] cursor-pointer"
          >
            {t('dashboard.manageHouseholds', 'Manage Households Directory →')}
          </button>
        </div>
      )}

      {/* Critical Leak Alerts */}
      {data.criticalAlerts && data.criticalAlerts.length > 0 && (
        <AnomalyAlertBanner alerts={data.criticalAlerts} />
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>{t('dashboard.subMeterDraw', 'Community Sub-Meter Draw')}</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
            {data.totalCommunityConsumptionLiters?.toLocaleString()} <span className="text-xs font-normal text-slate-400">Liters</span>
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1">
            <span>{data.activeHouseholds != null ? data.activeHouseholds : 0} {t('dashboard.activeSubmeters', 'Active Sub-Meters Online')}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>{t('dashboard.tankerInflow', 'External Tanker Inflow')}</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-cyan-600 dark:text-cyan-400">
            {data.totalBulkWaterPurchasedLiters?.toLocaleString()} <span className="text-xs font-normal text-slate-400">Liters</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Apportioned by Flat Area (Sq.Ft)
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>{t('dashboard.billingTotal', 'Billing Total')}</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
            ₹{data.totalBilledAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {t('dashboard.collected', 'Collected')}: <span className="text-slate-800 dark:text-slate-200 font-mono font-bold">₹{data.totalCollectedAmount?.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>{t('dashboard.leakAnomalies', 'Active Leak Anomalies')}</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
            {data.unresolvedAnomaliesCount} <span className="text-xs font-normal text-slate-400">Flats</span>
          </div>
          <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold cursor-pointer hover:underline" onClick={() => setActiveTab('leakage')}>
            {t('dashboard.investigateRadar', 'Investigate Leak Radar →')}
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
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-white">{t('dashboard.summaryTitle', 'Flat Consumption & Billing Summary')}</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">{t('dashboard.summarySubtitle', 'Sub-metered volume, estimated charge, and anomaly status')}</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('households')}
            className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 flex items-center space-x-1 cursor-pointer"
          >
            <span>{t('dashboard.viewAllFlats', 'View All Flats')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden text-xs">
          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
              <div className="bg-slate-50 dark:bg-slate-800/80 px-4 py-3 font-bold text-slate-500 dark:text-slate-400 grid grid-cols-12">
                <div className="col-span-2">{t('dashboard.flatWing', 'Flat / Wing')}</div>
                <div className="col-span-3">{t('dashboard.primaryResident', 'Primary Resident')}</div>
                <div className="col-span-2">{t('dashboard.typologyArea', 'Typology & Area')}</div>
                <div className="col-span-2 text-right">{t('dashboard.consumption', 'Consumption (L)')}</div>
                <div className="col-span-2 text-right">{t('dashboard.estBill', 'Est. Bill (₹)')}</div>
                <div className="col-span-1 text-center">{t('dashboard.status', 'Status')}</div>
              </div>

              {(!data.topConsumingHouseholds || data.topConsumingHouseholds.length === 0) ? (
                <div className="p-8 text-center text-slate-400 dark:text-slate-500 space-y-1">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">No household telemetry records found for this community yet.</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">Add flats or upload daily CSV readings to view real-time consumption stats.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.topConsumingHouseholds.map((h) => (
                    <div key={h.householdId} className="px-4 py-3 grid grid-cols-12 items-center text-slate-700 dark:text-slate-300 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                      <div className="col-span-2 font-mono font-bold text-slate-900 dark:text-white">
                        Flat {h.flatNo} {h.blockWing ? <span className="text-slate-400 font-normal">({h.blockWing})</span> : ''}
                      </div>
                      <div className="col-span-3 font-medium text-slate-800 dark:text-slate-200">{h.ownerName}</div>
                      <div className="col-span-2 text-slate-500 dark:text-slate-400">
                        {h.bhkType || h.bhk || 'Standard'} • {h.carpetAreaSqft || h.carpetArea ? `${h.carpetAreaSqft || h.carpetArea} sq.ft` : '1200 sq.ft'}
                      </div>
                      <div className="col-span-2 text-right font-mono font-semibold text-blue-600 dark:text-cyan-400">
                        {h.monthlyConsumptionLiters?.toLocaleString()} L
                      </div>
                      <div className="col-span-2 text-right font-mono font-bold text-slate-900 dark:text-white">
                        ₹{h.estimatedCost?.toFixed(2)}
                      </div>
                      <div className="col-span-1 text-center">
                        {h.hasAnomaly ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 font-bold">
                            {t('dashboard.spike', 'Spike')}
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-semibold">
                            {t('dashboard.normal', 'Normal')}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

