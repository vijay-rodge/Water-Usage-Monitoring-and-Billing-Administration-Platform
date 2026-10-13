import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Download, 
  Eye, 
  ShieldCheck, 
  Clock, 
  AlertTriangle,
  RefreshCw,
  Mail,
  Phone,
  Building2
} from 'lucide-react';
import { api } from '../../services/api';

export const AdminDocumentInspectionModal = ({ 
  request, 
  isOpen, 
  onClose, 
  onVerified 
}) => {
  if (!isOpen || !request) return null;

  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const documentData = request.documentData;
  const documentName = request.documentName || 'Residency_Verification_Document.pdf';
  const documentType = request.documentType || 'ELECTRICITY_BILL';

  const handleApproveDocument = async () => {
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      await api.verifyResidentDocument(request.id, {
        status: 'VERIFIED',
        reason: 'Document verified and flat residency approved by Administrator',
        communityId: request.apartmentId
      });
      if (onVerified) onVerified(request.id, 'VERIFIED');
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to verify document');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectDocument = async (e) => {
    e.preventDefault();
    if (!rejectReason.trim()) {
      setErrorMsg('Please specify a rejection reason for the resident.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);
    try {
      await api.verifyResidentDocument(request.id, {
        status: 'REJECTED',
        reason: rejectReason.trim(),
        communityId: request.apartmentId
      });
      if (onVerified) onVerified(request.id, 'REJECTED', rejectReason.trim());
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to reject document');
    } finally {
      setIsProcessing(false);
    }
  };

  const getDocTypeLabel = (type) => {
    switch (type) {
      case 'ELECTRICITY_BILL':
        return '⚡ Electricity Bill (BESCOM / State Power Board)';
      case 'RENTAL_AGREEMENT':
        return '📜 Rental / Tenancy Agreement';
      case 'SALE_DEED':
        return '🏠 Property Tax / Sale Deed';
      case 'GOVERNMENT_ID':
        return '🪪 Government ID Proof';
      default:
        return '📄 Residency Proof Document';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-4 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400 flex items-center justify-center font-bold shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg">
                  Manual Document Verification
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-cyan-300 font-mono text-xs font-bold">
                  Flat {request.flatNo} • {request.blockWing || 'Wing A'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Inspect resident's proof of residency and confirm or decline verification.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resident & Document Info Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs">
          <div>
            <span className="text-[11px] text-slate-400 font-semibold block">Resident Applicant</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">{request.fullName}</span>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
              <Mail className="w-3 h-3" />
              <span className="truncate">{request.email}</span>
            </div>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 font-semibold block">Document Category</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
              {getDocTypeLabel(documentType)}
            </span>
            <span className="text-[11px] font-mono text-slate-400 block truncate">
              File: {documentName}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-400 font-semibold block">Verification Status</span>
            <span className={`inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-md text-[11px] font-bold ${
              request.documentVerificationStatus === 'VERIFIED'
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                : request.documentVerificationStatus === 'REJECTED'
                ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
            }`}>
              {request.documentVerificationStatus || 'PENDING'}
            </span>
          </div>
        </div>

        {/* Document Preview Box */}
        <div className="flex-1 overflow-auto rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 flex items-center justify-center min-h-[340px]">
          {documentData ? (
            documentData.startsWith('data:image/') ? (
              <img
                src={documentData}
                alt={documentName}
                className="max-h-[55vh] max-w-full object-contain rounded-xl shadow-xs"
              />
            ) : (
              <iframe
                src={documentData}
                title="Document Preview"
                className="w-full h-[55vh] rounded-xl border border-slate-200 dark:border-slate-800"
              />
            )
          ) : (
            <div className="text-center p-8 space-y-2">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
              <p className="font-bold text-sm text-slate-700 dark:text-slate-300">
                No Document Attached
              </p>
              <p className="text-xs text-slate-400">
                The resident registered without attaching a document, or the file was not uploaded yet.
              </p>
            </div>
          )}
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Rejection Form Input */}
        {showRejectForm && (
          <form onSubmit={handleRejectDocument} className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-2">
            <label className="block text-xs font-bold text-rose-900 dark:text-rose-200">
              Reason for Declining Verification (Sent to resident):
            </label>
            <input
              type="text"
              required
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Document image is blurry / Flat number does not match / Electricity bill older than 3 months"
              className="w-full text-xs px-3 py-2 rounded-xl border border-rose-300 dark:border-rose-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-rose-500"
            />
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowRejectForm(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? 'Submitting...' : 'Confirm Decline'}
              </button>
            </div>
          </form>
        )}

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            {documentData && (
              <a
                href={documentData}
                download={documentName}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Original</span>
              </a>
            )}
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-auto">
            {!showRejectForm && (
              <button
                type="button"
                onClick={() => setShowRejectForm(true)}
                disabled={isProcessing}
                className="flex items-center space-x-1 px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition cursor-pointer disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                <span>Decline Document</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleApproveDocument}
              disabled={isProcessing}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>Approve & Verify Document</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
