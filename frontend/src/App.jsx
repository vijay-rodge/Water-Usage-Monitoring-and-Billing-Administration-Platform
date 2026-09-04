import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { FloatingAssistant } from './components/layout/FloatingAssistant';
import { ToastNotification } from './components/common/ToastNotification';
import { AuthLandingView } from './components/auth/AuthLandingView';

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

function AppLayout() {
  const { isAuthenticated, toast, closeToast } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-800 antialiased font-sans">
      {/* Fixed Left Sidebar with Router Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Floating AI WaterBot Assistant Mascot */}
      <FloatingAssistant />

      {/* Global Toast Bus */}
      <ToastNotification toast={toast} onClose={closeToast} />
    </div>
  );
}

function AuthRouteWrapper({ initialMode = 'login' }) {
  const { isAuthenticated, login, role, toast, closeToast } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={role === 'admin' ? '/admin/tariff' : '/resident/profile'} replace />;
  }

  return (
    <>
      <AuthLandingView
        initialMode={initialMode}
        onLoginSuccess={(user) => login(user?.role?.includes('ADMIN') ? 'admin' : 'resident', user)}
      />
      <ToastNotification toast={toast} onClose={closeToast} />
    </>
  );
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth & Onboarding Routes */}
          <Route path="/" element={<AuthRouteWrapper initialMode="register_community" />} />
          <Route path="/login" element={<AuthRouteWrapper initialMode="login" />} />
          <Route path="/register-community" element={<AuthRouteWrapper initialMode="register_community" />} />
          <Route path="/register-resident" element={<AuthRouteWrapper initialMode="register_resident" />} />

          {/* Protected Application Routes */}
          <Route element={<AppLayout />}>
            {/* Admin Section Routes */}
            <Route path="/admin" element={<Navigate to="/admin/tariff" replace />} />
            <Route path="/admin/tariff" element={<TariffPlanConfigView />} />
            <Route path="/admin/dashboard" element={<AdminDashboardView />} />
            <Route path="/admin/households" element={<HouseholdsDirectory />} />
            <Route path="/admin/readings" element={<MeterReadingsView />} />
            <Route path="/admin/billing" element={<BillingManagement />} />
            <Route path="/admin/bulk" element={<BulkPurchasesView />} />
            <Route path="/admin/reports" element={<AdminReportsView />} />
            <Route path="/admin/leakage" element={<LeakageRadarView />} />
            <Route path="/admin/support" element={<AdminSupportView />} />
            <Route path="/admin/announcements" element={<AnnouncementsView />} />
            <Route path="/admin/profile" element={<AdminProfileView />} />

            {/* Resident Section Routes */}
            <Route path="/resident" element={<Navigate to="/resident/profile" replace />} />
            <Route path="/resident/profile" element={<ResidentProfileView />} />
            <Route path="/resident/dashboard" element={<ResidentDashboardView />} />
            <Route path="/resident/history" element={<UsageHistoryView />} />
            <Route path="/resident/bills" element={<MyBillsView />} />
            <Route path="/resident/reports" element={<ResidentReportsView />} />
            <Route path="/resident/support" element={<SupportConcernsView />} />
            <Route path="/resident/notifications" element={<NotificationsView />} />

            {/* Catch-all Route */}
            <Route path="*" element={<Navigate to="/admin/tariff" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
