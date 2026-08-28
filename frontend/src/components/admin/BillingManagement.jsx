import React, { useState } from 'react';
import { Receipt, Plus, CheckCircle2, Download, Calendar, ArrowRight, CreditCard } from 'lucide-react';
import { InvoiceModal } from '../InvoiceModal';

export const BillingManagement = () => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [cycleGenerating, setCycleGenerating] = useState(false);
  const [cycleSuccess, setCycleSuccess] = useState(false);

  const invoices = [
    { id: 2, invoiceNumber: 'INV-202608-A101', flatNo: 'A-101', owner: 'Rahul Sharma', cycleName: 'August 2026 Cycle', totalConsumptionLiters: 13010, baseFixedCharge: 150.00, tieredMeteredCharge: 258.26, apportionedCommonAreaCharge: 192.40, sewageMaintenanceCharge: 25.83, totalAmountDue: 626.49, dueDate: '2026-09-10', paymentStatus: 'UNPAID' },
    { id: 3, invoiceNumber: 'INV-202608-A102', flatNo: 'A-102', owner: 'Ananya Sen', cycleName: 'August 2026 Cycle', totalConsumptionLiters: 10200, baseFixedCharge: 150.00, tieredMeteredCharge: 185.20, apportionedCommonAreaCharge: 140.00, sewageMaintenanceCharge: 18.52, totalAmountDue: 493.72, dueDate: '2026-09-10', paymentStatus: 'PAID', paymentDate: '2026-08-27', paymentReference: 'UPI-98217361' },
    { id: 4, invoiceNumber: 'INV-202608-B202', flatNo: 'B-202', owner: 'Priya Nair', cycleName: 'August 2026 Cycle', totalConsumptionLiters: 14800, baseFixedCharge: 150.00, tieredMeteredCharge: 304.80, apportionedCommonAreaCharge: 198.20, sewageMaintenanceCharge: 30.48, totalAmountDue: 683.48, dueDate: '2026-09-10', paymentStatus: 'UNPAID' },
    { id: 5, invoiceNumber: 'INV-202608-C402', flatNo: 'C-402', owner: 'Meera Deshmukh', cycleName: 'August 2026 Cycle', totalConsumptionLiters: 28400, baseFixedCharge: 150.00, tieredMeteredCharge: 885.00, apportionedCommonAreaCharge: 361.60, sewageMaintenanceCharge: 88.50, totalAmountDue: 1485.10, dueDate: '2026-09-10', paymentStatus: 'PAID', paymentDate: '2026-08-28', paymentReference: 'NEFT-889123' },
  ];

  const handleGenerateCycle = () => {
    setCycleGenerating(true);
    setTimeout(() => {
      setCycleGenerating(false);
      setCycleSuccess(true);
      setTimeout(() => setCycleSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            Billing Management & Cycle Finalization
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Generate monthly tiered consumption statements, apportion common area tanker costs, and track payments.
          </p>
        </div>

        <button
          onClick={handleGenerateCycle}
          disabled={cycleGenerating}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition disabled:opacity-50"
        >
          <Receipt className="w-4 h-4" />
          <span>{cycleGenerating ? 'Running Tariff Billing Engine...' : 'Run August 2026 Billing Engine'}</span>
        </button>
      </div>

      {cycleSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>August 2026 Billing Cycle successfully generated for all 48 households. Invoices generated with itemized tier breakdowns!</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total August Billed</div>
          <div className="text-2xl font-extrabold font-mono text-slate-900 mt-1">₹56,320.00</div>
          <div className="text-[11px] text-slate-400 mt-0.5">48 itemized flat statements</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Settled / Collected</div>
          <div className="text-2xl font-extrabold font-mono text-emerald-600 mt-1">₹39,450.00</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">70% collection rate</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Pending Due</div>
          <div className="text-2xl font-extrabold font-mono text-amber-600 mt-1">₹16,870.00</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Due Date: 10 Sep 2026</div>
        </div>
      </div>

      {/* Invoice Ledger Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-800">Generated Statements Ledger</h3>
          <span className="text-xs text-slate-400">Showing 4 of 48 Flats</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
              <tr>
                <th className="px-5 py-3.5">Invoice #</th>
                <th className="px-5 py-3.5">Flat & Resident</th>
                <th className="px-5 py-3.5 font-mono text-right">Volume (L)</th>
                <th className="px-5 py-3.5 font-mono text-right">Metered (₹)</th>
                <th className="px-5 py-3.5 font-mono text-right">Apportioned (₹)</th>
                <th className="px-5 py-3.5 font-mono text-right">Total Net (₹)</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-5 py-3.5 font-mono font-bold text-blue-600">{inv.invoiceNumber}</td>
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-slate-900">Flat {inv.flatNo}</div>
                    <div className="text-[11px] text-slate-400">{inv.owner}</div>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-right">{inv.totalConsumptionLiters.toLocaleString()} L</td>
                  <td className="px-5 py-3.5 font-mono text-right">₹{inv.tieredMeteredCharge.toFixed(2)}</td>
                  <td className="px-5 py-3.5 font-mono text-right">₹{inv.apportionedCommonAreaCharge.toFixed(2)}</td>
                  <td className="px-5 py-3.5 font-mono text-right font-extrabold text-slate-900">
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
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="px-3 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-lg font-semibold text-slate-700 transition text-[11px]"
                    >
                      View Bill
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
        isOpen={Boolean(selectedInvoice)}
        onClose={() => setSelectedInvoice(null)}
      />
    </div>
  );
};

