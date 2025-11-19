// File: src/pages/customer/Register.jsx

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// 💡 Import hàm register từ file utils/auth.js
import { register } from "../../utils/auth";

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    setError(""); // Xóa lỗi cũ // --- 1. Kiểm tra xác thực cơ bản ---

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (!email || !password) {
      setError("Vui lòng điền đầy đủ email và mật khẩu.");
      return;
    }

    setIsSubmitting(true); // --- 2. Gọi hàm register (Mock bằng LocalStorage) ---

    const result = register({ email, password });

    setIsSubmitting(false); // --- 3. Xử lý kết quả ---

    if (result.success) {
      alert(result.message); // Thông báo Đăng ký thành công
      navigate("/login"); // Chuyển hướng đến trang Đăng nhập
    } else {
      setError(result.message); // Hiển thị lỗi (ví dụ: Email đã tồn tại)
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "40px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "5px",
      }}
    >
            <h2>Đăng ký Tài khoản</h2>     {" "}
      <form onSubmit={handleRegister}>
                {/* Input Email */}
               {" "}
        <input
          type="email"
          placeholder="Email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
                {/* Input Mật khẩu */}
               {" "}
        <input
          type="password"
          placeholder="Mật khẩu..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />
                {/* Input Xác nhận Mật khẩu */}
               {" "}
        <input
          type="password"
          placeholder="Xác nhận Mật khẩu..."
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={inputStyle}
        />
                {/* Hiển thị Lỗi */}       {" "}
        {error && (
          <div style={{ marginBottom: 10, color: "red", fontWeight: "bold" }}>
            {error}
          </div>
        )}
                {/* Nút Đăng ký */}       {" "}
        <button type="submit" disabled={isSubmitting} style={buttonStyle}>
                    {isSubmitting ? "Đang xử lý..." : "Đăng ký"}       {" "}
        </button>
        {/* Link chuyển về Đăng nhập */}
        <p style={{ marginTop: "15px", textAlign: "center" }}>
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
             {" "}
      </form>
         {" "}
    </div>
  );
};

// Định nghĩa style cho input và button để code dễ đọc hơn
const inputStyle = {
  display: "block",
  width: "100%",
  padding: 10,
  marginBottom: 15,
  border: "1px solid #ddd",
  borderRadius: "4px",
  boxSizing: "border-box",
};

const buttonStyle = {
  width: "100%",
  padding: 12,
  background: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "bold",
};

export default Register;
