import React, { useState, useEffect } from 'react';
import { useLabStore, useBookingStore, useAuthStore } from '../store';
import { Calendar, Clock, Send, CheckCircle } from 'lucide-react';
import '../styles/BookingPage.css';

// CHANGED: Định nghĩa các ca học cố định
const timeSlots = [
  { value: 'slot1', label: 'Slot 1: 07:00 - 09:15', startTime: '07:00', endTime: '09:15' },
  { value: 'slot2', label: 'Slot 2: 09:30 - 11:45', startTime: '09:30', endTime: '11:45' },
  { value: 'slot3', label: 'Slot 3: 12:30 - 14:45', startTime: '12:30', endTime: '14:45' },
  { value: 'slot4', label: 'Slot 4: 15:00 - 17:15', startTime: '15:00', endTime: '17:15' },
];

export const BookingPage = () => {
  const { user } = useAuthStore();
  const { labs, fetchLabs } = useLabStore();
  const { createBooking, bookings, fetchBookings, isLoading } = useBookingStore();

  const [formData, setFormData] = useState({
    labId: '',
    bookingDate: '',
    startTime: '',
    endTime: '',
    purpose: '',
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchLabs();
    fetchBookings();
  }, [fetchLabs, fetchBookings]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.labId) newErrors.labId = 'Vui lòng chọn phòng lab';
    if (!formData.bookingDate) newErrors.bookingDate = 'Vui lòng chọn ngày đặt';
    if (!formData.startTime) newErrors.timeSlot = 'Vui lòng chọn ca học';
    if (!formData.purpose.trim()) newErrors.purpose = 'Vui lòng nhập mục đích sử dụng';

    if (formData.bookingDate && formData.startTime) {
      const startDateTime = new Date(`${formData.bookingDate}T${formData.startTime}`);
      const now = new Date();
      if (startDateTime < now) {
        newErrors.bookingDate = 'Thời gian bắt đầu phải sau thời điểm hiện tại';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || !user) return;

    try {
      const bookingData = {
        labId: formData.labId,
        requesterId: user.id || user.userId,
        startTime: `${formData.bookingDate}T${formData.startTime}:00`,
        endTime: `${formData.bookingDate}T${formData.endTime}:00`,
        purpose: formData.purpose,
        status: 'pending',
      };

      const newBooking = await createBooking(bookingData);
      if (newBooking) {
        setShowSuccess(true);
        setFormData({
          labId: '',
          bookingDate: '',
          startTime: '',
          endTime: '',
          purpose: '',
        });
        // Refresh bookings list
        await fetchBookings();
        setTimeout(() => setShowSuccess(false), 5000);
      }
    } catch (error) {
      console.error('Failed to create booking:', error);
      setErrors({ submit: error.response?.data?.message || 'Không thể tạo booking. Vui lòng thử lại.' });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSlotChange = (slotValue) => {
    if (!slotValue) {
      setFormData(prev => ({ ...prev, startTime: '', endTime: '' }));
      return;
    }
    const selectedSlot = timeSlots.find(slot => slot.value === slotValue);
    if (selectedSlot) {
      setFormData(prev => ({
        ...prev,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
      }));
    }
    if (errors.timeSlot) {
      setErrors(prev => ({ ...prev, timeSlot: '' }));
    }
  };

  const getMyBookings = () => {
    if (!user) return [];
    const userId = user.id || user.userId;
    return bookings
      .filter(b => (b.requesterId === userId) || (b.requester?.userId === userId) || (b.requester?.id === userId))
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || a.created_at || 0);
        const dateB = new Date(b.createdAt || b.created_at || 0);
        return dateB - dateA;
      });
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ duyệt';
      case 'approved': return 'Đã duyệt';
      case 'rejected': return 'Từ chối';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  return (
    <div className="booking-page">
      {/* Header */}
      <div className="card">
        <h1 className="title">Đặt lịch sử dụng Lab</h1>
        <p className="page-subtitle">
          Tạo yêu cầu đặt lịch sử dụng phòng lab cho các hoạt động học tập và nghiên cứu
        </p>
      </div>

      {/* Success message */}
      {showSuccess && (
        <div className="success-message">
          <CheckCircle className="icon" />
          <div>
            <p className="success-title">Yêu cầu đặt lịch đã được gửi thành công!</p>
            <p className="success-text">
              Yêu cầu của bạn đang chờ được phê duyệt bởi quản lý lab.
            </p>
          </div>
        </div>
      )}

      <div className="booking-layout">
        {/* Form */}
        <div className="card">
          <h3 className="section-title">Thông tin đặt lịch</h3>
          <form onSubmit={handleSubmit} className="form">
            {/* Lab selection */}
            <div className="form-group">
              <label>Chọn phòng Lab</label>
              <select
                value={formData.labId}
                onChange={(e) => handleInputChange('labId', e.target.value)}
              >
                <option value="">Chọn phòng lab...</option>
                {labs
                  .filter(l => l.isAvailable !== false && (l.status === 'ACTIVE' || l.status === 'active' || l.status === 'Active' || !l.status))
                  .map(lab => {
                    const labId = lab.id || lab.labId;
                    return (
                      <option key={labId} value={labId}>
                        {lab.name || 'N/A'} - {lab.location || 'N/A'} {lab.capacity ? `(Sức chứa: ${lab.capacity})` : ''}
                      </option>
                    );
                  })}
              </select>
              {errors.labId && <p className="error">{errors.labId}</p>}
            </div>

            {/* Date & Time Slot Selection */}
            <div className="form-row">
              <div className="form-group">
                <label>Ngày đặt</label>
                <input
                  type="date"
                  value={formData.bookingDate}
                  onChange={(e) => handleInputChange('bookingDate', e.target.value)}
                />
                {errors.bookingDate && <p className="error">{errors.bookingDate}</p>}
              </div>

              <div className="form-group">
                <label>Ca học</label>
                <select
                  value={timeSlots.find(s => s.startTime === formData.startTime)?.value || ''}
                  onChange={(e) => handleSlotChange(e.target.value)}
                >
                  <option value="">Chọn ca học...</option>
                  {timeSlots.map(slot => (
                    <option key={slot.value} value={slot.value}>
                      {slot.label}
                    </option>
                  ))}
                </select>
                {errors.timeSlot && <p className="error">{errors.timeSlot}</p>}
              </div>
            </div>

            {/* Purpose */}
            <div className="form-group">
              <label>Mục đích sử dụng</label>
              <textarea
                rows="4"
                value={formData.purpose}
                onChange={(e) => handleInputChange('purpose', e.target.value)}
              />
              {errors.purpose && <p className="error">{errors.purpose}</p>}
            </div>

            {/* Submit */}
            <div className="form-actions">
              {errors.submit && <p className="error" style={{ marginBottom: '1rem' }}>{errors.submit}</p>}
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Đang gửi...' : 'Gửi yêu cầu'}
              </button>
            </div>
          </form>
        </div>

        {/* My Bookings */}
        <div className="card">
          <h3 className="section-title">Lịch đặt của tôi</h3>
          <div className="bookings-list">
            {getMyBookings().length === 0 && (
              <p className="booking-page-empty">Bạn chưa có lịch đặt nào</p>
            )}

            {getMyBookings().slice(0, 5).map(b => {
              const bookingId = b.id || b.bookingId;
              const labId = b.labId || b.lab?.labId || b.lab?.id;
              const lab = labs.find(l => (l.id === labId) || (l.labId === labId));
              const startTime = b.startTime || b.start_time;
              return (
                <div key={bookingId} className="booking-item">
                  <div>
                    <h4 className="booking-lab-name">{lab?.name || 'N/A'}</h4>
                    <p className="booking-lab-purpose">{b.purpose || 'N/A'}</p>
                    <div className="time-info">
                      <Calendar className="icon-small" />
                      {startTime ? new Date(startTime).toLocaleDateString('vi-VN') : 'N/A'}
                      <Clock className="icon-small" />
                      {startTime ? new Date(startTime).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      }) : 'N/A'}
                    </div>
                  </div>
                  <span className={`booking-page-status status-${b.status || 'pending'}`}>
                    {getStatusText(b.status || 'pending')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
