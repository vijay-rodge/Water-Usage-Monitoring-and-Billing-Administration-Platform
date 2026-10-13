import React, { useState } from 'react';
import { 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  Eye, 
  Download, 
  ShieldCheck, 
  RefreshCw,
  FileCheck,
  X,
  File
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const ResidentDocumentVerificationCard = ({ userSummary, onUpdated }) => {
  const { user } = useAuth();
  const resident = userSummary || user;

  const [documentType, setDocumentType] = useState(resident?.documentType || 'ELECTRICITY_BILL');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(resident?.documentData || null);
  const [fileName, setFileName] = useState(resident?.documentName || '');
  const [isUploading, setIsUploading] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const verificationStatus = resident?.documentVerificationStatus || 'NOT_SUBMITTED';

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit. Please choose a smaller file.');
      return;
    }

    setFileName(file.name);
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setFilePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!filePreview) {
      alert('Please choose a document to upload.');
      return;
    }

    setIsUploading(true);
    setStatusMessage(null);
    try {
      const updated = await api.uploadVerificationDocument({
        userId: resident?.id || resident?.userId,
        documentType: documentType,
        documentName: fileName || 'verification_document.pdf',
        documentData: filePreview
      });
      setStatusMessage({ type: 'success', text: 'Document submitted successfully! Under review by Community Admin.' });
      setIsFormOpen(false);
      if (onUpdated) onUpdated(updated);
    } catch (err) {
      console.error(err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to upload verification document' });
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusBadge = () => {
    if (verificationStatus === 'VERIFIED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verified Ownership</span>
        </span>
      );
    }
    if (verificationStatus === 'PENDING') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          <span>Verification In Progress</span>
        </span>
      );
    }
    if (verificationStatus === 'REJECTED') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          <span>Verification Declined</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800">
        <AlertTriangle className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
        <span>Verification Pending</span>
      </span>
    );
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Flat Ownership & Tenancy Verification
                </h3>
                {getStatusBadge()}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Upload your flat electricity bill, rental agreement, or sale deed for admin manual validation.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-auto">
            {resident?.documentData && (
              <button
                type="button"
                onClick={() => setShowPreviewModal(true)}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Document</span>
              </button>
            )}

            {verificationStatus !== 'VERIFIED' && (
              <button
                type="button"
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="flex items-center space-x-1 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs transition cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>{resident?.documentData ? 'Re-upload Document' : 'Upload Document'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Status notes & rejection details */}
        {verificationStatus === 'REJECTED' && resident?.documentRejectionReason && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-start gap-3 text-xs text-rose-800 dark:text-rose-300">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Admin Review Note: </span>
              <span>{resident.documentRejectionReason}</span>
              <p className="mt-1 text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                Please re-upload a clear copy showing the flat number and resident name.
              </p>
            </div>
          </div>
        )}

        {verificationStatus === 'VERIFIED' && (
          <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/50 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Document verified by Administrator {resident?.verifiedByAdminName ? `(${resident.verifiedByAdminName})` : ''}.
              </span>
            </div>
            {resident?.documentName && (
              <span className="font-mono text-[11px] font-semibold opacity-80">
                {resident.documentName}
              </span>
            )}
          </div>
        )}

        {verificationStatus === 'PENDING' && (
          <div className="p-3 rounded-2xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/50 flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300">
            <Clock className="w-4 h-4 text-amber-600 shrink-0 animate-pulse" />
            <span>
              Your document <strong className="font-semibold">{resident?.documentName || 'file'}</strong> is currently queued for manual verification by the community secretary.
            </span>
          </div>
        )}

        {statusMessage && (
          <div className={`p-3 rounded-2xl text-xs font-semibold ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' 
              : 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
          }`}>
            {statusMessage.text}
          </div>
        )}

        {/* Upload Form (Expandable) */}
        {isFormOpen && (
          <form onSubmit={handleUploadSubmit} className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Document Type
                </label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-blue-500"
                >
                  <option value="ELECTRICITY_BILL">⚡ Electricity Bill (BESCOM / State Board)</option>
                  <option value="RENTAL_AGREEMENT">📜 Rental / Tenancy Agreement</option>
                  <option value="SALE_DEED">🏠 Property Tax Receipt / Sale Deed</option>
                  <option value="GOVERNMENT_ID">🪪 Government ID (Aadhaar / Passport)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Select Document File (PDF, PNG, JPG, max 10MB)
                </label>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp, application/pdf"
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 dark:file:bg-blue-950 file:text-blue-700 dark:file:text-cyan-400 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>
            </div>

            {fileName && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{fileName}</span>
                </div>
                <span className="text-[11px] text-slate-400">Ready to upload</span>
              </div>
            )}

            <div className="flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading || !filePreview}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs transition disabled:opacity-50 cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading Document...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Submit to Admin</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Document Preview Modal */}
      {showPreviewModal && resident?.documentData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  {resident.documentName || 'Verification Document'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Type: {resident.documentType || 'Electricity Bill'} • Status: {verificationStatus}
                </p>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto rounded-2xl bg-slate-50 dark:bg-slate-950 p-2 flex items-center justify-center min-h-[300px]">
              {resident.documentData.startsWith('data:image/') ? (
                <img
                  src={resident.documentData}
                  alt={resident.documentName || 'Document Preview'}
                  className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-xs"
                />
              ) : (
                <iframe
                  src={resident.documentData}
                  title="Document Preview"
                  className="w-full h-[60vh] rounded-xl border border-slate-200 dark:border-slate-800"
                />
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <a
                href={resident.documentData}
                download={resident.documentName || 'verification_document'}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition"
              >
                <Download className="w-4 h-4" />
                <span>Download Document</span>
              </a>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
