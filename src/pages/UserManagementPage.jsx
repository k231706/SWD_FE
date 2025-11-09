import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  setUserAsAdmin,
  getUserAdminStatus
} from "../api/users";
import { Users, Search, Filter, Eye, Edit, Trash2, UserPlus, Shield, RefreshCw } from "lucide-react";
import "../styles/UserManagementPage.css";

export const UserManagementPage = () => {
  const { isLoading: storeLoading } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    fullName: '',
    phone: '',
    role: 'lab_member',
    password: '',
  });

  // Load users from API
  const loadUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const allUsers = await getAllUsers();
      const usersArray = Array.isArray(allUsers) ? allUsers : [];
      setUsers(usersArray);
      setFilteredUsers(usersArray);
    } catch (error) {
      console.error('Failed to load users:', error);
      setError('Không thể tải danh sách người dùng. Vui lòng thử lại.');
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    let filtered = users;
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          (user.fullName || user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.phone || '').includes(searchTerm)
      );
    }
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => (user.role || '').toLowerCase() === roleFilter.toLowerCase());
    }
    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter]);

  const handleViewUser = async (user) => {
    setIsLoading(true);
    try {
      // Fetch full user details by ID
      const userId = user.userId || user.id;
      const fullUser = await getUserById(userId);
      setSelectedUser(fullUser);
      setShowUserModal(true);
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      setSelectedUser(user);
      setShowUserModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData({
      email: user.email || '',
      username: user.username || '',
      fullName: user.fullName || user.name || '',
      phone: user.phone || '',
      role: user.role || 'lab_member',
      password: '',
    });
    setShowEditModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      return;
    }

    setIsLoading(true);
    try {
      await deleteUser(userId);
      setSuccess('Xóa người dùng thành công!');
      await loadUsers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Failed to delete user:', error);
      setError('Không thể xóa người dùng. Vui lòng thử lại.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await createUser(formData);
      setSuccess('Tạo người dùng thành công!');
      setShowCreateModal(false);
      setFormData({
        email: '',
        username: '',
        fullName: '',
        phone: '',
        role: 'lab_member',
        password: '',
      });
      await loadUsers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Failed to create user:', error);
      setError(error.response?.data?.message || 'Không thể tạo người dùng. Vui lòng thử lại.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    setIsLoading(true);
    setError(null);
    try {
      const userId = selectedUser.userId || selectedUser.id;
      const updateData = { ...formData };
      // Don't send password if empty
      if (!updateData.password) {
        delete updateData.password;
      }
      await updateUser(userId, updateData);
      setSuccess('Cập nhật người dùng thành công!');
      setShowEditModal(false);
      await loadUsers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Failed to update user:', error);
      setError(error.response?.data?.message || 'Không thể cập nhật người dùng. Vui lòng thử lại.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAdmin = async (user) => {
    setIsLoading(true);
    setError(null);
    try {
      const userId = user.userId || user.id;
      const currentAdminStatus = user.isAdmin || user.admin || false;
      await setUserAsAdmin(userId, { isAdmin: !currentAdminStatus });
      setSuccess(`Đã ${!currentAdminStatus ? 'cấp' : 'hủy'} quyền admin cho người dùng!`);
      await loadUsers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Failed to toggle admin status:', error);
      setError('Không thể thay đổi quyền admin. Vui lòng thử lại.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetAdminStatus = async (user) => {
    setIsLoading(true);
    try {
      const userId = user.userId || user.id;
      const status = await getUserAdminStatus(userId);
      alert(`Trạng thái admin: ${status.isAdmin ? 'Có' : 'Không'}`);
    } catch (error) {
      console.error('Failed to get admin status:', error);
      alert('Không thể lấy trạng thái admin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user-management">
      <header className="user-management__header">
        <h1 className="title">Quản lý người dùng</h1>
        <p className="header-subtitle">Quản lý thông tin và quyền hạn người dùng trong hệ thống</p>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            className="btn btn-primary"
            onClick={() => {
              setFormData({
                email: '',
                username: '',
                fullName: '',
                phone: '',
                role: 'lab_member',
                password: '',
              });
              setShowCreateModal(true);
            }}
            disabled={isLoading}
          >
            <UserPlus size={16} /> Tạo người dùng mới
          </button>
          <button
            className="btn btn-secondary"
            onClick={loadUsers}
            disabled={isLoading}
          >
            <RefreshCw size={16} /> Làm mới
          </button>
        </div>
        {error && (
          <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#fee2e2', color: '#991b1b', borderRadius: '6px' }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#d1fae5', color: '#065f46', borderRadius: '6px' }}>
            {success}
          </div>
        )}
      </header>

        <div className="card">
          <div className="user-management__filters">
            <div className="search-box">
              <Search size={16} />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, email, bộ môn..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="filter-box">
              <Filter size={16} />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">Tất cả vai trò</option>
                  <option value="lab_manager">Quản lý Lab</option>
                  <option value="lab_member">Thành viên Lab</option>
                  <option value="staff">Nhân viên</option>
                  <option value="security_guard">Bảo vệ</option>
                </select>
              </div>
            </div>

            {isLoading || storeLoading ? (
              <div className="empty">
                <p>Đang tải danh sách người dùng...</p>
              </div>
            ) : filteredUsers.length > 0 ? (
              <div className="user-grid">
                <table>
                  <thead>
                    <tr>
                      <th>Avatar</th>
                      <th>Tên</th>
                      <th>Email</th>
                      <th>Vai trò</th>
                      <th>Admin</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.userId || user.id}>
                        <td>
                          <div className="avatar">
                            {(user.fullName || user.name || user.email || 'U')[0].toUpperCase()}
                          </div>
                        </td>
                        <td>{user.fullName || user.name || 'N/A'}</td>
                        <td>{user.email || 'N/A'}</td>
                        <td>{user.role || 'N/A'}</td>
                        <td>
                          {user.isAdmin || user.admin ? '✓' : '✗'}
                          <button
                            className="btn btn-small"
                            onClick={() => handleToggleAdmin(user)}
                            disabled={isLoading}
                            style={{ marginLeft: '8px', padding: '4px 8px' }}
                            title={user.isAdmin || user.admin ? 'Hủy quyền admin' : 'Cấp quyền admin'}
                          >
                            <Shield size={12} />
                          </button>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              className="btn btn-view"
                              onClick={() => handleViewUser(user)}
                              disabled={isLoading}
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              className="btn btn-edit"
                              onClick={() => handleEditUser(user)}
                              disabled={isLoading}
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              className="btn btn-delete"
                              onClick={() => handleDeleteUser(user.userId || user.id)}
                              disabled={isLoading}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty">
                <Users size={40} />
                <h3>Không tìm thấy người dùng</h3>
                <p>Không có người dùng nào phù hợp với tiêu chí tìm kiếm.</p>
              </div>
            )}

            {/* View User Modal */}
            {showUserModal && selectedUser && (
              <div className="user-management-modal">
                <div className="modal-content">
                  <h3>{selectedUser.fullName || selectedUser.name || 'N/A'}</h3>
                  <p><strong>Email:</strong> {selectedUser.email || 'N/A'}</p>
                  <p><strong>Username:</strong> {selectedUser.username || 'N/A'}</p>
                  <p><strong>Vai trò:</strong> {selectedUser.role || 'N/A'}</p>
                  <p><strong>Admin:</strong> {selectedUser.isAdmin || selectedUser.admin ? 'Có' : 'Không'}</p>
                  <p><strong>Phone:</strong> {selectedUser.phone || 'N/A'}</p>
                  <p><strong>User ID:</strong> {selectedUser.userId || selectedUser.id || 'N/A'}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <button onClick={() => handleGetAdminStatus(selectedUser)} disabled={isLoading}>
                      Kiểm tra Admin Status
                    </button>
                    <button onClick={() => setShowUserModal(false)}>Đóng</button>
                  </div>
                </div>
              </div>
            )}

            {/* Create User Modal */}
            {showCreateModal && (
              <div className="user-management-modal">
                <div className="modal-content" style={{ maxWidth: '500px' }}>
                  <h3>Tạo người dùng mới</h3>
                  <form onSubmit={handleCreateUser}>
                    <div style={{ marginBottom: '1rem' }}>
                      <label>Email *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label>Username *</label>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                      />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label>Họ và tên *</label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                      />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label>Số điện thoại</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label>Vai trò *</label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        required
                      >
                        <option value="lab_member">Thành viên Lab</option>
                        <option value="staff">Nhân viên</option>
                        <option value="lab_manager">Quản lý Lab</option>
                        <option value="security_guard">Bảo vệ</option>
                        <option value="supporter">Hỗ trợ viên</option>
                        <option value="admin">Quản trị viên</option>
                      </select>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label>Mật khẩu *</label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                      <button type="submit" disabled={isLoading}>Tạo</button>
                      <button type="button" onClick={() => setShowCreateModal(false)}>Hủy</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Edit User Modal */}
            {showEditModal && selectedUser && (
              <div className="user-management-modal">
                <div className="modal-content" style={{ maxWidth: '500px' }}>
                  <h3>Cập nhật người dùng</h3>
                  <form onSubmit={handleUpdateUser}>
                    <div style={{ marginBottom: '1rem' }}>
                      <label>Email *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label>Username *</label>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                      />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label>Họ và tên *</label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                      />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label>Số điện thoại</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label>Vai trò *</label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        required
                      >
                        <option value="lab_member">Thành viên Lab</option>
                        <option value="staff">Nhân viên</option>
                        <option value="lab_manager">Quản lý Lab</option>
                        <option value="security_guard">Bảo vệ</option>
                        <option value="supporter">Hỗ trợ viên</option>
                        <option value="admin">Quản trị viên</option>
                      </select>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label>Mật khẩu mới (để trống nếu không đổi)</label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                      <button type="submit" disabled={isLoading}>Cập nhật</button>
                      <button type="button" onClick={() => setShowEditModal(false)}>Hủy</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
        </div>
      </div>
  );
};
