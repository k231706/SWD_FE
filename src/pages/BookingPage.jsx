import React, { useState, useEffect } from 'react';
import { useLabStore, useBookingStore, useAuthStore } from '../store';
import { Calendar, Clock, Send, CheckCircle } from 'lucide-react';
import '../styles/BookingPage.css';

export const BookingPage = () => {
  const { user } = useAuthStore();
  const { labs, fetchLabs } = useLabStore();
  const { createBooking, bookings, fetchBookings, isLoading } = useBookingStore();

  const [formData, setFormData] = useState({
    labId: '',
    startDate: '',
    startTime: '',
    endDate: '',
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
    if (!formData.startDate) newErrors.startDate = 'Vui lòng chọn ngày bắt đầu';
    if (!formData.startTime) newErrors.startTime = 'Vui lòng chọn giờ bắt đầu';
    if (!formData.endDate) newErrors.endDate = 'Vui lòng chọn ngày kết thúc';
    if (!formData.endTime) newErrors.endTime = 'Vui lòng chọn giờ kết thúc';
    if (!formData.purpose.trim()) newErrors.purpose = 'Vui lòng nhập mục đích sử dụng';

    // Validate dates
    if (formData.startDate && formData.endDate) {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
      const now = new Date();

      if (startDateTime < now) {
        newErrors.startDate = 'Thời gian bắt đầu phải sau thời điểm hiện tại';
      }
      if (endDateTime <= startDateTime) {
        newErrors.endDate = 'Thời gian kết thúc phải sau thời gian bắt đầu';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || !user) return;

    const bookingData = {
      labId: formData.labId,
      requesterId: user.id,
      startTime: `${formData.startDate}T${formData.startTime}`,
      endTime: `${formData.endDate}T${formData.endTime}`,
      purpose: formData.purpose,
      status: 'pending',
    };

    const success = await createBooking(bookingData);
    if (success) {
      setShowSuccess(true);
      setFormData({
        labId: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        purpose: '',
      });
      setTimeout(() => setShowSuccess(false), 5000);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getMyBookings = () => {
    if (!user) return [];
    return bookings
      .filter(b => b.requesterId === user.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
            <p className="success-text">Yêu cầu của bạn đang chờ được phê duyệt bởi quản lý lab.</p>
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
                {labs.filter(l => l.isAvailable).map(lab => (
                  <option key={lab.id} value={lab.id}>
                    {lab.name} - {lab.location} (Sức chứa: {lab.capacity})
                  </option>
                ))}
              </select>
              {errors.labId && <p className="error">{errors.labId}</p>}
            </div>

            {/* Date & Time */}
            <div className="form-row">
              <div className="form-group">
                <label>Ngày bắt đầu</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                />
                {errors.startDate && <p className="error">{errors.startDate}</p>}
              </div>
              <div className="form-group">
                <label>Giờ bắt đầu</label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                />
                {errors.startTime && <p className="error">{errors.startTime}</p>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Ngày kết thúc</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                />
                {errors.endDate && <p className="error">{errors.endDate}</p>}
              </div>
              <div className="form-group">
                <label>Giờ kết thúc</label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                />
                {errors.endTime && <p className="error">{errors.endTime}</p>}
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
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Đang gửi..." : "Gửi yêu cầu"}
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
              const lab = labs.find(l => l.id === b.labId);
              return (
                <div key={b.id} className="booking-item">
                  <div>
                    <h4 className="booking-lab-name">{lab?.name}</h4>
                    <p className="booking-lab-purpose">{b.purpose}</p>
                    <div className="time-info">
                      <Calendar className="icon-small" />
                      {new Date(b.startTime).toLocaleDateString('vi-VN')}
                      <Clock className="icon-small" />
                      {new Date(b.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <span className={`booking-page-status status-${b.status}`}>
                    {getStatusText(b.status)}
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
