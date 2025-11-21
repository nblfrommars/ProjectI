import React from "react";
import Logo from "../assets/images.png";
import { Link, useNavigate } from "react-router-dom";

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "1rem",
        borderBottom: "1px solid #ccc",
      }}
    >
      <div>
        <Link to="/">
          <img
            src={Logo}
            alt="Logo"
            style={{ width: "150px", height: "auto" }}
          />
        </Link>
      </div>
      <nav>
        <Link to="/shop" style={{ margin: "0 0.5rem" }}>
          Shop
        </Link>
        {user?.role === "user" && (
          <Link to="/cart" style={{ margin: "0 0.5rem" }}>
            Cart
          </Link>
        )}
        {user ? (
          <button onClick={onLogout}>Logout</button>
        ) : (
          <button onClick={() => navigate("/login")}>Login</button>
        )}
      </nav>
    </header>
  );
};

export default Header;
