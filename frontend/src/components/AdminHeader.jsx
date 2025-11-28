import React from "react";
import { useNavigate } from "react-router-dom";

const AdminHeader = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header
      style={{
        height: "60px",
        backgroundColor: "#251a45ff",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <h2>GLOWAY SELLER CENTRAL</h2>
      {user ? (
        <button
          onClick={handleLogout}
          style={{
            padding: "6px 12px",
            backgroundColor: "#292ec2ff",
            border: "none",
            borderRadius: "4px",
            color: "white",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      ) : (
        <button
          onClick={() => navigate("/login")}
          style={{
            padding: "6px 12px",
            backgroundColor: "#3b82f6",
            border: "none",
            borderRadius: "4px",
            color: "white",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      )}
    </header>
  );
};

export default AdminHeader;
