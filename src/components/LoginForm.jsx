import React, { useState } from "react";
import { useAuthStore } from "../store";
import { Eye, EyeOff, LogIn, User, Lock, UserPlus } from "lucide-react";
import "../styles/LoginForm.css";

export const LoginForm = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { login, isLoading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const success = await login(email, password);
    if (!success) {
      setError("Email hoặc mật khẩu không đúng");
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        {/* Header */}
        <div className="login-header">
          <div className="logo-circle">
            <User className="logo-icon" />
          </div>
          <h2>Quản lý Lab</h2>
          <p>Đăng nhập vào hệ thống quản lý phòng lab</p>
        </div>

        {/* Login Form */}
        <div className="login-card">
          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-box">{error}</div>}

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <User className="input-icon" />
                <input
                  id="email"
                  type="email"
                  placeholder="admin@university.edu.vn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    paddingLeft: "45px",
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  {showPassword ? <Eye /> : <EyeOff />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="submit-btn-login" disabled={isLoading}>
              {isLoading ? (
                <div className="spinner"></div>
              ) : (
                <>
                  <LogIn className="btn-icon" />
                  Đăng nhập
                </>
              )}
            </button>
          </form>

          {/* Demo + Register */}
          <div className="demo-section">
            <div className="demo-info">
              <p className="demo-title">Tài khoản demo có sẵn:</p>
              <p>• admin@university.edu.vn (Quản lý Lab)</p>
              <p>• student@university.edu.vn (Sinh viên)</p>
              <p>• security@university.edu.vn (Bảo vệ)</p>
              <p>• staff@university.edu.vn (Nhân viên)</p>
              <p className="demo-pass">Mật khẩu: password</p>
            </div>
            <button className="register-btn" onClick={onSwitchToRegister}>
              <UserPlus className="btn-icon" />
              Tạo tài khoản mới
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
