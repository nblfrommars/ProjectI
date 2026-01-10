import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "2rem",
        padding: "0.3rem 2rem",
        backgroundColor: "#fff",
        borderBottom: "1px solid #ccc",
      }}
    >
      <NavLink
        to="/home"
        style={({ isActive }) => ({
          textDecoration: "none",
          color: "#333",
          fontSize: "20px",
          backgroundColor: isActive ? "#f56ae7ff" : "transparent",
          padding: "0.2rem 0.5rem",
          borderRadius: "5px",
        })}
      >
        Home
      </NavLink>

      <NavLink
        to="/shop"
        style={({ isActive }) => ({
          textDecoration: "none",
          color: "#333",
          fontSize: "20px",
          backgroundColor: isActive ? "#f56ae7ff" : "transparent",
          padding: "0.2rem 0.5rem",
          borderRadius: "5px",
        })}
      >
        Shop
      </NavLink>

      <NavLink
        to="/specification"
        style={({ isActive }) => ({
          textDecoration: "none",
          color: "#333",
          fontSize: "20px",
          backgroundColor: isActive ? "#f56ae7ff" : "transparent",
          padding: "0.2rem 0.5rem",
          borderRadius: "5px",
        })}
      >
        Specification
      </NavLink>

      <a
        href="https://www.instagram.com/fridayshop.official/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          textDecoration: "none",
          color: "#333",
          fontSize: "20px",
          padding: "0.2rem 0.5rem",
          borderRadius: "5px",
        }}
      >
        Our Instagram
      </a>
    </nav>
  );
};

export default Navbar;
