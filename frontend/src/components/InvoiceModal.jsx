import React, { useState } from 'react';
import { X, CheckCircle2, Download, Printer, ShieldCheck, Droplets, Calendar, CreditCard } from 'lucide-react';
import { api } from '../services/api';

export const InvoiceModal = ({ invoice, isOpen, onClose, onPaid }) => {
  if (!isOpen || !invoice) return null;

  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);
  const isPaid = invoice.paymentStatus === 'PAID';

  const handlePayNow = async () => {
    setPaying(true);
    try {
      const ref = `UPI-TXN-${Date.now().toString().slice(-8)}`;
      await api.payInvoice(invoice.id, ref);
      setSuccess(true);
      if (onPaid) onPaid(ref);
    } catch (e) {
      alert('Payment failed');
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">WaterGuard Official Bill</h3>
              <p className="text-xs text-slate-400 font-mono">{invoice.invoiceNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Status & Highlights */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800 gap-3">
            <div>
              <div className="text-xs text-slate-400">Billing Cycle</div>
              <div className="font-bold text-slate-200 text-sm">{invoice.cycleName}</div>
              <div className="text-xs text-slate-500 mt-0.5">Due Date: {invoice.dueDate}</div>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center space-x-1 ${
                isPaid || success
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {(isPaid || success) ? <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> : null}
                <span>{(isPaid || success) ? 'PAID & SETTLED' : 'PAYMENT DUE'}</span>
              </span>
              <div className="text-2xl font-bold font-mono text-white mt-1">₹{invoice.totalAmountDue?.toFixed(2)}</div>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Detailed Tariff Breakdown</h4>
            <div className="border border-slate-800 rounded-xl overflow-hidden text-xs">
              <div className="bg-slate-950 px-4 py-2.5 font-semibold text-slate-400 grid grid-cols-12">
                <div className="col-span-6">Component / Tier Description</div>
                <div className="col-span-3 text-right">Volume</div>
                <div className="col-span-3 text-right">Amount (₹)</div>
              </div>

              <div className="divide-y divide-slate-800/60 bg-slate-900/40">
                <div className="px-4 py-2.5 grid grid-cols-12 text-slate-300">
                  <div className="col-span-6 font-medium">Base Water Supply Connection Fixed Charge</div>
                  <div className="col-span-3 text-right text-slate-500 font-mono">Monthly</div>
                  <div className="col-span-3 text-right font-mono font-semibold">₹{invoice.baseFixedCharge?.toFixed(2)}</div>
                </div>

                <div className="px-4 py-2.5 grid grid-cols-12 text-slate-300 bg-cyan-950/20">
                  <div className="col-span-6 font-medium text-cyan-300">Tiered Consumption Metered Charge</div>
                  <div className="col-span-3 text-right text-slate-400 font-mono">{invoice.totalConsumptionLiters?.toLocaleString()} L</div>
                  <div className="col-span-3 text-right font-mono font-semibold text-cyan-400">₹{invoice.tieredMeteredCharge?.toFixed(2)}</div>
                </div>

                <div className="px-4 py-2.5 grid grid-cols-12 text-slate-300">
                  <div className="col-span-6 font-medium">Bulk Purchase & Common Area Apportionment</div>
                  <div className="col-span-3 text-right text-slate-500 font-mono">Sq.Ft Share</div>
                  <div className="col-span-3 text-right font-mono font-semibold">₹{invoice.apportionedCommonAreaCharge?.toFixed(2)}</div>
                </div>

                <div className="px-4 py-2.5 grid grid-cols-12 text-slate-300">
                  <div className="col-span-6 font-medium">Sewage & STP Infrastructure Surcharge (10%)</div>
                  <div className="col-span-3 text-right text-slate-500 font-mono">Statutory</div>
                  <div className="col-span-3 text-right font-mono font-semibold">₹{invoice.sewageMaintenanceCharge?.toFixed(2)}</div>
                </div>

                <div className="px-4 py-3 grid grid-cols-12 text-sm font-bold bg-slate-950 text-white">
                  <div className="col-span-6">Total Net Bill Payable</div>
                  <div className="col-span-6 text-right font-mono text-cyan-400 text-base">₹{invoice.totalAmountDue?.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>

          {(isPaid || success) && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-semibold">Payment Completed Successfully!</span> Reference: <span className="font-mono">{invoice.paymentReference || 'UPI-REF-AUTO-982103'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Invoice</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
            >
              Close
            </button>
            {(!isPaid && !success) && (
              <button
                onClick={handlePayNow}
                disabled={paying}
                className="flex items-center space-x-2 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 transition disabled:opacity-50"
              >
                <CreditCard className="w-4 h-4" />
                <span>{paying ? 'Processing...' : 'Pay with UPI / Card'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

