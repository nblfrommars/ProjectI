import { useState } from "react";
import Logo from "../assets/images.png";
import shopIcon from "../assets/shop.jpg";
import cartIcon from "../assets/shopping-cart.jpg";
import ordersIcon from "../assets/order.jpg";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");

  const displayName = user?.email ? user.email.split("@")[0] : "";

  const linkStyle = (path) => ({
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    color: location.pathname.startsWith(path) ? "#318be5ff" : "#333",
    fontWeight: location.pathname.startsWith(path) ? "bold" : "normal",
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.8rem 2rem",
        borderBottom: "1px solid #ccc",
        background: "linear-gradient(to right,#ffcef5ff, #fff)",
        gap: "20px",
      }}
    >
      <div style={{ flexShrink: 0 }}>
        <Link to="/">
          <img
            src={Logo}
            alt="Logo"
            style={{ width: "200px", height: "auto", display: "block" }}
          />
        </Link>
      </div>
      <form
        onSubmit={handleSearch}
        style={{
          display: "flex",
          flex: 1,
          maxWidth: "700px",
          position: "relative",
        }}
      >
        <input
          type="text"
          placeholder="Nhập sản phẩm bạn muốn tìm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 45px 10px 20px",
            borderRadius: "20px",
            border: "1px solid #ccc",
            outline: "none",
            fontSize: "14px",
          }}
        />
        <button
          type="submit"
          style={{
            position: "absolute",
            right: "8px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "rgb(229, 49, 223)",
            color: "white",
            border: "none",
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </form>
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
          flexShrink: 0,
        }}
      >
        <Link to="/shop" style={linkStyle("/shop")}>
          <img
            src={shopIcon}
            alt="Shop"
            style={{ width: "20px", marginRight: "5px" }}
          />
          <strong>Our Store</strong>
        </Link>
        {user?.role === "admin" && (
          <Link to="/admin/dashboard" style={linkStyle("/admin")}>
            <span style={{ fontSize: "18px", marginRight: "5px" }}>⚙️</span>
            <strong>Admin Panel</strong>
          </Link>
        )}

        {user?.role === "user" && (
          <>
            <Link to="/cart" style={linkStyle("/cart")}>
              <img
                src={cartIcon}
                alt="Cart"
                style={{ width: "20px", marginRight: "5px" }}
              />
              <strong>Your Cart</strong>
            </Link>
            <Link to="/orders" style={linkStyle("/orders")}>
              <img
                src={ordersIcon}
                alt="Orders"
                style={{ width: "20px", marginRight: "5px" }}
              />
              <strong>Order History</strong>
            </Link>
          </>
        )}

        <div
          onClick={() => (user ? onLogout() : navigate("/login"))}
          style={{ cursor: "pointer", textAlign: "right", lineHeight: "1.2" }}
        >
          <div style={{ fontSize: "12px", color: "#0b0b0bff" }}>
            <em>Hello{user ? `, ${displayName}` : ""}</em>
          </div>
          <div style={{ fontWeight: "bold", color: "#270296ff" }}>
            {user ? "Sign out" : "Sign in"}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
