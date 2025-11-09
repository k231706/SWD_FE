import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { googleSignIn, signIn as apiSignIn } from '../api/auth';
import { signInWithGoogle as firebaseSignInWithGoogle } from '../firebase/auth';
import {
  getAllUsers as apiGetAllUsers,
  getUserById as apiGetUserById,
  createUser as apiCreateUser,
  updateUser as apiUpdateUser,
  deleteUser as apiDeleteUser,
  setUserAsAdmin as apiSetUserAsAdmin,
  getUserAdminStatus as apiGetUserAdminStatus
} from '../api/users';
import {
  getAllLabs as apiGetAllLabs,
  getLabById as apiGetLabById,
  createLab as apiCreateLab,
  updateLab as apiUpdateLab,
  deleteLab as apiDeleteLab,
  updateLabStatus as apiUpdateLabStatus,
  assignRoomSlotsByDate as apiAssignRoomSlotsByDate,
  getRoomSlotsByLabId as apiGetRoomSlotsByLabId
} from '../api/labs';
import {
  getAllBookings as apiGetAllBookings,
  getBookingById as apiGetBookingById,
  createBooking as apiCreateBooking,
  updateBooking as apiUpdateBooking,
  deleteBooking as apiDeleteBooking,
  approveBooking as apiApproveBooking,
  rejectBooking as apiRejectBooking,
  getPendingBookings as apiGetPendingBookings
} from '../api/bookings';

