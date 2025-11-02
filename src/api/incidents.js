import { apiClient } from './config';

// GET /incidents/{id} - Get incident by ID
export const getIncidentById = async (id) => {
  try {
    const response = await apiClient.get(`/incidents/${id}`);
    return response.data;
  } catch (error) {
    console.error('Get incident by ID error:', error);
    throw error;
  }
};

// POST /incidents - Create new incident
export const createIncident = async (incidentData) => {
  try {
    const response = await apiClient.post('/incidents', incidentData);
    return response.data;
  } catch (error) {
    console.error('Create incident error:', error);
    throw error;
  }
};

// PUT /incidents/{id} - Update incident by ID
export const updateIncident = async (id, incidentData) => {
  try {
    const response = await apiClient.put(`/incidents/${id}`, incidentData);
    return response.data;
  } catch (error) {
    console.error('Update incident error:', error);
    throw error;
  }
};

// DELETE /incidents/{id} - Delete incident by ID
export const deleteIncident = async (id) => {
  try {
    const response = await apiClient.delete(`/incidents/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete incident error:', error);
    throw error;
  }
};

// GET /incidents - Get all incidents
export const getAllIncidents = async () => {
  try {
    const response = await apiClient.get('/incidents');
    return response.data;
  } catch (error) {
    console.error('Get all incidents error:', error);
    throw error;
  }
};

