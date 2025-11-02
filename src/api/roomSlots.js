import { apiClient } from './config';

// GET /room-slots/slot/{slotId} - Get room slot by slot ID
export const getRoomSlotBySlotId = async (slotId) => {
  try {
    const response = await apiClient.get(`/room-slots/slot/${slotId}`);
    return response.data;
  } catch (error) {
    console.error('Get room slot by slot ID error:', error);
    throw error;
  }
};

