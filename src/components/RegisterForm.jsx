import React, { useState } from "react";
import { useAuthStore } from "../store";
import {
  Eye,
  EyeOff,
  UserPlus,
  User,
  Lock,
  Mail,
  Building,
  Users,
} from "lucide-react";
import "../styles/RegisterForm.css";

export const RegisterForm = ({ onBackToLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "lab_member",
    department: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const { register, isLoading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    const success = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      department: formData.department || undefined,
    });

    if (!success) {
      setError("Đăng ký thất bại. Email có thể đã được sử dụng.");
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  return (
    <div className="register-page">
      <div className="register-wrapper">
        {/* Header */}
        <div className="register-header">
          <div className="logo-circle green">
            <UserPlus className="logo-icon" />
          </div>
          <h2>Đăng ký tài khoản</h2>
          <p>Tạo tài khoản mới cho hệ thống quản lý lab</p>
        </div>

        {/* Register Form */}
        <div className="register-card">
          <form onSubmit={handleSubmit} className="register-form">
            {error && <div className="error-box">{error}</div>}

            {/* Name */}
            <div className="form-group">
              <label>Họ và tên</label>
              <div className="input-wrapper">
                <User className="input-icon" />
                <input
                  type="text"
                  placeholder="Nhập họ và tên"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  style={{
                    paddingLeft: "45px",
                  }}
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label>Email</label>
              <div className="input-wrapper">
                <Mail className="input-icon" />
                <input
                  type="email"
                  placeholder="example@university.edu.vn"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  style={{
                    paddingLeft: "45px",
                  }}
                />
              </div>
            </div>

            {/* Role */}
            <div className="form-group">
              <label>Vai trò</label>
              <div className="input-wrapper">
                <Users className="input-icon" />
                <select
                  value={formData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  style={{
                    paddingLeft: "45px",
                  }}
                >
                  <option value="lab_member">
                    Thành viên Lab (Sinh viên/Giảng viên)
                  </option>
                  <option value="staff">Nhân viên</option>
                  <option value="lab_manager">Quản lý Lab</option>
                  <option value="security_guard">Bảo vệ</option>
                </select>
              </div>
            </div>

            {/* Department */}
            <div className="form-group">
              <label>Bộ môn/Khoa (tuỳ chọn)</label>
              <div className="input-wrapper">
                <Building className="input-icon" />
                <input
                  type="text"
                  placeholder="Khoa Công nghệ Thông tin"
                  value={formData.department}
                  onChange={(e) =>
                    handleInputChange("department", e.target.value)
                  }
                  style={{
                    paddingLeft: "45px",
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label>Mật khẩu</label>
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                  style={{
                    paddingLeft: "45px",
                  }}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label>Xác nhận mật khẩu</label>
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  required
                  style={{
                    paddingLeft: "45px",
                  }}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="submit-btn green" disabled={isLoading}>
              {isLoading ? (
                <div className="spinner"></div>
              ) : (
                <>
                  <UserPlus className="btn-icon" />
                  Đăng ký
                </>
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="back-to-login">
            <button onClick={onBackToLogin}>
              Đã có tài khoản? Đăng nhập ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
