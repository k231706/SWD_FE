import React, { useState } from "react";
import { useAuthStore } from "../store";
import { Eye, EyeOff, LogIn, User, Lock, UserPlus } from "lucide-react";
import "../styles/LoginForm.css";

export const LoginForm = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { login, loginWithGoogleFirebase, isLoading } = useAuthStore();

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

  const handleGoogleLogin = async () => {
    setError("");
    
    try {
      const success = await loginWithGoogleFirebase();
      if (!success) {
        setError("Đăng nhập bằng Google thất bại");
      }
    } catch (err) {
      console.error("Google login error:", err);
      setError("Đăng nhập bằng Google thất bại. Vui lòng thử lại.");
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

          {/* Divider */}
          <div className="divider">
            <div className="divider-line"></div>
            <span className="divider-text">hoặc</span>
            <div className="divider-line"></div>
          </div>

          {/* Google Login */}
          <button 
            type="button" 
            className="google-btn" 
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <svg className="google-icon" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Đăng nhập với Google
          </button>

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
