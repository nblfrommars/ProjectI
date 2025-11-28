import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menu = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Inventory", path: "/admin/inventory" },
    { name: "Orders", path: "/admin/orders" },
    { name: "Finance", path: "/admin/finance" },
  ];

  return (
    <aside
      style={{
        width: "250px",
        backgroundColor: "#262244ff",
        color: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          padding: "20px",
          fontSize: "20px",
          fontWeight: "bold",
          borderBottom: "1px solid #51374eff",
        }}
      >
        Tools Resource
      </div>
      <nav style={{ flex: 1, marginTop: "10px" }}>
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: "block",
              padding: "12px 20px",
              textDecoration: "none",
              color: "white",
              backgroundColor: isActive ? "#318be5ff" : "transparent",
            })}
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
