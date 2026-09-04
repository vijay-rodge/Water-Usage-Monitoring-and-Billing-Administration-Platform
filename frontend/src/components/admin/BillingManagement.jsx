import React, { useState } from 'react';
import { Receipt, Play, CheckCircle2, Download, Eye, Layers, Clock, AlertCircle } from 'lucide-react';
import { InvoiceModal } from '../InvoiceModal';
import { useAuth } from '../../context/AuthContext';

export const BillingManagement = () => {
  const { showToast } = useAuth();
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const [invoices, setInvoices] = useState([
    { id: 2, householdId: 1, invoiceNumber: 'INV-202608-A101', flatNo: 'A-101', owner: 'Rahul Sharma', cycleName: 'August 2026 Cycle', totalConsumptionLiters: 13010, baseFixedCharge: 150.00, tieredMeteredCharge: 258.26, apportionedCommonAreaCharge: 192.40, sewageMaintenanceCharge: 25.83, totalAmountDue: 626.49, dueDate: '2026-09-10', paymentStatus: 'UNPAID' },
    { id: 3, householdId: 2, invoiceNumber: 'INV-202608-A102', flatNo: 'A-102', owner: 'Ananya Sen', cycleName: 'August 2026 Cycle', totalConsumptionLiters: 10200, baseFixedCharge: 150.00, tieredMeteredCharge: 185.20, apportionedCommonAreaCharge: 139.90, sewageMaintenanceCharge: 18.52, totalAmountDue: 493.62, dueDate: '2026-09-10', paymentStatus: 'PAID', paymentReference: 'UPI-TXN-882104' },
    { id: 4, householdId: 5, invoiceNumber: 'INV-202608-B202', flatNo: 'B-202', owner: 'Priya Nair', cycleName: 'August 2026 Cycle', totalConsumptionLiters: 14800, baseFixedCharge: 150.00, tieredMeteredCharge: 304.80, apportionedCommonAreaCharge: 198.20, sewageMaintenanceCharge: 30.48, totalAmountDue: 683.48, dueDate: '2026-09-10', paymentStatus: 'UNPAID' },
    { id: 5, householdId: 8, invoiceNumber: 'INV-202608-C402', flatNo: 'C-402', owner: 'Meera Deshmukh', cycleName: 'August 2026 Cycle', totalConsumptionLiters: 28400, baseFixedCharge: 150.00, tieredMeteredCharge: 885.00, apportionedCommonAreaCharge: 361.60, sewageMaintenanceCharge: 88.50, totalAmountDue: 1485.10, dueDate: '2026-09-10', paymentStatus: 'UNPAID' },
  ]);

  const handleRunBillingEngine = () => {
    setRunning(true);
    setProgress(15);
    showToast('Starting Society-Wide Billing Calculation Engine...', 'info');

    setTimeout(() => setProgress(45), 400);
    setTimeout(() => setProgress(75), 800);
    setTimeout(() => {
      setProgress(100);
      setRunning(false);
      showToast('Billing cycle generated! 48 household statements calculated and ready for distribution.', 'success');
    }, 1200);
  };

  const handleInspect = (inv) => {
    setSelectedInvoice(inv);
    setIsInvoiceOpen(true);
  };

  const handleExportBatch = () => {
    showToast('Exporting 48 society invoices as billing_batch_aug2026.csv...', 'info');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            Billing Management & Generation
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Automated tariff execution engine, late fee calculations, and ledger dispatch.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleExportBatch}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 shadow-xs transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleRunBillingEngine}
            disabled={running}
            className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition disabled:opacity-50 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{running ? `Executing (${progress}%)` : 'Run August 2026 Billing Engine'}</span>
          </button>
        </div>
      </div>

      {running && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between text-xs font-bold text-blue-800">
            <span>Executing Tiered Apportionment Engine across 48 units...</span>
            <span className="font-mono">{progress}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
            <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}

      {/* Cycle Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs">
          <div className="text-xs text-slate-400 font-medium">Cycle Status</div>
          <div className="text-base font-bold text-slate-900 mt-1 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>August 2026 (Active)</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Due: Sept 10, 2026</div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs">
          <div className="text-xs text-slate-400 font-medium">Total Billed</div>
          <div className="text-base font-bold text-blue-600 font-mono mt-1">₹56,320.00</div>
          <div className="text-[11px] text-slate-400 mt-0.5">48 households</div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs">
          <div className="text-xs text-slate-400 font-medium">Total Collected</div>
          <div className="text-base font-bold text-emerald-600 font-mono mt-1">₹39,450.00</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">70.0% Collection Rate</div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-3xl shadow-xs">
          <div className="text-xs text-slate-400 font-medium">Pending Dues</div>
          <div className="text-base font-bold text-amber-600 font-mono mt-1">₹16,870.00</div>
          <div className="text-[11px] text-slate-400 mt-0.5">14 unpaid flats</div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-800">Generated Statements Ledger</h3>
          <span className="text-xs text-slate-400 font-mono">{invoices.length} invoices displayed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
              <tr>
                <th className="px-5 py-3.5">Invoice #</th>
                <th className="px-5 py-3.5">Flat & Resident</th>
                <th className="px-5 py-3.5 text-right">Consumption</th>
                <th className="px-5 py-3.5 text-right">Fixed</th>
                <th className="px-5 py-3.5 text-right">Metered</th>
                <th className="px-5 py-3.5 text-right">Total Due</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-5 py-3.5 font-bold font-mono text-slate-800">
                    {inv.invoiceNumber}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-bold text-slate-900">Flat {inv.flatNo}</span>
                    <div className="text-[11px] text-slate-400">{inv.owner}</div>
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono text-slate-800">
                    {inv.totalConsumptionLiters.toLocaleString()} L
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono text-slate-600">
                    ₹{inv.baseFixedCharge.toFixed(2)}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono text-blue-600 font-semibold">
                    ₹{inv.tieredMeteredCharge.toFixed(2)}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono text-slate-900 font-extrabold text-sm">
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
                      onClick={() => handleInspect(inv)}
                      className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 font-semibold text-slate-700 transition cursor-pointer flex items-center space-x-1 mx-auto"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
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
        onPaid={(ref) => {
          setInvoices(invoices.map(i => i.id === selectedInvoice.id ? { ...i, paymentStatus: 'PAID', paymentReference: ref } : i));
        }}
      />
    </div>
  );
};
