import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Mock data for development
const mockUsers = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    email: 'admin@university.edu.vn',
    role: 'lab_manager',
    department: 'Khoa Công nghệ Thông tin',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Trần Thị B',
    email: 'student@university.edu.vn',
    role: 'lab_member',
    department: 'Khoa Công nghệ Thông tin',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Nguyễn Văn C',
    email: 'security@university.edu.vn',
    role: 'security_guard',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Lê Thị D',
    email: 'staff@university.edu.vn',
    role: 'staff',
    department: 'Phòng Đào tạo',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

const mockLabs = [
  {
    id: '1',
    name: 'Lab Tin học 1',
    description: 'Phòng lab tin học cơ bản với 30 máy tính',
    location: 'Tầng 2, Tòa A',
    capacity: 30,
    equipment: ['Máy tính PC', 'Máy chiếu', 'Điều hòa', 'Camera an ninh'],
    departmentId: '1',
    isAvailable: true,
    operatingHours: { start: '07:00', end: '22:00' },
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Lab Mạng máy tính',
    description: 'Phòng lab chuyên về mạng và bảo mật',
    location: 'Tầng 3, Tòa A',
    capacity: 25,
    equipment: ['Router Cisco', 'Switch', 'Cable tester', 'Máy tính chuyên dụng'],
    departmentId: '1',
    isAvailable: true,
    operatingHours: { start: '08:00', end: '20:00' },
    createdAt: new Date().toISOString(),
  },
];

const mockDepartments = [
  {
    id: '1',
    name: 'Khoa Công nghệ Thông tin',
    description: 'Khoa đào tạo về tin học và công nghệ thông tin',
    labManagerIds: ['1'],
    createdAt: new Date().toISOString(),
  },
];

// Utility function to load users from localStorage or use mock data
const loadUsers = () => {
  try {
    const stored = localStorage.getItem('lab_users');
    return stored ? JSON.parse(stored) : mockUsers;
  } catch {
    return mockUsers;
  }
};

const saveUsers = (users) => {
  try {
    localStorage.setItem('lab_users', JSON.stringify(users));
  } catch (error) {
    console.warn('Could not save users to localStorage:', error);
  }
};

// Auth Store
export const useAuthStore = create(
  devtools(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      users: loadUsers(),

      login: async (email, password) => {
        set({ isLoading: true });

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const { users } = get();
        const user = users.find((u) => u.email === email);

        if (user && password === 'password') {
          set({ user, isAuthenticated: true, isLoading: false });
          return true;
        }

        set({ isLoading: false });
        return false;
      },

      register: async (userData) => {
        set({ isLoading: true });

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const { users } = get();

        const existingUser = users.find((u) => u.email === userData.email);
        if (existingUser) {
          set({ isLoading: false });
          return false;
        }

        const newUser = {
          id: Date.now().toString(),
          name: userData.name,
          email: userData.email,
          role: userData.role,
          department: userData.department,
          isActive: true,
          createdAt: new Date().toISOString(),
        };

        const updatedUsers = [...users, newUser];
        saveUsers(updatedUsers);

        set({
          users: updatedUsers,
          user: newUser,
          isAuthenticated: true,
          isLoading: false,
        });

        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateUser: (userData) => {
        const { user, users } = get();
        if (user) {
          const updatedUser = { ...user, ...userData };
          const updatedUsers = users.map((u) =>
            u.id === user.id ? updatedUser : u
          );

          saveUsers(updatedUsers);
          set({ user: updatedUser, users: updatedUsers });
        }
      },

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
    (set) => ({
      labs: [],
      departments: [],
      selectedLab: null,
      isLoading: false,

      fetchLabs: async () => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 500));
        set({ labs: mockLabs, isLoading: false });
      },

      fetchDepartments: async () => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 500));
        set({ departments: mockDepartments, isLoading: false });
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

      createBooking: async (bookingData) => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const newBooking = {
          ...bookingData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const { bookings, pendingBookings } = get();
        set({
          bookings: [...bookings, newBooking],
          pendingBookings: [...pendingBookings, newBooking],
          isLoading: false,
        });

        return true;
      },

      approveBooking: async (bookingId) => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 500));

        const { bookings, pendingBookings } = get();
        const updatedBookings = bookings.map((booking) =>
          booking.id === bookingId
            ? {
                ...booking,
                status: 'approved',
                updatedAt: new Date().toISOString(),
              }
            : booking
        );
        const updatedPendingBookings = pendingBookings.filter(
          (booking) => booking.id !== bookingId
        );

        set({
          bookings: updatedBookings,
          pendingBookings: updatedPendingBookings,
          isLoading: false,
        });

        return true;
      },

      rejectBooking: async (bookingId, reason) => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 500));

        const { bookings, pendingBookings } = get();
        const updatedBookings = bookings.map((booking) =>
          booking.id === bookingId
            ? {
                ...booking,
                status: 'rejected',
                rejectedReason: reason,
                updatedAt: new Date().toISOString(),
              }
            : booking
        );
        const updatedPendingBookings = pendingBookings.filter(
          (booking) => booking.id !== bookingId
        );

        set({
          bookings: updatedBookings,
          pendingBookings: updatedPendingBookings,
          isLoading: false,
        });

        return true;
      },

      fetchBookings: async () => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 500));
        set({ bookings: [], isLoading: false });
      },

      fetchPendingBookings: async () => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 500));
        set({ pendingBookings: [], isLoading: false });
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
