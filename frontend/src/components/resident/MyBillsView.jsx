import React, { useState } from 'react';
import { Receipt, CreditCard, Download, CheckCircle2, Clock, Eye, ShieldCheck, AlertCircle } from 'lucide-react';
import { InvoiceModal } from '../InvoiceModal';
import { useAuth } from '../../context/AuthContext';

export const MyBillsView = () => {
  const { showToast } = useAuth();
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const [invoices, setInvoices] = useState([
    {
      id: 2,
      invoiceNumber: 'INV-202608-A101',
      cycleName: 'August 2026 Cycle',
      totalConsumptionLiters: 13010,
      baseFixedCharge: 150.00,
      tieredMeteredCharge: 258.26,
      apportionedCommonAreaCharge: 192.40,
      sewageMaintenanceCharge: 25.83,
      totalAmountDue: 626.49,
      dueDate: '2026-09-10',
      paymentStatus: 'UNPAID',
      paymentDate: null,
      paymentReference: null
    },
    {
      id: 1,
      invoiceNumber: 'INV-202607-A101',
      cycleName: 'July 2026 Cycle',
      totalConsumptionLiters: 12800,
      baseFixedCharge: 150.00,
      tieredMeteredCharge: 252.80,
      apportionedCommonAreaCharge: 185.50,
      sewageMaintenanceCharge: 25.28,
      totalAmountDue: 613.58,
      dueDate: '2026-08-10',
      paymentStatus: 'PAID',
      paymentDate: '2026-08-08 11:24',
      paymentReference: 'UPI-REF-98726152019'
    }
  ]);

  const handleOpenInvoice = (inv) => {
    setSelectedInvoice(inv);
    setIsInvoiceOpen(true);
  };

  const handlePaid = (ref) => {
    setInvoices(invoices.map(i => i.id === selectedInvoice.id ? { ...i, paymentStatus: 'PAID', paymentReference: ref, paymentDate: new Date().toLocaleString() } : i));
    showToast(`Invoice ${selectedInvoice.invoiceNumber} marked PAID! Reference: ${ref}`, 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
          My Invoices & Payment Ledger
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Monthly itemized tiered water bills, common area tanker apportionments, and digital UPI receipts.
        </p>
      </div>

      {/* Unpaid Bill Alert Banner */}
      {invoices.some(i => i.paymentStatus === 'UNPAID') && (
        <div className="p-6 rounded-3xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
              ₹
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-slate-900 text-sm">August 2026 Water Bill is Ready</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">
                  DUE SEPT 10, 2026
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Total consumption: <strong>13,010 Liters</strong>. Includes Tier 1 base, Tier 2 excess, and tanker share.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 self-end sm:self-auto">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Total Payable</div>
              <div className="text-xl font-extrabold font-mono text-blue-600">₹626.49</div>
            </div>
            <button
              onClick={() => handleOpenInvoice(invoices[0])}
              className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center space-x-1.5 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pay with UPI</span>
            </button>
          </div>
        </div>
      )}

      {/* History Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-800">Billing History Ledger</h3>
          <span className="text-xs text-slate-400 font-mono">Flat A-101</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
              <tr>
                <th className="px-5 py-3.5">Invoice #</th>
                <th className="px-5 py-3.5">Cycle Name</th>
                <th className="px-5 py-3.5 text-right">Consumption</th>
                <th className="px-5 py-3.5 text-right">Metered Charge</th>
                <th className="px-5 py-3.5 text-right">Shared Tanker</th>
                <th className="px-5 py-3.5 text-right">Total Amount</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-5 py-3.5 font-bold font-mono text-slate-800">
                    {inv.invoiceNumber}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-slate-800">
                    {inv.cycleName}
                    <div className="text-[11px] text-slate-400">Due: {inv.dueDate}</div>
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono text-slate-800">
                    {inv.totalConsumptionLiters.toLocaleString()} L
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono text-slate-600">
                    ₹{inv.tieredMeteredCharge.toFixed(2)}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono text-slate-600">
                    ₹{inv.apportionedCommonAreaCharge.toFixed(2)}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono text-blue-600 font-extrabold text-sm">
                    ₹{inv.totalAmountDue.toFixed(2)}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      inv.paymentStatus === 'PAID'
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : 'bg-amber-50 text-amber-600 border border-amber-200'
                    }`}>
                      {inv.paymentStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <button
                      onClick={() => handleOpenInvoice(inv)}
                      className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 font-semibold text-slate-700 transition cursor-pointer flex items-center space-x-1 mx-auto"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{inv.paymentStatus === 'PAID' ? 'Receipt' : 'Pay / View'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <InvoiceModal
        invoice={selectedInvoice}
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        onPaid={handlePaid}
      />
    </div>
  );
};
