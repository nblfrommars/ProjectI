import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, pw: password }),
      });

      if (!res.ok) {
        const text = await res.text();
        setError(text || "Email hoặc mật khẩu không đúng");
        return;
      }

      const data = await res.json();

      //luu vao de giu cho cac component khac hoat dong
      localStorage.setItem("user", JSON.stringify(data));

      // dieu huong
      if (data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server đang lỗi");
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Đăng nhập</h2>

      <form onSubmit={handleLogin}>
        <input
          type="text"
          className="login-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="login-input"
          placeholder="Password"
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
