import React from 'react';
import { 
  FileCheck, 
  ShieldCheck, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  FileText, 
  UploadCloud, 
  HelpCircle,
  Building,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ResidentDocumentVerificationCard } from './ResidentDocumentVerificationCard';

export const ResidentDocumentVerificationView = () => {
  const { user, setUser, t } = useAuth();

  const status = user?.documentVerificationStatus || 'NOT_SUBMITTED';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl shadow-xs">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-xl shadow-xs">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {t('verification.title', 'Residence Document Verification')}
              </h2>
              <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${
                status === 'VERIFIED'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                  : status === 'PENDING'
                  ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                  : status === 'REJECTED'
                  ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                  : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
              }`}>
                {status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Flat {user?.flatNo || 'A-101'} • {user?.communityName || 'Your Residential Society'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Encrypted Resident Identity Vault</span>
        </div>
      </div>

      {/* Main Verification Card */}
      <ResidentDocumentVerificationCard 
        user={user} 
        onStatusChange={(updated) => {
          if (updated) setUser(updated);
        }} 
      />

      {/* Verification Process & Guidelines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
            <UploadCloud className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">1. Submit Proof</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Attach a recent electricity bill, rental agreement, or property deed showing your flat number and name. Supported formats: PDF, PNG, JPG (up to 10MB).
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">2. Admin Review</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Your designated society secretary / community admin inspects the document to verify tenant or owner authorization for this metered unit.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">3. Verified Status</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Once approved, your account receives the verified green badge, full meter billing access, and high-priority leak investigation dispatch.
          </p>
        </div>
      </div>

      {/* Accepted Documents List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-bold text-sm">
          <FileText className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span>Accepted Documents for Residence Verification</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start space-x-3">
            <div className="w-2 h-2 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">Electricity Bill</span>
              <span className="text-slate-500 dark:text-slate-400">DISCOM utility bill from within the last 3 months with flat number matching.</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start space-x-3">
            <div className="w-2 h-2 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">Rental / Lease Agreement</span>
              <span className="text-slate-500 dark:text-slate-400">Valid lease deed signed between landlord and resident tenant.</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start space-x-3">
            <div className="w-2 h-2 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">Sale Deed / Property Tax Receipt</span>
              <span className="text-slate-500 dark:text-slate-400">Municipal tax or registration copy confirming owner occupancy.</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start space-x-3">
            <div className="w-2 h-2 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">Government ID</span>
              <span className="text-slate-500 dark:text-slate-400">Aadhaar card, Passport, or Voter ID showing this apartment address.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
