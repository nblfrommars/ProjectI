import React, { useEffect, useState } from "react";
import "../../styles/OrderHistory.css";
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
  },
  {
    id: 2,
    date: "2025-11-25",
    products: [{ name: "Sneakers Black", qty: 1, price: 800000 }],
    total: 800000,
    status: "Shipped",
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
  },
  {
    id: 4,
    date: "2025-11-15",
    products: [{ name: "Socks Pack", qty: 3, price: 90000 }],
    total: 90000,
    status: "Cancel",
  },
];

const statusColors = {
  Pending: "#fbc02d",
  Shipped: "#1976d2",
  Paid: "#388e3c",
  Cancel: "#d32f2f",
};

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("desc"); //newest to oldest

  useEffect(() => {
    setOrders(mockOrders);
  }, []);

  const filteredOrders = orders
    .filter((order) => filterStatus === "All" || order.status === filterStatus)
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="order-history-container">
      <h2>Order History</h2>

      <div className="order-filters">
        <label>
          Filter by Status:
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
          Sort by Date:
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </label>
      </div>

      {filteredOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        filteredOrders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <span>Order #{order.id}</span>
              <span>{order.date}</span>
              <span
                className="order-status"
                style={{ backgroundColor: statusColors[order.status] }}
              >
                {order.status}
              </span>
            </div>
            <div className="order-products">
              {order.products.map((p, idx) => (
                <div key={idx} className="order-product">
                  <span>
                    {p.name} x{p.qty}
                  </span>
                  <span>{p.price.toLocaleString()}₫</span>
                </div>
              ))}
            </div>
            <div className="order-total">
              <span>
                <button>Feedback for Order</button>
              </span>
              <span>Total: {order.total.toLocaleString()}₫</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
