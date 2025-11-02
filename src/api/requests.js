import { apiClient } from './config';

// GET /requests - Get all requests
export const getAllRequests = async () => {
  try {
    const response = await apiClient.get('/requests');
    return response.data;
  } catch (error) {
    console.error('Get all requests error:', error);
    throw error;
  }
};

// GET /requests/{id} - Get request by ID
export const getRequestById = async (id) => {
  try {
    const response = await apiClient.get(`/requests/${id}`);
    return response.data;
  } catch (error) {
    console.error('Get request by ID error:', error);
    throw error;
  }
};

// POST /requests - Create new request
export const createRequest = async (requestData) => {
  try {
    const response = await apiClient.post('/requests', requestData);
    return response.data;
  } catch (error) {
    console.error('Create request error:', error);
    throw error;
  }
};

// PUT /requests/{id} - Update request by ID
export const updateRequest = async (id, requestData) => {
  try {
    const response = await apiClient.put(`/requests/${id}`, requestData);
    return response.data;
  } catch (error) {
    console.error('Update request error:', error);
    throw error;
  }
};

// DELETE /requests/{id} - Delete request by ID
export const deleteRequest = async (id) => {
  try {
    const response = await apiClient.delete(`/requests/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete request error:', error);
    throw error;
  }
};

