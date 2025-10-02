import React, { useEffect, useState } from 'react';
import { useBookingStore, useLabStore, useAuthStore } from '../store';
import { Clock, Calendar, MapPin, User, CheckCircle, XCircle, AlertCircle, MessageSquare, Filter } from 'lucide-react';
import '../styles/ApprovalPage.css';

export const ApprovalPage = () => {
  const { user } = useAuthStore();
  const { labs, fetchLabs } = useLabStore();
  const { pendingBookings, approveBooking, rejectBooking, fetchPendingBookings, isLoading } = useBookingStore();
  
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLabs();
    fetchPendingBookings();
  }, [fetchLabs, fetchPendingBookings]);

  const handleApprove = async (bookingId) => {
    const success = await approveBooking(bookingId);
    if (success) fetchPendingBookings();
  };

  const handleReject = async () => {
    if (!selectedBooking || !rejectionReason.trim()) return;
    const success = await rejectBooking(selectedBooking.id, rejectionReason);
    if (success) {
      setShowRejectModal(false);
      setSelectedBooking(null);
      setRejectionReason('');
      fetchPendingBookings();
    }
  };

  const openRejectModal = (booking) => {
    setSelectedBooking(booking);
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setSelectedBooking(null);
    setRejectionReason('');
  };

  const getFilteredBookings = () => {
    let filtered = [...pendingBookings];
    if (filter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(b => b.startTime.startsWith(today));
    } else if (filter === 'this_week') {
      const now = new Date();
      const oneWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(b => {
        const d = new Date(b.startTime);
        return d >= now && d <= oneWeek;
      });
    }
    return filtered.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  };

  const BookingCard = ({ booking }) => {
    const lab = labs.find(l => l.id === booking.labId);
    const start = new Date(booking.startTime);
    const end = new Date(booking.endTime);
    const isUrgent = start.getTime() - Date.now() < 24 * 60 * 60 * 1000;

    return (
      <div className={`booking-card ${isUrgent ? 'urgent' : ''}`}>
        <div className="booking-header">
          <h3>{lab?.name}</h3>
          {isUrgent && (
            <span className="urgent-badge">
              <AlertCircle size={14} />
              Khẩn cấp
            </span>
          )}
        </div>

        <div className="booking-info">
          <p><MapPin size={14}/> {lab?.location}</p>
          <p><User size={14}/> Người đặt: {booking.requesterId}</p>
          <p><Calendar size={14}/> {start.toLocaleDateString('vi-VN')}</p>
          <p><Clock size={14}/> {start.toLocaleTimeString('vi-VN', {hour:'2-digit',minute:'2-digit'})} - {end.toLocaleTimeString('vi-VN', {hour:'2-digit',minute:'2-digit'})}</p>
        </div>

        <div className="booking-purpose">
          <strong>Mục đích sử dụng:</strong>
          <p>{booking.purpose}</p>
        </div>

        <div className="booking-footer">
          <span>Yêu cầu tạo lúc: {new Date(booking.createdAt).toLocaleString('vi-VN')}</span>
          <div className="actions">
            <button className="btn-reject" onClick={() => openRejectModal(booking)} disabled={isLoading}>
              <XCircle size={16}/> Từ chối
            </button>
            <button className="btn-approve" onClick={() => handleApprove(booking.id)} disabled={isLoading}>
              <CheckCircle size={16}/> Phê duyệt
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="approval-page">
      {/* Header */}
      <div className="approval-header">
        <div>
          <h1 className="title">Phê duyệt yêu cầu đặt lịch</h1>
          <p className="page-subtitle">Xem xét và phê duyệt các yêu cầu đặt lịch sử dụng phòng lab</p>
        </div>
        <div className="filter">
          <Filter size={18}/>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Tất cả</option>
            <option value="today">Hôm nay</option>
            <option value="this_week">Tuần này</option>
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="stats">
        <div className="approval-page-stat">
          <Clock className="stat-icon yellow"/>
          <div>
            <p class="stat-title">Chờ phê duyệt</p>
            <h2 class="stat-value">{pendingBookings.length}</h2>
          </div>
        </div>
        <div className="approval-page-stat">
          <AlertCircle className="stat-icon red"/>
          <div>
            <p class="stat-title">Khẩn cấp</p>
            <h2 class="stat-value">{pendingBookings.filter(b => new Date(b.startTime).getTime() - Date.now() < 24*60*60*1000).length}</h2>
          </div>
        </div>
        <div className="approval-page-stat">
          <Calendar className="stat-icon blue"/>
          <div>
            <p class="stat-title">Hôm nay</p>
            <h2 class="stat-value">{pendingBookings.filter(b => b.startTime.startsWith(new Date().toISOString().split('T')[0])).length}</h2>
          </div>
        </div>
      </div>

      {/* Booking List */}
      <div className="booking-list">
        {getFilteredBookings().map(b => <BookingCard key={b.id} booking={b}/>)}
        {getFilteredBookings().length === 0 && (
          <div className="no-bookings">
            <CheckCircle size={40}/>
            <h3 class="no-request">Không có yêu cầu nào</h3>
            <p class="no-request-detail">{filter==='all'?'Hiện tại không có yêu cầu cần phê duyệt.':'Không có yêu cầu nào trong khoảng thời gian được chọn.'}</p>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <XCircle className="red"/> <h3>Từ chối yêu cầu</h3>
            </div>
            <textarea
              value={rejectionReason}
              onChange={(e)=>setRejectionReason(e.target.value)}
              placeholder="Nhập lý do từ chối..."
            />
            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeRejectModal}>Hủy</button>
              <button className="btn-confirm" onClick={handleReject} disabled={!rejectionReason.trim() || isLoading}>
                <MessageSquare size={16}/> Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
