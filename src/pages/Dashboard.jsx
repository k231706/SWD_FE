import React, { useEffect, useState } from 'react';
import { useLabStore, useBookingStore, useEventStore } from '../store';
import { Calendar, Users, Building2, Clock, CheckCircle, Activity } from 'lucide-react';
import '../styles/Dashboard.css';

export const Dashboard = () => {
  const { labs, fetchLabs } = useLabStore();
  const { bookings, pendingBookings, fetchBookings, fetchPendingBookings } = useBookingStore();
  const { events, fetchEvents } = useEventStore();

  const [stats, setStats] = useState({
    totalLabs: 0,
    availableLabs: 0,
    totalBookings: 0,
    pendingBookings: 0,
    todayBookings: 0,
    recentEvents: 0,
  });

  useEffect(() => {
    const initializeDashboard = async () => {
      await Promise.all([
        fetchLabs(),
        fetchBookings(),
        fetchPendingBookings(),
        fetchEvents(),
      ]);
    };
    initializeDashboard();
  }, [fetchLabs, fetchBookings, fetchPendingBookings, fetchEvents]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = bookings.filter(booking =>
      booking.startTime.startsWith(today)
    ).length;

    setStats({
      totalLabs: labs.length,
      availableLabs: labs.filter(lab => lab.isAvailable).length,
      totalBookings: bookings.length,
      pendingBookings: pendingBookings.length,
      todayBookings,
      recentEvents: events.length,
    });
  }, [labs, bookings, pendingBookings, events]);

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="stat-card">
      <div className="stat-icon" style={{ color }}>
        <Icon size={24} />
      </div>
      <div className="stat-info">
        <p className="stat-title">{title}</p>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );

  const RecentActivity = () => (
    <div className="card">
      <h3 className="card-title">Hoạt động gần đây</h3>
      <ul className="timeline">
        {events.slice(0, 5).map((event) => (
          <li key={event.id} className="timeline-item">
            <div className="timeline-icon">
              <Activity size={16} color="#fff" />
            </div>
            <div className="timeline-content">
              <p>{event.description}</p>
              <span>{new Date(event.timestamp).toLocaleDateString('vi-VN')}</span>
            </div>
          </li>
        ))}
        {events.length === 0 && <p className="empty">Chưa có hoạt động nào</p>}
      </ul>
    </div>
  );

  const UpcomingBookings = () => {
    const today = new Date();
    const upcomingBookings = bookings
      .filter(b => new Date(b.startTime) > today && b.status === 'approved')
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
      .slice(0, 5);

    return (
      <div className="card">
        <h3 className="card-title">Lịch sắp tới</h3>
        {upcomingBookings.length > 0 ? (
          <div className="upcoming-list">
            {upcomingBookings.map((booking) => {
              const lab = labs.find(l => l.id === booking.labId);
              return (
                <div key={booking.id} className="upcoming-item">
                  <div>
                    <p className="upcoming-lab">{lab?.name}</p>
                    <p className="upcoming-purpose">{booking.purpose}</p>
                  </div>
                  <div className="upcoming-time">
                    <p>{new Date(booking.startTime).toLocaleDateString('vi-VN')}</p>
                    <p>
                      {new Date(booking.startTime).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="empty">Không có lịch nào sắp tới</p>
        )}
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1 className="page-title">Dashboard Quản lý Lab</h1>
        <p className="page-subtitle">Tổng quan về hoạt động và trạng thái các phòng lab</p>
      </div>

      <div className="stats-grid">
        <StatCard title="Tổng số Lab" value={stats.totalLabs} icon={Building2} color="blue" />
        <StatCard title="Lab đang hoạt động" value={stats.availableLabs} icon={CheckCircle} color="green" />
        <StatCard title="Yêu cầu chờ duyệt" value={stats.pendingBookings} icon={Clock} color="orange" />
        <StatCard title="Booking hôm nay" value={stats.todayBookings} icon={Calendar} color="purple" />
      </div>

      <div className="card">
        <h3 className="card-title">Trạng thái phòng Lab</h3>
        <div className="labs-grid">
          {labs.length > 0 ? (
            labs.map((lab) => (
              <div key={lab.id} className={`lab-card ${lab.isAvailable ? 'available' : 'maintenance'}`}>
                <div className="lab-header">
                  <div className="lab-icon">
                    <Building2 size={20} />
                  </div>
                  <div className="lab-info">
                    <p className="lab-name">{lab.name}</p>
                    <p className="lab-location">{lab.location}</p>
                  </div>
                  <div className={`lab-status ${lab.isAvailable ? 'active' : 'maintenance'}`}>
                    {lab.isAvailable ? 'Hoạt động' : 'Bảo trì'}
                  </div>
                </div>
                <p className="lab-meta">
                  Sức chứa: {lab.capacity} người • Giờ hoạt động: {lab.operatingHours.start} - {lab.operatingHours.end}
                </p>
              </div>
            ))
          ) : (
            <p className="empty">Chưa có phòng lab nào được thiết lập</p>
          )}
        </div>
      </div>

      <div className="activity-grid">
        <RecentActivity />
        <UpcomingBookings />
      </div>
    </div>
  );
};