// Auth Store
export const useAuthStore = create(
  devtools(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      users: [],

      login: async (email, password) => {
        set({ isLoading: true });

        try {
          // Call API
          const response = await apiSignIn(email, password);
          
          // Save token if provided
          if (response.token || response.accessToken) {
            localStorage.setItem('token', response.token || response.accessToken);
          }
          
          // Store user info
          set({ 
            user: response.user || {}, 
            isAuthenticated: true, 
            isLoading: false 
          });
          return { success: true };
        } catch (error) {
          console.error('Login failed:', error);
          set({ isLoading: false });
          
          // Return detailed error information
          const errorMessage = error.response?.data?.message || 
                              error.response?.data?.error || 
                              error.message || 
                              'Đăng nhập thất bại';
          
          const statusCode = error.response?.status;
          
          return { 
            success: false, 
            error: errorMessage,
            statusCode: statusCode
          };
        }
      },

      loginWithGoogle: async (token) => {
        set({ isLoading: true });

        try {
          // Call Google Sign In API
          const response = await googleSignIn(token);
          
          // Save token if provided
          if (response.token || response.accessToken) {
            localStorage.setItem('token', response.token || response.accessToken);
          }
          
          // Store user info
          set({ 
            user: response.user || {}, 
            isAuthenticated: true, 
            isLoading: false 
          });
          return true;
        } catch (error) {
          console.error('Google login failed:', error);
          set({ isLoading: false });
          return false;
        }
      },

      loginWithGoogleFirebase: async () => {
        set({ isLoading: true });

        try {
          // Sign in with Firebase Google
          const result = await firebaseSignInWithGoogle();
          
          // Optionally send token to backend
          try {
            const response = await googleSignIn(result.idToken);
            
            // Save token if provided
            if (response.token || response.accessToken) {
              localStorage.setItem('token', response.token || response.accessToken);
            }
            
            // If backend returns user info, use it
            set({ 
              user: response.user || result.user, 
              isAuthenticated: true, 
              isLoading: false 
            });
          } catch (backendError) {
            // If backend fails, use Firebase user directly
            console.warn('Backend login failed, using Firebase user:', backendError);
            // Save Firebase ID token for API calls
            if (result.idToken) {
              localStorage.setItem('token', result.idToken);
            }
            set({ 
              user: {
                id: result.user.uid,
                email: result.user.email,
                name: result.user.displayName || result.user.email,
                photoURL: result.user.photoURL,
              }, 
              isAuthenticated: true, 
              isLoading: false 
            });
          }
          
          return true;
        } catch (error) {
          console.error('Firebase Google login failed:', error);
          set({ isLoading: false });
          return false;
        }
      },

      register: async (userData) => {
        set({ isLoading: true });

        try {
          // Call API to create user
          const newUser = await apiCreateUser(userData);
          
          // Save token if provided
          if (newUser.token || newUser.accessToken) {
            localStorage.setItem('token', newUser.token || newUser.accessToken);
          }
          
          set({
            user: newUser,
            isAuthenticated: true,
            isLoading: false,
          });

          return true;
        } catch (error) {
          console.error('Register failed:', error);
          set({ isLoading: false });
          return false;
        }
      },

      logout: () => {
        // Clear token from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('accessToken');
        set({ user: null, isAuthenticated: false, users: [] });
      },

      updateUser: (userData) => {
        const { user } = get();
        if (user) {
          const updatedUser = { ...user, ...userData };
          set({ user: updatedUser });
        }
      },

      // Fetch all users from API
      fetchAllUsers: async () => {
        set({ isLoading: true });
        try {
          const users = await apiGetAllUsers();
          const normalizedUsers = Array.isArray(users) ? users : [];
          set({ users: normalizedUsers, isLoading: false });
          return normalizedUsers;
        } catch (error) {
          console.error('Failed to fetch users:', error);
          set({ users: [], isLoading: false });
          throw error;
        }
      },

      // Get user by ID from API
      fetchUserById: async (id) => {
        set({ isLoading: true });
        try {
          const user = await apiGetUserById(id);
          set({ isLoading: false });
          return user;
        } catch (error) {
          console.error('Failed to fetch user by ID:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      // Create new user via API
      createUser: async (userData) => {
        set({ isLoading: true });
        try {
          const newUser = await apiCreateUser(userData);
          const { users } = get();
          set({ users: [newUser, ...users], isLoading: false });
          return newUser;
        } catch (error) {
          console.error('Failed to create user:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      // Update user via API
      updateUserById: async (id, userData) => {
        set({ isLoading: true });
        try {
          const updatedUser = await apiUpdateUser(id, userData);
          const { users } = get();
          const updatedUsers = users.map((u) => 
            (u.userId === id || u.id === id) ? updatedUser : u
          );
          set({ users: updatedUsers, isLoading: false });
          return updatedUser;
        } catch (error) {
          console.error('Failed to update user:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      // Delete user via API
      deleteUserById: async (id) => {
        set({ isLoading: true });
        try {
          await apiDeleteUser(id);
          const { users } = get();
          const filteredUsers = users.filter((u) => u.userId !== id && u.id !== id);
          set({ users: filteredUsers, isLoading: false });
          return true;
        } catch (error) {
          console.error('Failed to delete user:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      // Set user as admin via API
      setUserAsAdmin: async (id, adminData = { isAdmin: true }) => {
        set({ isLoading: true });
        try {
          const result = await apiSetUserAsAdmin(id, adminData);
          // Refresh users list
          const users = await apiGetAllUsers();
          set({ users: Array.isArray(users) ? users : [], isLoading: false });
          return result;
        } catch (error) {
          console.error('Failed to set user as admin:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      // Get user admin status via API
      getUserAdminStatus: async (id) => {
        set({ isLoading: true });
        try {
          const status = await apiGetUserAdminStatus(id);
          set({ isLoading: false });
          return status;
        } catch (error) {
          console.error('Failed to get user admin status:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      // Legacy methods (for backward compatibility)
      getAllUsers: () => {
        return get().users;
      },

      getUserByEmail: (email) => {
        const { users } = get();
        return users.find((u) => u.email === email);
      },
    }),
    { name: 'auth-store' }
  )
);

// Lab Store
export const useLabStore = create(
  devtools(
    (set, get) => ({
      labs: [],
      departments: [],
      selectedLab: null,
      isLoading: false,

      // GET /labs - Get all labs
      fetchLabs: async () => {
        set({ isLoading: true });
        try {
          const labs = await apiGetAllLabs();
          const labsArray = Array.isArray(labs) ? labs : [];
          set({ labs: labsArray, isLoading: false });
          return labsArray;
        } catch (error) {
          console.error('Failed to fetch labs:', error);
          set({ labs: [], isLoading: false });
          throw error;
        }
      },

      // GET /labs/{id} - Get lab by ID
      fetchLabById: async (id) => {
        set({ isLoading: true });
        try {
          const lab = await apiGetLabById(id);
          set({ isLoading: false });
          return lab;
        } catch (error) {
          console.error('Failed to fetch lab by ID:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      // POST /labs - Create new lab
      createLab: async (labData) => {
        set({ isLoading: true });
        try {
          const newLab = await apiCreateLab(labData);
          const { labs } = get();
          set({ labs: [newLab, ...labs], isLoading: false });
          return newLab;
        } catch (error) {
          console.error('Failed to create lab:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      // PUT /labs/{id} - Update lab by ID
      updateLab: async (id, labData) => {
        set({ isLoading: true });
        try {
          const updatedLab = await apiUpdateLab(id, labData);
          const { labs } = get();
          const updatedLabs = labs.map((l) => 
            (l.labId === id || l.id === id) ? updatedLab : l
          );
          set({ labs: updatedLabs, isLoading: false });
          return updatedLab;
        } catch (error) {
          console.error('Failed to update lab:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      // DELETE /labs/{id} - Delete lab by ID
      deleteLab: async (id) => {
        set({ isLoading: true });
        try {
          await apiDeleteLab(id);
          const { labs } = get();
          const filteredLabs = labs.filter((l) => l.labId !== id && l.id !== id);
          set({ labs: filteredLabs, isLoading: false });
          return true;
        } catch (error) {
          console.error('Failed to delete lab:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      // PATCH /labs/{id}/status - Update lab status
      updateLabStatus: async (id, statusData) => {
        set({ isLoading: true });
        try {
          const updatedLab = await apiUpdateLabStatus(id, statusData);
          const { labs } = get();
          const updatedLabs = labs.map((l) => 
            (l.labId === id || l.id === id) ? updatedLab : l
          );
          set({ labs: updatedLabs, isLoading: false });
          return updatedLab;
        } catch (error) {
          console.error('Failed to update lab status:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      // POST /labs/assign-roomslots-by-date - Assign room slots by date
      assignRoomSlotsByDate: async (assignData) => {
        set({ isLoading: true });
        try {
          const result = await apiAssignRoomSlotsByDate(assignData);
          set({ isLoading: false });
          return result;
        } catch (error) {
          console.error('Failed to assign room slots by date:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      // GET /labs/{labId}/room-slots - Get room slots by lab ID
      fetchRoomSlotsByLabId: async (labId, date = null) => {
        set({ isLoading: true });
        try {
          const roomSlots = await apiGetRoomSlotsByLabId(labId, date);
          set({ isLoading: false });
          return Array.isArray(roomSlots) ? roomSlots : [];
        } catch (error) {
          console.error('Failed to fetch room slots by lab ID:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      fetchDepartments: async () => {
        set({ isLoading: true });
        try {
          // TODO: Call departments API when available
          // const response = await apiClient.get('/departments');
          // set({ departments: response.data, isLoading: false });
          set({ departments: [], isLoading: false });
        } catch (error) {
          console.error('Failed to fetch departments:', error);
          set({ departments: [], isLoading: false });
        }
      },

      selectLab: (lab) => {
        set({ selectedLab: lab });
      },
    }),
    { name: 'lab-store' }
  )
);

// Booking Store
export const useBookingStore = create(
  devtools(
    (set, get) => ({
      bookings: [],
      pendingBookings: [],
      isLoading: false,

      // GET /bookings - Get all bookings
      fetchBookings: async (filters = {}) => {
        set({ isLoading: true });
        try {
          const bookings = await apiGetAllBookings(filters);
          const bookingsArray = Array.isArray(bookings) ? bookings : [];
          set({ bookings: bookingsArray, isLoading: false });
          return bookingsArray;
        } catch (error) {
          console.error('Failed to fetch bookings:', error);
          set({ bookings: [], isLoading: false });
          throw error;
        }
      },

      // GET /bookings/pending - Get pending bookings
      fetchPendingBookings: async () => {
        set({ isLoading: true });
        try {
          const pendingBookings = await apiGetPendingBookings();
          const pendingArray = Array.isArray(pendingBookings) ? pendingBookings : [];
          set({ pendingBookings: pendingArray, isLoading: false });
          return pendingArray;
        } catch (error) {
          console.error('Failed to fetch pending bookings:', error);
          set({ pendingBookings: [], isLoading: false });
          throw error;
        }
      },

      // GET /bookings/{id} - Get booking by ID
      fetchBookingById: async (id) => {
        set({ isLoading: true });
        try {
          const booking = await apiGetBookingById(id);
          set({ isLoading: false });
          return booking;
        } catch (error) {
          console.error('Failed to fetch booking by ID:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      // POST /bookings - Create new booking
      createBooking: async (bookingData) => {
        set({ isLoading: true });
        try {
          const newBooking = await apiCreateBooking(bookingData);
          const { bookings, pendingBookings } = get();
          const updatedBookings = [newBooking, ...bookings];
          const updatedPending = newBooking.status === 'pending' 
            ? [newBooking, ...pendingBookings] 
            : pendingBookings;
          set({
            bookings: updatedBookings,
            pendingBookings: updatedPending,
            isLoading: false,
          });
          return newBooking;
        } catch (error) {
          console.error('Failed to create booking:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      // PUT /bookings/{id} - Update booking
      updateBooking: async (id, bookingData) => {
        set({ isLoading: true });
        try {
          const updatedBooking = await apiUpdateBooking(id, bookingData);
          const { bookings, pendingBookings } = get();
          const updatedBookings = bookings.map((b) => 
            (b.bookingId === id || b.id === id) ? updatedBooking : b
          );
          const updatedPending = updatedBooking.status === 'pending'
            ? pendingBookings.map((b) => 
                (b.bookingId === id || b.id === id) ? updatedBooking : b
              )
            : pendingBookings.filter((b) => b.bookingId !== id && b.id !== id);
          set({
            bookings: updatedBookings,
            pendingBookings: updatedPending,
            isLoading: false,
          });
          return updatedBooking;
        } catch (error) {
          console.error('Failed to update booking:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      // DELETE /bookings/{id} - Delete booking
      deleteBooking: async (id) => {
        set({ isLoading: true });
        try {
          await apiDeleteBooking(id);
          const { bookings, pendingBookings } = get();
          const filteredBookings = bookings.filter((b) => b.bookingId !== id && b.id !== id);
          const filteredPending = pendingBookings.filter((b) => b.bookingId !== id && b.id !== id);
          set({
            bookings: filteredBookings,
            pendingBookings: filteredPending,
            isLoading: false,
          });
          return true;
        } catch (error) {
          console.error('Failed to delete booking:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      // PATCH /bookings/{id}/approve - Approve booking
      approveBooking: async (bookingId, approveData = {}) => {
        set({ isLoading: true });
        try {
          const updatedBooking = await apiApproveBooking(bookingId, approveData);
          const { bookings, pendingBookings } = get();
          const updatedBookings = bookings.map((b) => 
            (b.bookingId === bookingId || b.id === bookingId) ? updatedBooking : b
          );
          const updatedPending = pendingBookings.filter(
            (b) => b.bookingId !== bookingId && b.id !== bookingId
          );
          set({
            bookings: updatedBookings,
            pendingBookings: updatedPending,
            isLoading: false,
          });
          return updatedBooking;
        } catch (error) {
          console.error('Failed to approve booking:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      // PATCH /bookings/{id}/reject - Reject booking
      rejectBooking: async (bookingId, rejectData) => {
        set({ isLoading: true });
        try {
          const updatedBooking = await apiRejectBooking(bookingId, rejectData);
          const { bookings, pendingBookings } = get();
          const updatedBookings = bookings.map((b) => 
            (b.bookingId === bookingId || b.id === bookingId) ? updatedBooking : b
          );
          const updatedPending = pendingBookings.filter(
            (b) => b.bookingId !== bookingId && b.id !== bookingId
          );
          set({
            bookings: updatedBookings,
            pendingBookings: updatedPending,
            isLoading: false,
          });
          return updatedBooking;
        } catch (error) {
          console.error('Failed to reject booking:', error);
          set({ isLoading: false });
          throw error;
        }
      },
    }),
    { name: 'booking-store' }
  )
);

// Event Store
export const useEventStore = create(
  devtools(
    (set, get) => ({
      events: [],
      isLoading: false,

      addEvent: async (eventData) => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 500));

        const newEvent = {
          ...eventData,
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
        };

        const { events } = get();
        set({ events: [newEvent, ...events], isLoading: false });

        return true;
      },

      fetchEvents: async (labId) => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 500));
        set({ events: [], isLoading: false });
      },
    }),
    { name: 'event-store' }
  )
);

// Notification Store
export const useNotificationStore = create(
  devtools(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      isLoading: false,

      fetchNotifications: async () => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 500));
        set({ notifications: [], unreadCount: 0, isLoading: false });
      },

      markAsRead: async (notificationId) => {
        const { notifications } = get();
        const updatedNotifications = notifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        );
        const unreadCount = updatedNotifications.filter((n) => !n.isRead).length;
        set({ notifications: updatedNotifications, unreadCount });
      },

      markAllAsRead: async () => {
        const { notifications } = get();
        const updatedNotifications = notifications.map((notification) => ({
          ...notification,
          isRead: true,
        }));
        set({ notifications: updatedNotifications, unreadCount: 0 });
      },
    }),
    { name: 'notification-store' }
  )
);
