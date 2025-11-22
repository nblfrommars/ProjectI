import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../utils/auth";
import "../styles/Login.css";

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
    <div className="login-container">
      <h2 className="login-title">Đăng nhập</h2>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          className="login-input"
          placeholder="Email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="login-input"
          placeholder="Password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <div className="login-error">{error}</div>}

        <button type="submit" className="login-button login-button--primary">
          Đăng nhập
        </button>
      </form>

      <div className="login-register-wrap">
        <p>Chưa có tài khoản?</p>
        <Link to="/register">
          <button className="login-button login-button--green">
            Đăng ký ngay
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Login;
