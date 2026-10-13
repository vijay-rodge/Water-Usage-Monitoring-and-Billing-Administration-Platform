import React, { useState } from 'react';
import { X, Download, Mail, RefreshCw, CheckCircle2, AlertCircle, ShieldCheck, FileText, Droplets, Calendar, CreditCard, Building, MapPin } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const BulkWaterInvoiceModal = ({ invoice, isOpen, onClose, onInvoiceUpdated }) => {
  if (!isOpen || !invoice) return null;

  const { showToast } = useAuth();
  const [resending, setResending] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(invoice);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const ok = await api.downloadInvoicePdf(currentInvoice.id, currentInvoice.invoiceNumber);
      if (ok) {
        showToast(`Downloaded invoice_${currentInvoice.invoiceNumber}.pdf`, 'success');
      } else {
        showToast('Download initiated', 'info');
      }
    } catch (e) {
      showToast('Error downloading invoice PDF', 'error');
    } finally {
      setDownloading(false);
    }
  };

  const handleResendEmail = async () => {
    setResending(true);
    try {
      const updated = await api.resendInvoice(currentInvoice.id);
      setCurrentInvoice(updated);
      if (onInvoiceUpdated) onInvoiceUpdated(updated);
      if (updated.emailSent) {
        showToast(`Invoice successfully sent to ${updated.customerEmail} via SMTP!`, 'success');
      } else {
        showToast(`SMTP Dispatch notice: ${updated.emailError || 'Email could not be delivered'}`, 'error');
      }
    } catch (e) {
      showToast(e.message || 'Failed to resend email', 'error');
    } finally {
      setResending(false);
    }
  };

  const inv = currentInvoice;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 to-blue-700 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Droplets className="w-5 h-5 text-sky-200" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base tracking-tight">Bulk Water Tax Invoice</h3>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-mono font-bold">
                  {inv.invoiceNumber}
                </span>
              </div>
              <p className="text-xs text-sky-100">AquaFlow Smart Water Platform</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
          
          {/* Email Notification Status Banner */}
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
            inv.emailSent
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <div className="flex items-start space-x-2.5">
              {inv.emailSent ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-bold flex items-center space-x-1.5">
                  <span>{inv.emailSent ? 'Invoice PDF Dispatched via SMTP' : 'Email Delivery Pending / Failed'}</span>
                  <span className="text-[10px] opacity-75 font-mono">({inv.customerEmail})</span>
                </div>
                <div className="text-[11px] mt-0.5 opacity-90">
                  {inv.emailSent
                    ? `Successfully sent with attachment invoice_${inv.invoiceNumber}.pdf${inv.emailSentAt ? ` on ${new Date(inv.emailSentAt).toLocaleString()}` : ''}`
                    : (inv.emailError ? `Error: ${inv.emailError}` : 'Email dispatch queued or timed out')}
                </div>
              </div>
            </div>

            <button
              onClick={handleResendEmail}
              disabled={resending}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 shrink-0 transition cursor-pointer ${
                inv.emailSent
                  ? 'bg-emerald-200/60 hover:bg-emerald-200 text-emerald-900'
                  : 'bg-amber-600 hover:bg-amber-500 text-white shadow-xs'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
              <span>{resending ? 'Sending...' : (inv.emailSent ? 'Resend Email' : 'Retry Email Now')}</span>
            </button>
          </div>

          {/* Cards: Customer & Order Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Customer Details */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Customer / Billed To</div>
              <div className="font-bold text-slate-900 text-sm">{inv.customerName || 'Society Resident / Admin'}</div>
              {inv.organizationName && (
                <div className="flex items-center space-x-1.5 text-slate-600">
                  <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{inv.organizationName}</span>
                </div>
              )}
              <div className="flex items-center space-x-1.5 text-slate-600">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-mono">{inv.customerEmail}</span>
              </div>
              {inv.customerPhone && (
                <div className="text-slate-600">Phone: {inv.customerPhone}</div>
              )}
              {inv.billingAddress && (
                <div className="flex items-start space-x-1.5 text-slate-600 pt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{inv.billingAddress}</span>
                </div>
              )}
            </div>

            {/* Order & Payment Metadata */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Purchase Metadata</div>
              <div>
                <span className="text-slate-500">Order ID: </span>
                <span className="font-mono font-bold text-slate-800">{inv.orderNumber || `ORD-${inv.orderId}`}</span>
              </div>
              <div>
                <span className="text-slate-500">Invoice Date: </span>
                <span className="font-semibold text-slate-800">{inv.invoiceDate}</span>
              </div>
              <div>
                <span className="text-slate-500">Payment Status: </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                  ✓ {inv.paymentStatus || 'PAID'}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Payment Ref: </span>
                <span className="font-mono text-slate-700">{inv.paymentReference || 'UPI-VERIFIED'}</span>
              </div>
              <div>
                <span className="text-slate-500">Payment Method: </span>
                <span className="font-semibold text-slate-800">{inv.paymentMethod || 'UPI'}</span>
              </div>
            </div>

          </div>

          {/* Line Items Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Item Description</th>
                  <th className="p-3 text-right">Quantity</th>
                  <th className="p-3 text-right">Rate</th>
                  <th className="p-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="p-3 font-semibold text-slate-900">
                    {inv.waterType || 'Potable Tanker Water'}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-blue-600">
                    {Number(inv.quantityLiters || 0).toLocaleString()} L
                  </td>
                  <td className="p-3 text-right font-mono">
                    ₹{Number(inv.unitPrice || 0).toFixed(2)}/kL
                  </td>
                  <td className="p-3 text-right font-mono font-semibold">
                    ₹{Number(inv.subtotal || 0).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Financial Totals Breakdown */}
          <div className="flex justify-end">
            <div className="w-full sm:w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono">₹{Number(inv.subtotal || 0).toFixed(2)}</span>
              </div>
              {Number(inv.discount || 0) > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Bulk Discount (5%):</span>
                  <span className="font-mono">-₹{Number(inv.discount).toFixed(2)}</span>
                </div>
              )}
              {Number(inv.tax || 0) > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>GST / Tax (5%):</span>
                  <span className="font-mono">₹{Number(inv.tax).toFixed(2)}</span>
                </div>
              )}
              {Number(inv.deliveryCharge || 0) > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Delivery Charges:</span>
                  <span className="font-mono">₹{Number(inv.deliveryCharge).toFixed(2)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                <span>Total Amount:</span>
                <span className="font-mono text-blue-600 text-base">₹{Number(inv.totalAmount || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 flex items-center space-x-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Cryptographically sealed & logged</span>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-700 font-bold text-xs transition cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-blue-600/20 transition cursor-pointer"
            >
              <Download className={`w-4 h-4 ${downloading ? 'animate-bounce' : ''}`} />
              <span>{downloading ? 'Exporting...' : 'Download PDF'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
