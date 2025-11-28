import { Outlet } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";
import Sidebar from "../components/SideBar";

const AdminLayout = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <AdminHeader />
        <main style={{ flex: 1, padding: "20px", backgroundColor: "#f3f4f6" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
