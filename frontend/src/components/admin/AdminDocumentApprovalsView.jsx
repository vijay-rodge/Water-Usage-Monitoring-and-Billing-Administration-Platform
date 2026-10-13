import React, { useState, useEffect } from 'react';
import { 
  FileCheck, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Eye, 
  RefreshCw, 
  Download, 
  Building2, 
  Users, 
  Mail, 
  Phone,
  ShieldAlert,
  FileText
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { AdminDocumentInspectionModal } from './AdminDocumentInspectionModal';

export const AdminDocumentApprovalsView = () => {
  const { user, showToast, t } = useAuth();
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'VERIFIED' | 'REJECTED' | 'NOT_SUBMITTED'
  const [selectedResident, setSelectedResident] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const aptId = user?.communityId || user?.apartmentId || 1;
      const data = await api.getCommunityResidentDocuments(aptId);
      setResidents(data || []);
    } catch (e) {
      console.error('Failed to load resident documents:', e);
      showToast('Failed to load resident verification list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [user?.communityId, user?.apartmentId]);

  // Direct quick approve
  const handleQuickApprove = async (resident) => {
    setActionLoading(resident.id);
    try {
      const aptId = user?.communityId || user?.apartmentId || 1;
      await api.verifyResidentDocument(resident.id, {
        status: 'VERIFIED',
        reason: 'Document verified & approved by Community Administrator',
        communityId: aptId
      });
      showToast(`Document for Flat ${resident.flatNo} verified successfully!`, 'success');
      loadDocuments();
    } catch (e) {
      showToast(e.message || 'Approval failed', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Direct quick decline with prompt
  const handleQuickDecline = async (resident) => {
    const reason = window.prompt(
      `Please provide a decline reason for Flat ${resident.flatNo} (${resident.fullName}):`,
      'Document copy is unclear or details do not match metered flat.'
    );
    if (!reason) return;

    setActionLoading(resident.id);
    try {
      const aptId = user?.communityId || user?.apartmentId || 1;
      await api.verifyResidentDocument(resident.id, {
        status: 'REJECTED',
        reason: reason.trim(),
        communityId: aptId
      });
      showToast(`Document for Flat ${resident.flatNo} was declined. Resident notified.`, 'info');
      loadDocuments();
    } catch (e) {
      showToast(e.message || 'Decline action failed', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Compute Metrics
  const totalCount = residents.length;
  const pendingCount = residents.filter(r => r.documentVerificationStatus === 'PENDING').length;
  const verifiedCount = residents.filter(r => r.documentVerificationStatus === 'VERIFIED').length;
  const rejectedCount = residents.filter(r => r.documentVerificationStatus === 'REJECTED').length;
  const notSubmittedCount = residents.filter(r => !r.documentVerificationStatus || r.documentVerificationStatus === 'NOT_SUBMITTED').length;

  // Filter & Search
  const filteredResidents = residents.filter((r) => {
    const matchesStatus = 
      statusFilter === 'ALL' ? true :
      statusFilter === 'NOT_SUBMITTED' ? (!r.documentVerificationStatus || r.documentVerificationStatus === 'NOT_SUBMITTED') :
      r.documentVerificationStatus === statusFilter;

    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      (r.fullName && r.fullName.toLowerCase().includes(term)) ||
      (r.flatNo && r.flatNo.toLowerCase().includes(term)) ||
      (r.email && r.email.toLowerCase().includes(term)) ||
      (r.phone && r.phone.toLowerCase().includes(term));

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl shadow-xs">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-xl shadow-xs">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Resident Document Approvals & Verification
              </h2>
              {pendingCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 text-xs font-bold font-mono">
                  {pendingCount} Pending Review
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Review and manually verify electricity bills, lease deeds, and property ownership proofs submitted by residents.
            </p>
          </div>
        </div>

        <button
          onClick={loadDocuments}
          className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition cursor-pointer self-start sm:self-auto"
          title="Refresh List"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div 
          onClick={() => setStatusFilter('ALL')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            statusFilter === 'ALL'
              ? 'bg-blue-50/70 border-blue-400 dark:bg-blue-950/50 dark:border-blue-600 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Total Residents</div>
          <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white mt-1">{totalCount}</div>
          <div className="text-[10px] text-blue-600 dark:text-cyan-400 mt-1">Community Directory</div>
        </div>

        <div 
          onClick={() => setStatusFilter('PENDING')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            statusFilter === 'PENDING'
              ? 'bg-amber-50/70 border-amber-400 dark:bg-amber-950/50 dark:border-amber-600 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 flex items-center justify-between">
            <span>Pending Review</span>
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-amber-600 dark:text-amber-400 mt-1">{pendingCount}</div>
          <div className="text-[10px] text-amber-600 dark:text-amber-300 mt-1 font-semibold">Requires Inspection</div>
        </div>

        <div 
          onClick={() => setStatusFilter('VERIFIED')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            statusFilter === 'VERIFIED'
              ? 'bg-emerald-50/70 border-emerald-400 dark:bg-emerald-950/50 dark:border-emerald-600 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center justify-between">
            <span>Verified</span>
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-1">{verifiedCount}</div>
          <div className="text-[10px] text-emerald-600 dark:text-emerald-300 mt-1 font-semibold">Approved Ownership</div>
        </div>

        <div 
          onClick={() => setStatusFilter('REJECTED')}
          className={`p-4 rounded-2xl border transition cursor-pointer ${
            statusFilter === 'REJECTED'
              ? 'bg-rose-50/70 border-rose-400 dark:bg-rose-950/50 dark:border-rose-600 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-semibold text-rose-700 dark:text-rose-400 flex items-center justify-between">
            <span>Declined</span>
            <XCircle className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-rose-600 dark:text-rose-400 mt-1">{rejectedCount}</div>
          <div className="text-[10px] text-rose-600 dark:text-rose-300 mt-1 font-semibold">Resubmission Needed</div>
        </div>

        <div 
          onClick={() => setStatusFilter('NOT_SUBMITTED')}
          className={`p-4 rounded-2xl border transition cursor-pointer col-span-2 lg:col-span-1 ${
            statusFilter === 'NOT_SUBMITTED'
              ? 'bg-slate-100 border-slate-400 dark:bg-slate-800 dark:border-slate-600 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Not Uploaded</div>
          <div className="text-2xl font-extrabold font-mono text-slate-700 dark:text-slate-300 mt-1">{notSubmittedCount}</div>
          <div className="text-[10px] text-slate-400 mt-1">Pending Resident Action</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by flat, name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
          {['ALL', 'PENDING', 'VERIFIED', 'REJECTED', 'NOT_SUBMITTED'].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
                statusFilter === f
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {f === 'ALL' ? 'All' :
               f === 'PENDING' ? `Pending (${pendingCount})` :
               f === 'VERIFIED' ? `Verified (${verifiedCount})` :
               f === 'REJECTED' ? `Declined (${rejectedCount})` : 'Not Uploaded'}
            </button>
          ))}
        </div>
      </div>

      {/* Residents Verification Grid / Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Resident Documents Directory ({filteredResidents.length})
            </h3>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3 text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin text-cyan-600" />
            <span className="text-xs font-semibold">Loading verification records...</span>
          </div>
        ) : filteredResidents.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <FileCheck className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <div className="text-sm font-bold text-slate-700 dark:text-slate-300">No resident records found</div>
            <div className="text-xs text-slate-400">Try changing your search term or filter status</div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredResidents.map((r) => {
              const docStatus = r.documentVerificationStatus || 'NOT_SUBMITTED';
              const hasDoc = Boolean(r.documentData);

              return (
                <div 
                  key={r.id} 
                  className="p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition"
                >
                  {/* Left: Resident Profile & Flat */}
                  <div className="flex items-start space-x-3.5 min-w-[240px]">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-100 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-300 font-extrabold flex items-center justify-center text-sm shrink-0">
                      {r.flatNo || 'FLAT'}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          {r.fullName}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-300 font-mono text-[11px] font-bold border border-blue-200 dark:border-blue-800">
                          Flat {r.flatNo} • {r.blockWing || 'Wing A'}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
                        <span className="flex items-center space-x-1">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{r.email}</span>
                        </span>
                        {r.phone && (
                          <span className="flex items-center space-x-1">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{r.phone}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Middle: Document Metadata & Status Badge */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs">
                    <div>
                      <div className="text-[11px] text-slate-400 font-medium">Document Type</div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center space-x-1.5">
                        <FileText className="w-3.5 h-3.5 text-cyan-500" />
                        <span>{r.documentType ? r.documentType.replace('_', ' ') : 'Not Specified'}</span>
                      </div>
                      {r.documentName && (
                        <div className="text-[10px] text-slate-400 font-mono truncate max-w-[180px]" title={r.documentName}>
                          {r.documentName}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="text-[11px] text-slate-400 font-medium">Verification Status</div>
                      <span className={`inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        docStatus === 'VERIFIED'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                          : docStatus === 'PENDING'
                          ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                          : docStatus === 'REJECTED'
                          ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                          : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                      }`}>
                        {docStatus.replace('_', ' ')}
                      </span>
                    </div>

                    {docStatus === 'REJECTED' && r.documentRejectionReason && (
                      <div className="text-[11px] text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 px-2.5 py-1 rounded-xl max-w-xs">
                        <span className="font-bold">Decline reason:</span> {r.documentRejectionReason}
                      </div>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center space-x-2 self-end sm:self-auto shrink-0">
                    {hasDoc ? (
                      <button
                        type="button"
                        onClick={() => setSelectedResident(r)}
                        className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-950/60 dark:hover:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300 text-xs font-bold transition cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Document</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic px-3 py-2">
                        No File Uploaded
                      </span>
                    )}

                    {hasDoc && docStatus !== 'VERIFIED' && (
                      <button
                        type="button"
                        onClick={() => handleQuickApprove(r)}
                        disabled={actionLoading === r.id}
                        className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition cursor-pointer disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    )}

                    {hasDoc && docStatus !== 'REJECTED' && (
                      <button
                        type="button"
                        onClick={() => handleQuickDecline(r)}
                        disabled={actionLoading === r.id}
                        className="flex items-center space-x-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 dark:hover:bg-rose-950/40 dark:hover:border-rose-800 text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Document Inspector Modal */}
      <AdminDocumentInspectionModal
        request={selectedResident}
        resident={selectedResident}
        isOpen={Boolean(selectedResident)}
        onClose={() => setSelectedResident(null)}
        onVerified={loadDocuments}
      />
    </div>
  );
};
