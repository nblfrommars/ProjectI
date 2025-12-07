import React, { useEffect, useState } from "react";
import styles from "../../styles/ManageOrder.module.css";
const mockOrders = [
  {
    id: 1,
    date: "2025-11-28",
    products: [
      { name: "T-Shirt GLOWAY", qty: 2, price: 150000 },
      { name: "Jeans Classic", qty: 1, price: 450000 },
    ],
    total: 750000,
    status: "Pending",
    userId: "1",
  },
  {
    id: 2,
    date: "2025-11-25",
    products: [{ name: "Sneakers Black", qty: 1, price: 800000 }],
    total: 800000,
    status: "Shipped",
    userId: "2",
  },
  {
    id: 3,
    date: "2025-11-20",
    products: [
      { name: "Hoodie GLOWAY", qty: 1, price: 400000 },
      { name: "Cap Red", qty: 2, price: 120000 },
    ],
    total: 640000,
    status: "Paid",
    userId: "7",
  },
  {
    id: 4,
    date: "2025-11-15",
    products: [{ name: "Socks Pack", qty: 3, price: 90000 }],
    total: 90000,
    status: "Cancel",
    userId: "4",
  },
];

const statusColors = {
  Pending: "#fbc02d",
  Shipped: "#1976d2",
  Paid: "#388e3c",
  Cancel: "#d32f2f",
};

const ManageOrder = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("desc"); //newest to oldest
  useEffect(() => {
    setOrders(mockOrders);
  }, []);
  const filteredOrders = orders
    .filter((order) => filterStatus === "All" || filterStatus === order.status)
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
  return (
    <div className={styles["manage-order-container"]}>
      <h2>Orders</h2>
      <div className={styles["order-filters"]}>
        <label>
          Filter by Status
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Paid">Paid</option>
            <option value="Cancel">Cancel</option>
          </select>
        </label>
        <label>
          Sort by Date
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="desc">Newest to Oldest</option>
            <option value="asc">Oldest to Newest</option>
          </select>
        </label>
      </div>
      {filteredOrders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        filteredOrders.map((order) => (
          <div key={order.id} className={styles["order-card"]}>
            <div className={styles["order-content"]}>
              <div className={styles["order-header"]}>
                <span>ID: #{order.id}</span>
                <span>Date: {order.date}</span>
                <span
                  className={styles["order-status"]}
                  style={{ backgroundColor: statusColors[order.status] }}
                >
                  {order.status}
                </span>
                <span>Customer: {order.userId}</span>
              </div>
              <div className={styles["order-products"]}>
                {order.products.map((p, idx) => (
                  <div key={idx} className={styles["order-product"]}>
                    <span>
                      {p.name}x{p.qty}
                    </span>
                    <span>{p.price.toLocaleString()}đ</span>
                  </div>
                ))}
              </div>
              <div className={styles["order-total"]}>
                Total: {order.total.toLocaleString()}₫
              </div>
            </div>
            <div className={styles["order-actions"]}>
              <span className={styles["action-titles"]}>Actions</span>
              <button>Update Status</button>
              <button>Contact Customer</button>
              <button>Print Label</button>
              <button>Order Detail</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
export default ManageOrder;
