import React, { useState } from 'react';
import { Receipt, Download, CreditCard, CheckCircle2, Calendar, FileText } from 'lucide-react';
import { InvoiceModal } from '../InvoiceModal';

export const MyBillsView = () => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const bills = [
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
      paymentStatus: 'UNPAID'
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
      paymentDate: '2026-08-08 11:24:00',
      paymentReference: 'UPI-REF-98726152019'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
          My Water Statements & Payments
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review itemized tiered charges, common area tanker allocations, and settle bills online.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bills.map((b) => (
          <div key={b.id} className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono font-bold text-blue-600 text-xs">{b.invoiceNumber}</span>
                <h3 className="font-bold text-base text-slate-900 mt-0.5">{b.cycleName}</h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                b.paymentStatus === 'PAID'
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  : 'bg-amber-50 text-amber-600 border border-amber-200'
              }`}>
                {b.paymentStatus === 'PAID' ? '✓ PAID & SETTLED' : 'PAYMENT DUE'}
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl space-y-2 text-xs divide-y divide-slate-200/60">
              <div className="flex justify-between text-slate-600">
                <span>Metered Water Drawn:</span>
                <span className="font-mono font-bold text-slate-900">{b.totalConsumptionLiters.toLocaleString()} L</span>
              </div>
              <div className="pt-2 flex justify-between text-slate-600">
                <span>Tiered Consumption Charge:</span>
                <span className="font-mono font-medium text-slate-900">₹{b.tieredMeteredCharge.toFixed(2)}</span>
              </div>
              <div className="pt-2 flex justify-between text-slate-600">
                <span>Common Area Tanker Share:</span>
                <span className="font-mono font-medium text-slate-900">₹{b.apportionedCommonAreaCharge.toFixed(2)}</span>
              </div>
              <div className="pt-2 flex justify-between font-bold text-slate-900 text-sm">
                <span>Total Amount Due:</span>
                <span className="font-mono text-blue-600 text-base">₹{b.totalAmountDue.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-400 font-mono">Due: {b.dueDate}</span>
              <button
                onClick={() => setSelectedInvoice(b)}
                className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-xs transition"
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>{b.paymentStatus === 'PAID' ? 'View Bill Receipt' : 'Pay Statement'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <InvoiceModal
        invoice={selectedInvoice}
        isOpen={Boolean(selectedInvoice)}
        onClose={() => setSelectedInvoice(null)}
      />
    </div>
  );
};

