import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../../utils/auth";
import "../../styles/Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");

    // Kiem tra mat khau
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (!email || !password) {
      setError("Vui lòng điền đầy đủ email và mật khẩu.");
      return;
    }

    setIsSubmitting(true);

    const result = register({ email, password });

    setIsSubmitting(false);

    if (result.success) {
      alert(result.message);
      navigate("/login");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Đăng ký Tài khoản</h2>

      <form onSubmit={handleRegister}>
        <input
          type="email"
          className="register-input"
          placeholder="Email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="register-input"
          placeholder="Mật khẩu..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          className="register-input"
          placeholder="Xác nhận Mật khẩu..."
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
          {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
        </button>

        <p className="register-login-link">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
