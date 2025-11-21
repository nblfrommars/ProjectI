import React, { useState } from "react";

import { useNavigate, Link } from "react-router-dom";
import { login } from "../utils/auth";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const result = login({ email, password });

    if (!result.success) {
      setError(result.message);
      return;
    }

    if (result.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
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
      <h2>Đăng nhập</h2>{" "}
      <form onSubmit={handleLogin}>
        {" "}
        <input
          type="text"
          placeholder="Email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />{" "}
        <input
          type="password"
          placeholder="Password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />{" "}
        {error && <div style={{ marginBottom: 10, color: "red" }}>{error}</div>}{" "}
        <button type="submit" style={{ ...buttonStyle, background: "#007bff" }}>
          Đăng nhập{" "}
        </button>{" "}
      </form>
      {/* --- nut dang ky moi --- */}
      <div style={{ marginTop: "15px", textAlign: "center" }}>
        <p style={{ marginBottom: "10px" }}>Chưa có tài khoản?</p>
        <Link to="/register" style={{ textDecoration: "none" }}>
          <button style={{ ...buttonStyle, background: "#28a745" }}>
            Đăng ký ngay
          </button>
        </Link>
      </div>{" "}
    </div>
  );
};
//style
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
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "bold",
};

export default Login;
