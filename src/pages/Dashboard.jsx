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
      booking?.startTime && typeof booking.startTime === 'string' && booking.startTime.startsWith(today)
    ).length;

    setStats({
      totalLabs: labs.length,
      availableLabs: labs.filter(lab => lab?.isAvailable !== false && (lab?.status === 'ACTIVE' || lab?.status === 'active')).length,
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
        {Array.isArray(events) && events.length > 0 ? (
          events.slice(0, 5).map((event) => {
            const eventId = event.id || event.eventId;
            const timestamp = event.timestamp || event.createdAt || new Date().toISOString();
            return (
              <li key={eventId} className="timeline-item">
                <div className="timeline-icon">
                  <Activity size={16} color="#fff" />
                </div>
                <div className="timeline-content">
                  <p>{event.description || event.message || 'N/A'}</p>
                  <span>{new Date(timestamp).toLocaleDateString('vi-VN')}</span>
                </div>
              </li>
            );
          })
        ) : (
          <p className="empty">Chưa có hoạt động nào</p>
        )}
      </ul>
    </div>
  );

  const UpcomingBookings = () => {
    const today = new Date();
    const upcomingBookings = bookings
      .filter(b => b?.startTime && !isNaN(new Date(b.startTime).getTime()) && new Date(b.startTime) > today && b.status === 'approved')
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
      .slice(0, 5);

    return (
      <div className="card">
        <h3 className="card-title">Lịch sắp tới</h3>
        {upcomingBookings.length > 0 ? (
          <div className="upcoming-list">
            {upcomingBookings.map((booking) => {
              const lab = labs.find(l => (l.id === booking.labId) || (l.labId === booking.labId));
              return (
                <div key={booking.id || booking.bookingId} className="upcoming-item">
                  <div>
                    <p className="upcoming-lab">{lab?.name || 'N/A'}</p>
                    <p className="upcoming-purpose">{booking.purpose || 'N/A'}</p>
                  </div>
                  <div className="upcoming-time">
                    <p>{booking.startTime ? new Date(booking.startTime).toLocaleDateString('vi-VN') : 'N/A'}</p>
                    <p>
                      {booking.startTime ? new Date(booking.startTime).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      }) : 'N/A'}
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
            labs.map((lab) => {
              const labId = lab.id || lab.labId;
              const isAvailable = lab.isAvailable !== false && (lab.status === 'ACTIVE' || lab.status === 'active' || lab.status === 'Active');
              const operatingHours = lab.operatingHours || lab.operating_hours || {};
              const startTime = operatingHours.start || operatingHours.startTime || 'N/A';
              const endTime = operatingHours.end || operatingHours.endTime || 'N/A';
              
              return (
                <div key={labId} className={`lab-card ${isAvailable ? 'available' : 'maintenance'}`}>
                  <div className="lab-header">
                    <div className="lab-icon">
                      <Building2 size={20} />
                    </div>
                    <div className="lab-info">
                      <p className="lab-name">{lab.name || 'N/A'}</p>
                      <p className="lab-location">{lab.location || 'N/A'}</p>
                    </div>
                    <div className={`lab-status ${isAvailable ? 'active' : 'maintenance'}`}>
                      {isAvailable ? 'Hoạt động' : 'Bảo trì'}
                    </div>
                  </div>
                  <p className="lab-meta">
                    Sức chứa: {lab.capacity || 'N/A'} người • Giờ hoạt động: {startTime} - {endTime}
                  </p>
                </div>
              );
            })
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
