import { apiClient } from './config';

/**
 * GET /labs - Get all labs
 * @returns {Promise} Response data with all labs
 */
export const getAllLabs = async () => {
  try {
    const response = await apiClient.get('/labs');
    return response.data;
  } catch (error) {
    console.error('Get all labs error:', error);
    throw error;
  }
};

/**
 * GET /labs/{id} - Get lab by ID
 * @param {string|number} id - Lab ID
 * @returns {Promise} Response data with lab details
 */
export const getLabById = async (id) => {
  try {
    const response = await apiClient.get(`/labs/${id}`);
    return response.data;
  } catch (error) {
    console.error('Get lab by ID error:', error);
    throw error;
  }
};

/**
 * POST /labs - Create new lab
 * @param {Object} labData - Lab data (name, description, location, capacity, equipment, etc.)
 * @returns {Promise} Response data with created lab
 */
export const createLab = async (labData) => {
  try {
    const response = await apiClient.post('/labs', labData);
    return response.data;
  } catch (error) {
    console.error('Create lab error:', error);
    throw error;
  }
};

/**
 * PUT /labs/{id} - Update lab by ID
 * @param {string|number} id - Lab ID
 * @param {Object} labData - Updated lab data
 * @returns {Promise} Response data with updated lab
 */
export const updateLab = async (id, labData) => {
  try {
    const response = await apiClient.put(`/labs/${id}`, labData);
    return response.data;
  } catch (error) {
    console.error('Update lab error:', error);
    throw error;
  }
};

/**
 * DELETE /labs/{id} - Delete lab by ID
 * @param {string|number} id - Lab ID
 * @returns {Promise} Response data
 */
export const deleteLab = async (id) => {
  try {
    const response = await apiClient.delete(`/labs/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete lab error:', error);
    throw error;
  }
};

/**
 * PATCH /labs/{id}/status - Update lab status
 * @param {string|number} id - Lab ID
 * @param {Object} statusData - Status data (status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE', etc.)
 * @returns {Promise} Response data with updated lab
 */
export const updateLabStatus = async (id, statusData) => {
  try {
    const response = await apiClient.patch(`/labs/${id}/status`, statusData);
    return response.data;
  } catch (error) {
    console.error('Update lab status error:', error);
    throw error;
  }
};

/**
 * POST /labs/assign-roomslots-by-date - Assign room slots by date
 * @param {Object} assignData - Assignment data (labId, date, slots, etc.)
 * @returns {Promise} Response data
 */
export const assignRoomSlotsByDate = async (assignData) => {
  try {
    const response = await apiClient.post('/labs/assign-roomslots-by-date', assignData);
    return response.data;
  } catch (error) {
    console.error('Assign room slots by date error:', error);
    throw error;
  }
};

/**
 * GET /labs/{labId}/room-slots - Get room slots by lab ID
 * @param {string|number} labId - Lab ID
 * @param {string} date - Optional date filter (YYYY-MM-DD format)
 * @returns {Promise} Response data with room slots
 */
export const getRoomSlotsByLabId = async (labId, date = null) => {
  try {
    let url = `/labs/${labId}/room-slots`;
    if (date) {
      url += `?date=${date}`;
    }
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error('Get room slots by lab ID error:', error);
    throw error;
  }
};

