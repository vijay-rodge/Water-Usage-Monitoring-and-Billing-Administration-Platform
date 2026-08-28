import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { FloatingAssistant } from './components/layout/FloatingAssistant';

// Admin Views
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { HouseholdsDirectory } from './components/admin/HouseholdsDirectory';
import { MeterReadingsView } from './components/admin/MeterReadingsView';
import { BillingManagement } from './components/admin/BillingManagement';
import { BulkPurchasesView } from './components/admin/BulkPurchasesView';
import { AdminReportsView } from './components/admin/AdminReportsView';
import { LeakageRadarView } from './components/admin/LeakageRadarView';
import { AdminSupportView } from './components/admin/AdminSupportView';
import { TariffPlanConfigView } from './components/admin/TariffPlanConfigView';
import { AnnouncementsView } from './components/admin/AnnouncementsView';
import { AdminProfileView } from './components/admin/AdminProfileView';

// Resident Views
import { ResidentDashboardView } from './components/resident/ResidentDashboardView';
import { UsageHistoryView } from './components/resident/UsageHistoryView';
import { MyBillsView } from './components/resident/MyBillsView';
import { ResidentReportsView } from './components/resident/ResidentReportsView';
import { SupportConcernsView } from './components/resident/SupportConcernsView';
import { NotificationsView } from './components/resident/NotificationsView';
import { ResidentProfileView } from './components/resident/ResidentProfileView';

import { LoginView } from './components/auth/LoginView';

function AppLayout() {
  const { isAuthenticated, login, role, activeTab } = useAuth();

  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={(user) => login(user?.role?.includes('ADMIN') ? 'admin' : 'resident')} />;
  }

  const renderContent = () => {
    if (role === 'admin') {
      switch (activeTab) {
        case 'dashboard':
          return <AdminDashboardView />;
        case 'households':
          return <HouseholdsDirectory />;
        case 'readings':
          return <MeterReadingsView />;
        case 'billing':
          return <BillingManagement />;
        case 'bulk':
          return <BulkPurchasesView />;
        case 'reports':
          return <AdminReportsView />;
        case 'leakage':
          return <LeakageRadarView />;
        case 'support':
          return <AdminSupportView />;
        case 'tariff':
          return <TariffPlanConfigView />;
        case 'announcements':
          return <AnnouncementsView />;
        case 'profile':
          return <AdminProfileView />;
        default:
          return <TariffPlanConfigView />;
      }
    } else {
      switch (activeTab) {
        case 'dashboard':
          return <ResidentDashboardView />;
        case 'history':
          return <UsageHistoryView />;
        case 'bills':
          return <MyBillsView />;
        case 'reports':
          return <ResidentReportsView />;
        case 'support':
          return <SupportConcernsView />;
        case 'notifications':
          return <NotificationsView />;
        case 'profile':
          return <ResidentProfileView />;
        default:
          return <ResidentProfileView />;
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-800 antialiased font-sans">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {renderContent()}
        </main>
      </div>

      {/* Floating AI WaterBot Assistant Mascot */}
      <FloatingAssistant />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
}

export default App;
