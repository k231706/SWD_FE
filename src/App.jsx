import React, { useState } from 'react';
import { useAuthStore } from './store';
import { AuthWrapper } from './components/AuthWrapper';
import { Layout } from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { Dashboard } from './pages/Dashboard';
import { BookingPage } from './pages/BookingPage';
import { ApprovalPage } from './pages/ApprovalPage';
import { AccessRequestPage } from './pages/AccessRequestPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ReportsPage } from './pages/ReportsPage';

import './App.css';

function App() {
  const { isAuthenticated } = useAuthStore();
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Simple page routing
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'booking':
        return <BookingPage />;
      case 'approval':
        return <ApprovalPage />;
      case 'access':
        return <AccessRequestPage />;
      case 'labs':
        return (
          <div className="card">
            <h2 className="title">Quản lý Lab</h2>
            <p className="page-subtitle">Tính năng quản lý phòng lab đang được phát triển...</p>
          </div>
        );
      case 'reports':
        return <ReportsPage />;
      case 'users':
        return <UserManagementPage />;
      case 'notifications':
        return <NotificationsPage />;
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return (
      <ErrorBoundary>
        <AuthWrapper />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
        {renderPage()}
      </Layout>
    </ErrorBoundary>
  );
}

export default App;
