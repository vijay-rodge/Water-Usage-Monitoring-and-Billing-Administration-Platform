const API_BASE = '/api';

let mockState = {
  currentUser: {
    userId: 2,
    email: 'rahul.sharma@waterguard.io',
    fullName: 'Rahul Sharma',
    role: 'ROLE_RESIDENT',
    apartmentId: 1,
    apartmentName: 'Greenwoods Meadows Luxury Residency',
    householdId: 1,
    flatNo: 'A-101'
  },
  apartment: {
    id: 1,
    name: 'Greenwoods Meadows Luxury Residency',
    code: 'GWM-BLR-01',
    address: 'Plot 42, Sarjapur Outer Ring Road, Bellandur',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560103',
    totalFlats: 48,
    commonAreaSqft: 18500.00
  },
  tariffPlan: {
    id: 1,
    planName: 'Urban Residential Progressive Water Tariff 2026',
    baseFixedCharge: 150.00,
    sewageMaintenancePct: 10.00,
    bulkPurchaseMarkupPct: 5.00,
    tiers: [
      { tierLevel: 1, tierName: 'Tier 1 - Essential Base (0-8k L)', minLiters: 0, maxLiters: 8000, ratePer1000Liters: 16.00 },
      { tierLevel: 2, tierName: 'Tier 2 - Standard Living (8k-15k L)', minLiters: 8001, maxLiters: 15000, ratePer1000Liters: 26.00 },
      { tierLevel: 3, tierName: 'Tier 3 - Elevated Use (15k-25k L)', minLiters: 15001, maxLiters: 25000, ratePer1000Liters: 42.00 },
      { tierLevel: 4, tierName: 'Tier 4 - Penalty Rate (>25k L)', minLiters: 25001, maxLiters: null, ratePer1000Liters: 75.00 }
    ]
  },
  residentDashboard: {
    householdId: 1,
    flatNo: 'A-101',
    blockWing: 'Wing A',
    residentName: 'Rahul Sharma',
    carpetAreaSqft: 1650,
    occupancyCount: 4,
    meterSerialNo: 'WM-SN-A101-2024',
    currentMonthConsumptionLiters: 13010,
    previousMonthConsumptionLiters: 12800,
    dailyAverageLiters: 464,
    estimatedCurrentBillAmount: 626.49,
    currentTierName: 'Tier 2 - Standard Living',
    currentTierProgressPct: 71.5,
    activeAnomalyAlertsCount: 1,
    waterEfficiencyScore: 84,
    dailyTrends: [
      { date: 'Aug 14', liters: 480, isAnomaly: false },
      { date: 'Aug 15', liters: 530, isAnomaly: false },
      { date: 'Aug 16', liters: 440, isAnomaly: false },
      { date: 'Aug 17', liters: 420, isAnomaly: false },
      { date: 'Aug 18', liters: 420, isAnomaly: false },
      { date: 'Aug 19', liters: 450, isAnomaly: false },
      { date: 'Aug 20', liters: 420, isAnomaly: false },
      { date: 'Aug 21', liters: 440, isAnomaly: false },
      { date: 'Aug 22', liters: 470, isAnomaly: false },
      { date: 'Aug 23', liters: 430, isAnomaly: false },
      { date: 'Aug 24', liters: 950, isAnomaly: true, anomalyReason: 'Continuous 2am-5am trickle - Flush valve leak' },
      { date: 'Aug 25', liters: 1120, isAnomaly: true, anomalyReason: 'High night-time baseline leakage confirmed' },
      { date: 'Aug 26', liters: 490, isAnomaly: false, remarks: 'Repaired by maintenance' },
      { date: 'Aug 27', liters: 410, isAnomaly: false },
      { date: 'Aug 28', liters: 430, isAnomaly: false }
    ],
    estimatedTierBreakdown: [
      { tierLevel: 1, tierName: 'Tier 1 - Essential Base (0-8k L)', consumedLiters: 8000, ratePer1000Liters: 16.00, cost: 128.00 },
      { tierLevel: 2, tierName: 'Tier 2 - Standard Living (8k-15k L)', consumedLiters: 5010, ratePer1000Liters: 26.00, cost: 130.26 }
    ],
    latestInvoice: {
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
    invoicesHistory: [
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
    ],
    recentAlerts: [
      {
        id: 1,
        title: 'Severe Water Leakage Suspected',
        message: 'Continuous night-time water flow detected on Aug 24-25 totaling 2,070 Liters. Maintenance replaced valve.',
        alertType: 'LEAK_DETECTED',
        severity: 'CRITICAL',
        isRead: false,
        isResolved: true,
        createdAt: '2026-08-25 07:30'
      },
      {
        id: 2,
        title: 'Approaching Tier 2 Threshold',
        message: 'Your monthly consumption has reached 12,500 Liters (83% of standard bracket).',
        alertType: 'USAGE_SPIKE',
        severity: 'MEDIUM',
        isRead: true,
        isResolved: false,
        createdAt: '2026-08-26 18:00'
      }
    ]
  },
  adminDashboard: {
    apartmentId: 1,
    apartmentName: 'Greenwoods Meadows Luxury Residency',
    totalHouseholds: 48,
    activeHouseholds: 46,
    totalCommunityConsumptionLiters: 512400,
    totalBulkWaterPurchasedLiters: 60000,
    totalBilledAmount: 56320.00,
    totalCollectedAmount: 39450.00,
    pendingCollectionAmount: 16870.00,
    unresolvedAnomaliesCount: 2,
    bulkPurchases: [
      { id: 1, purchaseDate: '2026-08-04', supplierName: 'Kavery Clean Water Tankers Ltd', capacityLiters: 24000, cost: 3600.00, method: 'BY_FLAT_SIZE' },
      { id: 2, purchaseDate: '2026-08-12', supplierName: 'AquaPure Express Tankers', capacityLiters: 12000, cost: 1950.00, method: 'BY_FLAT_SIZE' },
      { id: 3, purchaseDate: '2026-08-21', supplierName: 'Kavery Clean Water Tankers Ltd', capacityLiters: 24000, cost: 3600.00, method: 'BY_FLAT_SIZE' }
    ],
    communityDailyTrends: [
      { date: 'Aug 14', liters: 16400, isAnomaly: false },
      { date: 'Aug 15', liters: 18200, isAnomaly: false },
      { date: 'Aug 16', liters: 15900, isAnomaly: false },
      { date: 'Aug 17', liters: 16100, isAnomaly: false },
      { date: 'Aug 18', liters: 16300, isAnomaly: false },
      { date: 'Aug 19', liters: 17000, isAnomaly: false },
      { date: 'Aug 20', liters: 16500, isAnomaly: false },
      { date: 'Aug 21', liters: 16800, isAnomaly: false },
      { date: 'Aug 22', liters: 17400, isAnomaly: false },
      { date: 'Aug 23', liters: 16200, isAnomaly: false },
      { date: 'Aug 24', liters: 18900, isAnomaly: true },
      { date: 'Aug 25', liters: 19400, isAnomaly: true },
      { date: 'Aug 26', liters: 17100, isAnomaly: false },
      { date: 'Aug 27', liters: 16600, isAnomaly: false },
      { date: 'Aug 28', liters: 16900, isAnomaly: false }
    ],
    topConsumingHouseholds: [
      { householdId: 8, flatNo: 'C-402', ownerName: 'Meera Deshmukh', bhk: 'Penthouse', carpetArea: 3100, monthlyConsumptionLiters: 28400, estimatedCost: 1420.00, hasAnomaly: false },
      { householdId: 6, flatNo: 'B-301', ownerName: 'Arjun Reddy', bhk: '4BHK', carpetArea: 2300, monthlyConsumptionLiters: 21900, estimatedCost: 1045.00, hasAnomaly: false },
      { householdId: 5, flatNo: 'B-202', ownerName: 'Priya Nair', bhk: '3BHK', carpetArea: 1700, monthlyConsumptionLiters: 14800, estimatedCost: 683.48, hasAnomaly: false },
      { householdId: 1, flatNo: 'A-101', ownerName: 'Rahul Sharma', bhk: '3BHK', carpetArea: 1650, monthlyConsumptionLiters: 13010, estimatedCost: 626.49, hasAnomaly: true },
      { householdId: 3, flatNo: 'A-201', ownerName: 'Suresh Iyer', bhk: '3BHK', carpetArea: 1650, monthlyConsumptionLiters: 12400, estimatedCost: 598.00, hasAnomaly: false },
      { householdId: 2, flatNo: 'A-102', ownerName: 'Ananya Sen', bhk: '2BHK', carpetArea: 1200, monthlyConsumptionLiters: 10200, estimatedCost: 512.00, hasAnomaly: false },
      { householdId: 4, flatNo: 'B-101', ownerName: 'Deepak Verma', bhk: '2BHK', carpetArea: 1150, monthlyConsumptionLiters: 9400, estimatedCost: 480.00, hasAnomaly: false },
      { householdId: 7, flatNo: 'C-101', ownerName: 'Vikram Patel', bhk: '1BHK', carpetArea: 750, monthlyConsumptionLiters: 5800, estimatedCost: 242.80, hasAnomaly: false }
    ],
    criticalAlerts: [
      {
        id: 1,
        title: 'Severe Leak Flagged - Flat A-101',
        message: 'Continuous night flow detected on Aug 24-25. Replaced flush valve.',
        alertType: 'LEAK_DETECTED',
        severity: 'CRITICAL',
        isRead: false,
        isResolved: true,
        createdAt: '2026-08-25 07:30'
      }
    ]
  }
};

export const api = {
  login: async (emailOrObj, maybePassword) => {
    let email = emailOrObj;
    let password = maybePassword;
    if (typeof emailOrObj === 'object' && emailOrObj !== null) {
      email = emailOrObj.email;
      password = emailOrObj.password;
    }
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.token) localStorage.setItem('wg_token', data.token);
        return data;
      }
    } catch (e) {}

    if (email === 'admin@waterguard.io') {
      const user = {
        token: 'mock-jwt-admin-token-xyz',
        userId: 1,
        email: 'admin@waterguard.io',
        fullName: 'Dr. Arvind Mehra (Society Secretary)',
        role: 'ROLE_ADMIN',
        apartmentId: 1,
        apartmentName: 'Greenwoods Meadows Luxury Residency',
        householdId: null,
        flatNo: null
      };
      mockState.currentUser = user;
      return user;
    } else {
      const user = {
        token: 'mock-jwt-resident-token-abc',
        userId: 2,
        email: email || 'rahul.sharma@waterguard.io',
        fullName: 'Rahul Sharma',
        role: 'ROLE_RESIDENT',
        apartmentId: 1,
        apartmentName: 'Greenwoods Meadows Luxury Residency',
        householdId: 1,
        flatNo: 'A-101'
      };
      mockState.currentUser = user;
      return user;
    }
  },

  getCurrentUser: () => mockState.currentUser,

  getResidentDashboard: async (householdId = 1) => {
    try {
      const token = localStorage.getItem('wg_token');
      const res = await fetch(`${API_BASE}/dashboard/resident/${householdId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return mockState.residentDashboard;
  },

  getAdminDashboard: async (apartmentId = 1) => {
    try {
      const token = localStorage.getItem('wg_token');
      const res = await fetch(`${API_BASE}/dashboard/admin/${apartmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return mockState.adminDashboard;
  },

  submitManualReading: async (householdId, readingDate, currentReadingLiters, remarks) => {
    const consumption = 430;
    mockState.residentDashboard.dailyTrends.push({
      date: 'Aug 29',
      liters: consumption,
      isAnomaly: false,
      remarks: remarks || 'Manual entry'
    });
    mockState.residentDashboard.currentMonthConsumptionLiters += consumption;

    return {
      success: true,
      message: 'Meter reading recorded successfully',
      consumptionLiters: consumption
    };
  },

  processCsvUpload: async (fileContent, apartmentId = 1) => {
    const rows = [
      { flatNo: 'A-101', meterSerialNo: 'WM-SN-A101-2024', readingDate: '2026-08-28', currentReadingLiters: 137510, dailyConsumptionLiters: 410, isAnomaly: false, isValid: true },
      { flatNo: 'A-102', meterSerialNo: 'WM-SN-A102-2024', readingDate: '2026-08-28', currentReadingLiters: 98620, dailyConsumptionLiters: 420, isAnomaly: false, isValid: true },
      { flatNo: 'B-101', meterSerialNo: 'WM-SN-B101-2024', readingDate: '2026-08-28', currentReadingLiters: 85850, dailyConsumptionLiters: 450, isAnomaly: false, isValid: true },
      { flatNo: 'B-202', meterSerialNo: 'WM-SN-B202-2024', readingDate: '2026-08-28', currentReadingLiters: 157770, dailyConsumptionLiters: 480, isAnomaly: false, isValid: true },
      { flatNo: 'C-402', meterSerialNo: 'WM-SN-C402-2024', readingDate: '2026-08-28', currentReadingLiters: 322400, dailyConsumptionLiters: 2300, isAnomaly: true, anomalyReason: 'Unusual spike >2.5x baseline', isValid: true }
    ];

    return {
      totalProcessed: 5,
      successCount: 5,
      errorCount: 0,
      anomaliesDetected: 1,
      rows: rows
    };
  },

  getTariffPlan: async (apartmentId = 1) => {
    return mockState.tariffPlan;
  },

  calculateTariffPreview: (liters, plan = mockState.tariffPlan, commonCost = 192.40) => {
    let remaining = Number(liters) || 0;
    let totalMetered = 0;
    const breakdown = [];

    for (const tier of plan.tiers) {
      if (remaining <= 0) break;
      const cap = tier.maxLiters ? (tier.maxLiters - tier.minLiters + 1) : remaining;
      const consumed = Math.min(remaining, cap);
      if (consumed > 0) {
        const cost = (consumed / 1000) * tier.ratePer1000Liters;
        totalMetered += cost;
        breakdown.push({
          tierLevel: tier.tierLevel,
          tierName: tier.tierName,
          consumedLiters: consumed,
          ratePer1000Liters: tier.ratePer1000Liters,
          cost: parseFloat(cost.toFixed(2))
        });
        remaining -= consumed;
      }
    }

    const baseFixed = plan.baseFixedCharge;
    const sewage = parseFloat(((totalMetered * plan.sewageMaintenancePct) / 100).toFixed(2));
    const total = parseFloat((baseFixed + totalMetered + sewage + commonCost).toFixed(2));

    return {
      totalConsumptionLiters: liters,
      baseFixedCharge: baseFixed,
      tieredMeteredCharge: parseFloat(totalMetered.toFixed(2)),
      sewageMaintenanceCharge: sewage,
      apportionedCommonAreaCharge: commonCost,
      totalPayable: total,
      tierBreakdown: breakdown
    };
  },

  payInvoice: async (invoiceId, paymentRef = `UPI-${Date.now()}`) => {
    if (mockState.residentDashboard.latestInvoice && mockState.residentDashboard.latestInvoice.id === invoiceId) {
      mockState.residentDashboard.latestInvoice.paymentStatus = 'PAID';
      mockState.residentDashboard.latestInvoice.paymentDate = new Date().toLocaleString();
      mockState.residentDashboard.latestInvoice.paymentReference = paymentRef;
    }
    const inv = mockState.residentDashboard.invoicesHistory.find(i => i.id === invoiceId);
    if (inv) {
      inv.paymentStatus = 'PAID';
      inv.paymentDate = new Date().toLocaleString();
      inv.paymentReference = paymentRef;
    }
    return { success: true, paymentReference: paymentRef };
  },

  resolveAlert: async (alertId) => {
    const alert = mockState.residentDashboard.recentAlerts.find(a => a.id === alertId);
    if (alert) alert.isResolved = true;
    return { success: true };
  }
};

