import React, { useState } from "react";
import { useAuthStore, useNotificationStore } from "../store";
import { 
  Menu, 
  Home, 
  Building2, 
  LogOut,
  Calendar,
  ClipboardCheck,
  Key,
  BarChart2,
  Users,
  Bell,
} from "lucide-react";
import "../styles/Layout.css";

export const Layout = ({ children, currentPage, onNavigate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();

  const menuItems = [
    { id: 'dashboard', title: 'Dashboard', icon: Home },
    { id: 'booking', title: 'Đặt lịch Lab', icon: Calendar },
    { id: 'labs', title: 'Quản lý Lab', icon: Building2 },
    { id: 'approval', title: 'Phê duyệt', icon: ClipboardCheck },
    { id: 'access', title: 'Yêu cầu truy cập', icon: Key },
    { id: 'reports', title: 'Báo cáo', icon: BarChart2 },
    { id: 'users', title: 'Người dùng', icon: Users },
    { id: 'notifications', title: 'Thông báo', icon: Bell },
  ];

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="logo">
          <Building2 className="logo-icon" />
          <span>Lab Manager</span>
        </div>
        
        <nav className="nav-menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${currentPage === item.id ? "active" : ""}`}
              onClick={() => onNavigate(item.id)}
            >
              <item.icon /> {item.title}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button onClick={() => setSidebarOpen(true)} className="menu-btn">
              <Menu />
            </button>
          </div>

          <div className="topbar-right">
            <div className="user-profile">
              <div className="user-avatar">
                {user?.name?.charAt(0)}
              </div>
              <div className="user-info">
                <span className="user-name">{user?.name}</span>
                <span className="user-role">{user?.role || 'Lab Member'}</span>
              </div>
              <button onClick={logout} className="logout-btn">
                <LogOut />
              </button>
            </div>
          </div>
        </header>
        
        <section className="page-content">{children}</section>
      </main>
    </div>
  );
};
