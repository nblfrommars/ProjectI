import Logo from "../assets/images.png";
import shopIcon from "../assets/shop.jpg";
import cartIcon from "../assets/shopping-cart.jpg";
import ordersIcon from "../assets/order.jpg";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // ten = ten truoc @
  const displayName = user?.email ? user.email.split("@")[0] : "";

  const linkStyle = (path) => ({
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    color: location.pathname === path ? "#318be5ff" : "#333",
    fontWeight: location.pathname === path ? "bold" : "normal",
  });

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.8rem 2rem",
        borderBottom: "1px solid #ccc",
        background: "linear-gradient(to right,#ffcef5ff, #fff)",
      }}
    >
      {/* Logo */}
      <div>
        <Link to="/">
          <img
            src={Logo}
            alt="Logo"
            style={{
              width: "230px",
              height: "auto",
              display: "block",
            }}
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <Link to="/shop" style={linkStyle("/shop")}>
          <img
            src={shopIcon}
            alt="Shop"
            style={{ width: "20px", marginRight: "5px" }}
          />
          <strong>Our Store</strong>
        </Link>

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

        {/* Hello, Sign in / Sign out */}
        <div
          onClick={() => {
            if (user) {
              onLogout();
            } else {
              navigate("/login");
            }
          }}
          style={{
            cursor: "pointer",
            textAlign: "right",
            lineHeight: "1.2",
          }}
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
