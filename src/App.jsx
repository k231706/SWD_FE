import React, { useState } from 'react';
import { useAuthStore } from './store';
import { AuthWrapper } from './components/AuthWrapper';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { BookingPage } from './pages/BookingPage';
import { ApprovalPage } from './pages/ApprovalPage';
import { AccessRequestPage } from './pages/AccessRequestPage';
import { UserManagementPage } from './pages/UserManagementPage';

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
        return (
          <div className="page-card">
            <h2 className="page-title">Báo cáo</h2>
            <p className="page-text">Tính năng báo cáo đang được phát triển...</p>
          </div>
        );
      case 'users':
        return <UserManagementPage />;
      case 'notifications':
        return (
          <div className="page-card">
            <h2 className="page-title">Thông báo</h2>
            <p className="page-text">Tính năng thông báo đang được phát triển...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  if (!isAuthenticated) {
    return <AuthWrapper />;
  }

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;
