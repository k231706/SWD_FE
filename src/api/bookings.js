import { apiClient } from './config';

/**
 * GET /bookings - Get all bookings
 * @param {Object} filters - Optional filters (userId, labId, status, date, etc.)
 * @returns {Promise} Response data with all bookings
 */
export const getAllBookings = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.userId) params.append('userId', filters.userId);
    if (filters.labId) params.append('labId', filters.labId);
    if (filters.status) params.append('status', filters.status);
    if (filters.date) params.append('date', filters.date);
    
    const queryString = params.toString();
    const url = queryString ? `/bookings?${queryString}` : '/bookings';
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error('Get all bookings error:', error);
    throw error;
  }
};

/**
 * GET /bookings/{id} - Get booking by ID
 * @param {string|number} id - Booking ID
 * @returns {Promise} Response data with booking details
 */
export const getBookingById = async (id) => {
  try {
    const response = await apiClient.get(`/bookings/${id}`);
    return response.data;
  } catch (error) {
    console.error('Get booking by ID error:', error);
    throw error;
  }
};

/**
 * POST /bookings - Create new booking
 * @param {Object} bookingData - Booking data (labId, requesterId, startTime, endTime, purpose, slotId, etc.)
 * @returns {Promise} Response data with created booking
 */
export const createBooking = async (bookingData) => {
  try {
    const response = await apiClient.post('/bookings', bookingData);
    return response.data;
  } catch (error) {
    console.error('Create booking error:', error);
    throw error;
  }
};

/**
 * PUT /bookings/{id} - Update booking by ID
 * @param {string|number} id - Booking ID
 * @param {Object} bookingData - Updated booking data
 * @returns {Promise} Response data with updated booking
 */
export const updateBooking = async (id, bookingData) => {
  try {
    const response = await apiClient.put(`/bookings/${id}`, bookingData);
    return response.data;
  } catch (error) {
    console.error('Update booking error:', error);
    throw error;
  }
};

/**
 * DELETE /bookings/{id} - Delete booking by ID
 * @param {string|number} id - Booking ID
 * @returns {Promise} Response data
 */
export const deleteBooking = async (id) => {
  try {
    const response = await apiClient.delete(`/bookings/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete booking error:', error);
    throw error;
  }
};

/**
 * PATCH /bookings/{id}/approve - Approve booking
 * @param {string|number} id - Booking ID
 * @param {Object} approveData - Optional approval data (approverId, notes, etc.)
 * @returns {Promise} Response data
 */
export const approveBooking = async (id, approveData = {}) => {
  try {
    const response = await apiClient.patch(`/bookings/${id}/approve`, approveData);
    return response.data;
  } catch (error) {
    console.error('Approve booking error:', error);
    throw error;
  }
};

/**
 * PATCH /bookings/{id}/reject - Reject booking
 * @param {string|number} id - Booking ID
 * @param {Object} rejectData - Rejection data (reason, rejectorId, etc.)
 * @returns {Promise} Response data
 */
export const rejectBooking = async (id, rejectData) => {
  try {
    const response = await apiClient.patch(`/bookings/${id}/reject`, rejectData);
    return response.data;
  } catch (error) {
    console.error('Reject booking error:', error);
    throw error;
  }
};

/**
 * GET /bookings/pending - Get pending bookings
 * @returns {Promise} Response data with pending bookings
 */
export const getPendingBookings = async () => {
  try {
    const response = await apiClient.get('/bookings/pending');
    return response.data;
  } catch (error) {
    console.error('Get pending bookings error:', error);
    throw error;
  }
};

