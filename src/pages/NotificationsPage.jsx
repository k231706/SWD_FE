import React, { useState, useEffect } from 'react';
import { useNotificationStore } from '../store';
import { Bell, Clock, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import '../styles/NotificationsPage.css';

export const NotificationsPage = () => {
  const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead, isLoading } = useNotificationStore();
  const [workingHours, setWorkingHours] = useState({
    isWorkingHours: false,
    currentTime: new Date(),
    todaySchedule: null
  });

  // Tính toán giờ làm việc
  useEffect(() => {
    const checkWorkingHours = () => {
      const now = new Date();
      const dayOfWeek = now.getDay(); // 0 = Chủ nhật, 1 = Thứ 2, ..., 6 = Thứ 7
      const currentHour = now.getHours();
      
      let schedule = null;
      let isWorking = false;

      // Thứ 2 -> Thứ 6 (1-5): 7h -> 10h
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        schedule = { start: 7, end: 10 };
        isWorking = currentHour >= 7 && currentHour < 10;
      }
      // Thứ 7 và Chủ nhật (6, 0): 9h -> 6h (9h -> 18h)
      else if (dayOfWeek === 6 || dayOfWeek === 0) {
        schedule = { start: 9, end: 18 };
        isWorking = currentHour >= 9 && currentHour < 18;
      }

      setWorkingHours({
        isWorkingHours: isWorking,
        currentTime: now,
        todaySchedule: schedule
      });
    };

    checkWorkingHours();
    const interval = setInterval(checkWorkingHours, 60000); // Cập nhật mỗi phút

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const getDayName = (dayOfWeek) => {
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return days[dayOfWeek];
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const getScheduleText = () => {
    const dayOfWeek = workingHours.currentTime.getDay();
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      return 'Thứ 2 - Thứ 6: 7:00 - 10:00';
    } else {
      return 'Thứ 7 - Chủ nhật: 9:00 - 18:00';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="notification-icon success" />;
      case 'error':
        return <XCircle className="notification-icon error" />;
      case 'warning':
        return <AlertCircle className="notification-icon warning" />;
      default:
        return <Info className="notification-icon info" />;
    }
  };

  return (
    <div className="notifications-page">
      {/* Header */}
      <div className="card">
        <div className="notifications-header">
          <div>
            <h1 className="title">Thông báo</h1>
            <p className="page-subtitle">Quản lý và xem tất cả thông báo của bạn</p>
          </div>
          <div className="header-actions">
            {notifications.length > 0 && (
              <button 
                className="mark-all-read-btn" 
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Working Hours Status */}
      <div className={`working-hours-card ${workingHours.isWorkingHours ? 'active' : 'inactive'}`}>
        <div className="working-hours-content">
          <Clock className="working-hours-icon" />
          <div className="working-hours-info">
            <div className="working-hours-status">
              {workingHours.isWorkingHours ? (
                <span className="status-text active">Đang trong giờ làm việc</span>
              ) : (
                <span className="status-text inactive">Ngoài giờ làm việc</span>
              )}
            </div>
            <div className="working-hours-time">
              <span>Thời gian hiện tại: {formatTime(workingHours.currentTime)}</span>
              <span>• {getDayName(workingHours.currentTime.getDay())}</span>
            </div>
            <div className="working-hours-schedule">
              <span>Lịch làm việc: {getScheduleText()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <div className="card">
          <div className="loading-state">Đang tải thông báo...</div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <Bell className="empty-icon" />
            <p className="empty-text">Chưa có thông báo nào</p>
            <p className="empty-subtext">Các thông báo mới sẽ xuất hiện ở đây</p>
          </div>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
              onClick={() => !notification.isRead && markAsRead(notification.id)}
            >
              <div className="notification-content">
                {getNotificationIcon(notification.type || 'info')}
                <div className="notification-text">
                  <h3 className="notification-title">{notification.title}</h3>
                  <p className="notification-message">{notification.message}</p>
                  <div className="notification-meta">
                    <span className="notification-time">
                      {new Date(notification.createdAt).toLocaleString('vi-VN')}
                    </span>
                    {notification.category && (
                      <span className="notification-category">{notification.category}</span>
                    )}
                  </div>
                </div>
              </div>
              {!notification.isRead && (
                <div className="unread-indicator"></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

