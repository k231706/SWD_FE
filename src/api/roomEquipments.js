import { apiClient } from './config';

// GET /room-equipments - Get all room equipments
export const getAllRoomEquipments = async () => {
  try {
    const response = await apiClient.get('/room-equipments');
    return response.data;
  } catch (error) {
    console.error('Get all room equipments error:', error);
    throw error;
  }
};

// GET /room-equipments/{id} - Get room equipment by ID
export const getRoomEquipmentById = async (id) => {
  try {
    const response = await apiClient.get(`/room-equipments/${id}`);
    return response.data;
  } catch (error) {
    console.error('Get room equipment by ID error:', error);
    throw error;
  }
};

// POST /room-equipments - Create new room equipment
export const createRoomEquipment = async (roomEquipmentData) => {
  try {
    const response = await apiClient.post('/room-equipments', roomEquipmentData);
    return response.data;
  } catch (error) {
    console.error('Create room equipment error:', error);
    throw error;
  }
};

// PUT /room-equipments/{id} - Update room equipment by ID
export const updateRoomEquipment = async (id, roomEquipmentData) => {
  try {
    const response = await apiClient.put(`/room-equipments/${id}`, roomEquipmentData);
    return response.data;
  } catch (error) {
    console.error('Update room equipment error:', error);
    throw error;
  }
};

// DELETE /room-equipments/{id} - Delete room equipment by ID
export const deleteRoomEquipment = async (id) => {
  try {
    const response = await apiClient.delete(`/room-equipments/${id}`);
    return response.data;
  } catch (error) {
    console.error('Delete room equipment error:', error);
    throw error;
  }
};

