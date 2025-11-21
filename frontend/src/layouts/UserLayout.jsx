// UserLayout.jsx
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const UserLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div>
      {/* Header co the nhan props user va handle Logout*/}
      <Header user={user} onLogout={handleLogout} />

      <main style={{ minHeight: "80vh", padding: "1rem" }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default UserLayout;
