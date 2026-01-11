import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // check trung lap mat khau
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (!email || !password) {
      setError("Vui lòng điền đầy đủ email và mật khẩu.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: password }),
      });

      if (!res.ok) {
        const text = await res.text();
        setError(text || "Đăng ký thất bại");
        setIsSubmitting(false);
        return;
      }

      const data = await res.json();

      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (err) {
      console.error("Register error:", err);
      setError("Không kết nối được server");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Đăng ký Tài khoản</h2>

      <form onSubmit={handleRegister}>
        <input
          type="email"
          className="register-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="register-input"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          className="register-input"
          placeholder="Xác nhận Mật khẩu"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {error && <div className="register-error">{error}</div>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="register-button"
        >
          {isSubmitting ? "Đang xử lý~~~" : "Đăng ký"}
        </button>

        <p className="register-login-link">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
