import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

const UserLayout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>User Layout</h2>
        {user ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <button onClick={() => navigate("/login")}>Login</button>
        )}
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
