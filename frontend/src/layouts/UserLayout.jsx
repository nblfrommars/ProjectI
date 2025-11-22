// UserLayout.jsx
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const UserLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div>
      <Header user={user} onLogout={handleLogout} />

      <Navbar />

      <main style={{ minHeight: "80vh", padding: "1rem" }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default UserLayout;
