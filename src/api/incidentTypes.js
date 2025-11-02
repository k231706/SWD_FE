import { apiClient } from './config';

// GET /incident-types - Get all incident types
export const getAllIncidentTypes = async () => {
  try {
    const response = await apiClient.get('/incident-types');
    return response.data;
  } catch (error) {
    console.error('Get all incident types error:', error);
    throw error;
  }
};

// GET /incident-types/{id} - Get incident type by ID
export const getIncidentTypeById = async (id) => {
  try {
    const response = await apiClient.get(`/incident-types/${id}`);
    return response.data;
  } catch (error) {
    console.error('Get incident type by ID error:', error);
    throw error;
  }
};

// POST /incident-types - Create new incident type
export const createIncidentType = async (incidentTypeData) => {
  try {
    const response = await apiClient.post('/incident-types', incidentTypeData);
    return response.data;
  } catch (error) {
    console.error('Create incident type error:', error);
    throw error;
  }
};

// PUT /incident-types/{id} - Update incident type by ID
export const updateIncidentType = async (id, incidentTypeData) => {
  try {
    const response = await apiClient.put(`/incident-types/${id}`, incidentTypeData);
    return response.data;
  } catch (error) {
    console.error('Update incident type error:', error);
    throw error;
  }
};

// DELETE /incident-types/{id} - Delete incident type by ID
export const deleteIncidentType = async (id) => {
  try {
    const response = await apiClient.delete(`/incident-types/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete incident type error:', error);
    throw error;
  }
};

