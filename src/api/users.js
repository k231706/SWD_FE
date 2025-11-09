import { apiClient } from './config';

/**
 * GET /users - Get all users
 * @returns {Promise} Response data with all users
 */
export const getAllUsers = async () => {
  try {
    const response = await apiClient.get('/users');
    return response.data;
  } catch (error) {
    console.error('Get all users error:', error);
    throw error;
  }
};

/**
 * GET /users/{id} - Get user by ID
 * @param {string|number} id - User ID
 * @returns {Promise} Response data with user details
 */
export const getUserById = async (id) => {
  try {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Get user by ID error:', error);
    throw error;
  }
};

/**
 * POST /users - Create new user
 * @param {Object} userData - User data (email, username, fullName, phone, password, role, etc.)
 * @returns {Promise} Response data with created user
 */
export const createUser = async (userData) => {
  try {
    const response = await apiClient.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Create user error:', error);
    throw error;
  }
};

/**
 * PUT /users/{id} - Update user by ID
 * @param {string|number} id - User ID
 * @param {Object} userData - Updated user data
 * @returns {Promise} Response data with updated user
 */
export const updateUser = async (id, userData) => {
  try {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error('Update user error:', error);
    throw error;
  }
};

/**
 * DELETE /users/{id} - Delete user by ID
 * @param {string|number} id - User ID
 * @returns {Promise} Response data
 */
export const deleteUser = async (id) => {
  try {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete user error:', error);
    throw error;
  }
};

/**
 * POST /users/{id}/admin - Set user as admin
 * @param {string|number} id - User ID
 * @param {Object} adminData - Optional admin data (isAdmin: true/false)
 * @returns {Promise} Response data
 */
export const setUserAsAdmin = async (id, adminData = { isAdmin: true }) => {
  try {
    const response = await apiClient.post(`/users/${id}/admin`, adminData);
    return response.data;
  } catch (error) {
    console.error('Set user as admin error:', error);
    throw error;
  }
};

/**
 * GET /users/{id}/admin - Get admin status of user
 * @param {string|number} id - User ID
 * @returns {Promise} Response data with admin status
 */
export const getUserAdminStatus = async (id) => {
  try {
    const response = await apiClient.get(`/users/${id}/admin`);
    return response.data;
  } catch (error) {
    console.error('Get user admin status error:', error);
    throw error;
  }
};

