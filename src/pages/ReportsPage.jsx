import React, { useState, useEffect } from 'react';
import { useBookingStore, useLabStore } from '../store';
import { Calendar, Clock, ChevronLeft, ChevronRight, Building2 } from 'lucide-react';
import '../styles/ReportsPage.css';

// Time slots
const timeSlots = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
  '19:00', '20:00', '21:00', '22:00'
];

export const ReportsPage = () => {
  const { bookings, fetchBookings, isLoading } = useBookingStore();
  const { labs, fetchLabs } = useLabStore();
  const [currentWeek, setCurrentWeek] = useState(new Date());

  useEffect(() => {
    fetchLabs();
    fetchBookings();
  }, [fetchLabs, fetchBookings]);

  // Get start of week (Monday)
  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
  };

  // Get all days in current week
  const getWeekDays = () => {
    const start = getStartOfWeek(currentWeek);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays();

  // Get bookings for a specific date
  const getBookingsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.startTime).toISOString().split('T')[0];
      return bookingDate === dateStr;
    });
  };

  // Get booking at a specific time slot (returns booking if this is the start slot or if slot is within booking range)
  const getBookingAtTime = (date, time) => {
    const bookingsForDate = getBookingsForDate(date);
    const [timeHour] = time.split(':').map(Number);
    
    const booking = bookingsForDate.find(booking => {
      const startDate = new Date(booking.startTime);
      const endDate = new Date(booking.endTime);
      const bookingStartHour = startDate.getHours();
      const bookingEndHour = endDate.getHours();
      
      // Check if time slot is within booking range
      return timeHour >= bookingStartHour && timeHour < bookingEndHour;
    });

    // Only show full booking details if this is the starting hour
    if (booking) {
      const bookingStartHour = new Date(booking.startTime).getHours();
      if (timeHour === bookingStartHour) {
        return booking;
      }
      // For continuation slots, return a minimal booking object
      return { ...booking, isContinuation: true };
    }
    
    return null;
  };

  // Navigate weeks
  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeek(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeek(newDate);
  };

  const goToCurrentWeek = () => {
    setCurrentWeek(new Date());
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' });
  };

  const getDayName = (date) => {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return days[date.getDay()];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return '#10b981'; // green
      case 'pending':
        return '#f59e0b'; // yellow
      case 'rejected':
        return '#ef4444'; // red
      case 'completed':
        return '#6366f1'; // indigo
      default:
        return '#6b7280'; // gray
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return 'Đã duyệt';
      case 'pending':
        return 'Chờ duyệt';
      case 'rejected':
        return 'Từ chối';
      case 'completed':
        return 'Hoàn thành';
      default:
        return status;
    }
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="reports-page">
      {/* Header */}
      <div className="card">
        <div className="reports-header">
          <div>
            <h1 className="title">Báo cáo</h1>
            <p className="page-subtitle">Lịch đặt phòng Lab trong tuần</p>
          </div>
          <div className="week-navigation">
            <button className="nav-btn" onClick={goToPreviousWeek}>
              <ChevronLeft />
            </button>
            <button className="nav-btn current-week-btn" onClick={goToCurrentWeek}>
              Tuần này
            </button>
            <button className="nav-btn" onClick={goToNextWeek}>
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* Week Calendar */}
      {isLoading ? (
        <div className="card">
          <div className="loading-state">Đang tải lịch đặt phòng...</div>
        </div>
      ) : (
        <div className="card">
          <div className="weekly-calendar">
            {/* Time column and day headers */}
            <div className="calendar-grid">
              {/* Corner cell */}
              <div className="calendar-cell corner-cell">
                <Calendar className="calendar-icon" />
              </div>

              {/* Day headers */}
              {weekDays.map((day, index) => (
                <div
                  key={index}
                  className={`calendar-cell day-header ${isToday(day) ? 'today' : ''}`}
                >
                  <div className="day-name">{getDayName(day)}</div>
                  <div className="day-date">{formatDate(day)}</div>
                </div>
              ))}

              {/* Time slots */}
              {timeSlots.map((time, timeIndex) => (
                <React.Fragment key={timeIndex}>
                  {/* Time label */}
                  <div className="calendar-cell time-cell">
                    <Clock className="time-icon" />
                    <span className="time-label">{time}</span>
                  </div>

                  {/* Day cells */}
                  {weekDays.map((day, dayIndex) => {
                    const booking = getBookingAtTime(day, time);
                    const lab = booking ? labs.find(l => l.id === booking.labId) : null;

                    return (
                      <div
                        key={`${timeIndex}-${dayIndex}`}
                        className={`calendar-cell booking-cell ${booking ? 'has-booking' : ''} ${isToday(day) ? 'today' : ''}`}
                      >
                        {booking && (
                          <div
                            className={`booking-item ${booking.isContinuation ? 'continuation' : ''}`}
                            style={{
                              borderLeft: `4px solid ${getStatusColor(booking.status)}`
                            }}
                            title={`${lab?.name || 'Lab'} - ${booking.purpose} - ${getStatusText(booking.status)}`}
                          >
                            {!booking.isContinuation ? (
                              <>
                                <div className="booking-lab-name">{lab?.name || 'Lab'}</div>
                                <div className="booking-time">
                                  {new Date(booking.startTime).toLocaleTimeString('vi-VN', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })} - {new Date(booking.endTime).toLocaleTimeString('vi-VN', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                                <div className="booking-status" style={{ color: getStatusColor(booking.status) }}>
                                  {getStatusText(booking.status)}
                                </div>
                              </>
                            ) : (
                              <div 
                                className="booking-continuation" 
                                style={{ 
                                  backgroundColor: `${getStatusColor(booking.status)}33`,
                                  borderLeft: `2px solid ${getStatusColor(booking.status)}`
                                }}
                              >
                                →
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="card">
        <div className="legend">
          <h3 className="legend-title">Chú thích</h3>
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#10b981' }}></div>
              <span>Đã duyệt</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#f59e0b' }}></div>
              <span>Chờ duyệt</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#ef4444' }}></div>
              <span>Từ chối</span>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: '#6366f1' }}></div>
              <span>Hoàn thành</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

