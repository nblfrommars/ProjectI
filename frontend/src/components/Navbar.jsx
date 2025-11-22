import React from "react";
import { Link } from "react-router-dom";

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
      <Link
        to="/"
        style={{ textDecoration: "none", color: "#333", fontSize: "20px" }}
      >
        Home
      </Link>
      <Link
        to="/shop"
        style={{ textDecoration: "none", color: "#333", fontSize: "20px" }}
      >
        Shop
      </Link>
      <Link
        to="/about"
        style={{ textDecoration: "none", color: "#333", fontSize: "20px" }}
      >
        About Us
      </Link>
      <a
        href="https://www.instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none", color: "#333", fontSize: "20px" }}
      >
        Our Instagram
      </a>
      <Link
        to="/contact"
        style={{ textDecoration: "none", color: "#333", fontSize: "20px" }}
      >
        Contact
      </Link>
    </nav>
  );
};

export default Navbar;
