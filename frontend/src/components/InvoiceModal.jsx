import React, { useState } from 'react';
import { X, CheckCircle2, Download, Printer, ShieldCheck, Droplets, Calendar, CreditCard, QrCode, Smartphone } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const InvoiceModal = ({ invoice, isOpen, onClose, onPaid }) => {
  if (!isOpen || !invoice) return null;

  const { showToast } = useAuth();
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(invoice.paymentStatus === 'PAID');
  const [showUpiCheckout, setShowUpiCheckout] = useState(false);
  const isPaid = invoice.paymentStatus === 'PAID' || success;

  const handlePayNow = async () => {
    setPaying(true);
    try {
      const ref = `UPI-REF-${Date.now().toString().slice(-8)}`;
      await api.payInvoice(invoice.id, ref);
      setSuccess(true);
      setShowUpiCheckout(false);
      showToast(`Bill ${invoice.invoiceNumber} paid successfully via UPI! Reference: ${ref}`, 'success');
      if (onPaid) onPaid(ref);
    } catch (e) {
      showToast('Payment processing error', 'error');
    } finally {
      setPaying(false);
    }
  };

  const handlePrint = () => {
    showToast('Preparing statement for printer/PDF export...', 'info');
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-xs text-white">
              💧
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Smart Water Monthly Statement</h3>
              <p className="text-xs text-slate-400 font-mono">{invoice.invoiceNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
          {/* Status & Highlights */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-200/80 gap-3">
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Billing Cycle</div>
              <div className="font-bold text-slate-800 text-sm">{invoice.cycleName}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Due Date: <strong className="text-slate-800">{invoice.dueDate}</strong></div>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center space-x-1 ${
                isPaid
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-100 text-amber-700 border border-amber-200'
              }`}>
                {isPaid ? <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> : null}
                <span>{isPaid ? 'PAID & SETTLED' : 'PAYMENT DUE'}</span>
              </span>
              <div className="text-2xl font-extrabold font-mono text-blue-600 mt-1">₹{invoice.totalAmountDue?.toFixed(2)}</div>
            </div>
          </div>

          {/* UPI Checkout Simulator Popup */}
          {showUpiCheckout && !isPaid && (
            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                  <span className="font-bold text-slate-900 text-xs">Scan & Pay via UPI (GPay / PhonePe / Paytm)</span>
                </div>
                <span className="font-mono font-bold text-blue-700 text-sm">₹{invoice.totalAmountDue?.toFixed(2)}</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-blue-100">
                <div className="w-28 h-28 bg-slate-900 rounded-xl flex flex-col items-center justify-center text-white p-2 text-center shrink-0">
                  <QrCode className="w-16 h-16 text-cyan-400" />
                  <span className="text-[9px] font-mono text-cyan-200">UPI QR CODE</span>
                </div>
                <div className="space-y-1 text-slate-600 text-xs">
                  <div>VPA: <strong className="font-mono text-slate-800">society.water@okaxis</strong></div>
                  <div>Account: <span className="text-slate-800 font-semibold">Greenwoods Meadows RWA</span></div>
                  <p className="text-[11px] text-slate-400 pt-1">
                    Clicking "Confirm Instant Payment" below simulates real-time bank webhook settlement.
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowUpiCheckout(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 text-xs cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={handlePayNow}
                  disabled={paying}
                  className="px-5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition disabled:opacity-50 cursor-pointer"
                >
                  {paying ? 'Authorizing UPI...' : 'Confirm Instant Payment'}
                </button>
              </div>
            </div>
          )}

          {/* Breakdown Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Detailed Tariff Breakdown</h4>
            <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
              <div className="bg-slate-50 px-4 py-2.5 font-bold text-slate-500 grid grid-cols-12">
                <div className="col-span-6">Component / Tariff Description</div>
                <div className="col-span-3 text-right">Volume</div>
                <div className="col-span-3 text-right">Amount (₹)</div>
              </div>

              <div className="divide-y divide-slate-100">
                <div className="px-4 py-2.5 grid grid-cols-12 text-slate-700">
                  <div className="col-span-6 font-semibold">Base Water Supply Connection Fixed Charge</div>
                  <div className="col-span-3 text-right text-slate-400 font-mono">Monthly</div>
                  <div className="col-span-3 text-right font-mono font-bold text-slate-800">₹{invoice.baseFixedCharge?.toFixed(2)}</div>
                </div>

                <div className="px-4 py-2.5 grid grid-cols-12 text-slate-700 bg-blue-50/40">
                  <div className="col-span-6 font-semibold text-blue-700">Tiered Consumption Metered Charge</div>
                  <div className="col-span-3 text-right text-slate-500 font-mono">{invoice.totalConsumptionLiters?.toLocaleString()} L</div>
                  <div className="col-span-3 text-right font-mono font-bold text-blue-600">₹{invoice.tieredMeteredCharge?.toFixed(2)}</div>
                </div>

                <div className="px-4 py-2.5 grid grid-cols-12 text-slate-700">
                  <div className="col-span-6 font-semibold">Bulk Water Purchase & Common Area Apportionment</div>
                  <div className="col-span-3 text-right text-slate-400 font-mono">Sq.Ft Share</div>
                  <div className="col-span-3 text-right font-mono font-bold text-slate-800">₹{invoice.apportionedCommonAreaCharge?.toFixed(2)}</div>
                </div>

                <div className="px-4 py-2.5 grid grid-cols-12 text-slate-700">
                  <div className="col-span-6 font-semibold">Sewage & STP Infrastructure Maintenance (10%)</div>
                  <div className="col-span-3 text-right text-slate-400 font-mono">Statutory</div>
                  <div className="col-span-3 text-right font-mono font-bold text-slate-800">₹{invoice.sewageMaintenanceCharge?.toFixed(2)}</div>
                </div>

                <div className="px-4 py-3 grid grid-cols-12 text-sm font-extrabold bg-slate-50 text-slate-900 border-t border-slate-200">
                  <div className="col-span-6">Total Net Bill Payable</div>
                  <div className="col-span-6 text-right font-mono text-blue-600 text-base">₹{invoice.totalAmountDue?.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>

          {isPaid && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center space-x-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold">Payment Settled Successfully!</span> Transaction ID: <span className="font-mono font-bold">{invoice.paymentReference || 'UPI-REF-98210384'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 border border-slate-200 transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Invoice</span>
          </button>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 border border-slate-200 transition cursor-pointer"
            >
              Close
            </button>
            {!isPaid && !showUpiCheckout && (
              <button
                onClick={() => setShowUpiCheckout(true)}
                className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay via UPI / QR</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
