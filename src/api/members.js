import { apiClient } from './config';

// GET /members - Get all members
export const getAllMembers = async () => {
  try {
    const response = await apiClient.get('/members');
    return response.data;
  } catch (error) {
    console.error('Get all members error:', error);
    throw error;
  }
};

// GET /members/{id} - Get member by ID
export const getMemberById = async (id) => {
  try {
    const response = await apiClient.get(`/members/${id}`);
    return response.data;
  } catch (error) {
    console.error('Get member by ID error:', error);
    throw error;
  }
};

// POST /members - Create new member
export const createMember = async (memberData) => {
  try {
    const response = await apiClient.post('/members', memberData);
    return response.data;
  } catch (error) {
    console.error('Create member error:', error);
    throw error;
  }
};

// PUT /members/{id} - Update member by ID
export const updateMember = async (id, memberData) => {
  try {
    const response = await apiClient.put(`/members/${id}`, memberData);
    return response.data;
  } catch (error) {
    console.error('Update member error:', error);
    throw error;
  }
};

// DELETE /members/{id} - Delete member by ID
export const deleteMember = async (id) => {
  try {
    const response = await apiClient.delete(`/members/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete member error:', error);
    throw error;
  }
};

