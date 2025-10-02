import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store";
import { Users, Search, Filter, Eye } from "lucide-react";
import "../styles/UserManagementPage.css";

export const UserManagementPage = () => {
  const { getAllUsers } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    const allUsers = getAllUsers();
    setUsers(allUsers);
    setFilteredUsers(allUsers);
  }, [getAllUsers]);

  useEffect(() => {
    let filtered = users;
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.department &&
            user.department.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }
    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter]);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  return (
    <div className="user-management">
      <header className="user-management__header">
        <h1 className="title">Quản lý người dùng</h1>
        <p className="header-subtitle">Quản lý thông tin và quyền hạn người dùng trong hệ thống</p>
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

            {filteredUsers.length > 0 ? (
              <div className="user-grid">
                <table>
                  <thead>
                    <tr>
                      <th>Avatar</th>
                      <th>Tên</th>
                      <th>Email</th>
                      <th>Vai trò</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="avatar">
                            {user.name[0].toUpperCase()}
                          </div>
                        </td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                          <button
                            className="btn btn-view"
                            onClick={() => handleViewUser(user)}
                          >
                            <Eye size={14} /> Xem
                          </button>
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

            {showUserModal && (
              <div className="user-management-modal">
                <div className="modal-content">
                  <h3>{selectedUser.name}</h3>
                  <p>Email: {selectedUser.email}</p>
                  <p>Vai trò: {selectedUser.role}</p>
                  <button onClick={() => setShowUserModal(false)}>Đóng</button>
                </div>
              </div>
            )}
        </div>
      </div>
  );
};
