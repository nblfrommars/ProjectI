import React, { useEffect, useState } from "react";
import "../../styles/OrderHistory.css";
import axios from "axios";

const IMAGE_BASE_URL = "http://localhost:8080";
const DEFAULT_IMAGE = "https://via.placeholder.com/80?text=No+Image";

const statusColors = {
  pending: "#fbc02d",
  confirmed: "#4fc3f7",
  shipping: "#1976d2",
  delivered: "#388e3c",
  cancelled: "#d32f2f",
};

const OrderHistory = () => {
  const [userId] = useState(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      const user = JSON.parse(saved);
      return user.id || user.userId;
    }
    return null;
  });

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8080/api/orders/user/${userId}`
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Lỗi khi fetch đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const getImageUrl = (url) => {
    if (!url) return DEFAULT_IMAGE;
    if (url.startsWith("http")) return url;
    return `${IMAGE_BASE_URL}${url}`;
  };

  const filteredOrders = orders
    .filter((order) => filterStatus === "All" || order.status === filterStatus)
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
  const updateLocalOrderStatus = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.orderId === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm("Xác nhận hủy đơn?");

    if (confirmCancel) {
      try {
        await axios.put(
          `http://localhost:8080/api/orders/${orderId}/status`,
          null,
          {
            params: { status: "cancelled" },
          }
        );

        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId
              ? { ...order, status: "cancelled" }
              : order
          )
        );

        alert("Hủy đơn hàng thành công!");
      } catch (error) {
        console.error("Lỗi khi hủy đơn:", error);
        alert("Không thể hủy đơn hàng. Vui lòng thử lại sau.");
      }
    }
  };
  const handleReceivedOrder = async (orderId) => {
    const confirmReceived = window.confirm("Xác nhận đã nhận được hàng?");

    if (confirmReceived) {
      try {
        await axios.put(
          `http://localhost:8080/api/orders/${orderId}/status`,
          null,
          { params: { status: "delivered" } }
        );
        updateLocalOrderStatus(orderId, "delivered");
      } catch (error) {
        console.error("Lỗi xác nhận nhận hàng:", error);
        alert("Có lỗi xảy ra, vui lòng thử lại sau.");
      }
    }
  };

  if (loading)
    return <div className="loading">Đang tải lịch sử đơn hàng...</div>;

  if (!userId) {
    return (
      <div className="order-history-container">
        <p className="no-orders">Vui lòng đăng nhập để xem lịch sử đơn hàng.</p>
      </div>
    );
  }

  return (
    <div className="order-history-container">
      <h2>Đơn Hàng Của Bạn</h2>

      <div className="order-filters">
        <div className="filter-group">
          <label>Trạng thái:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">Tất cả</option>
            <option value="pending">Chờ xử lý</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="shipped">Đã giao</option>
            <option value="delivered">Đã hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sắp xếp:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="desc">Mới nhất</option>
            <option value="asc">Cũ nhất</option>
          </select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <p className="no-orders">Bạn chưa có đơn hàng nào.</p>
      ) : (
        filteredOrders.map((order) => (
          <div key={order.orderId} className="order-card">
            <div className="order-header">
              <span className="order-id">Đơn hàng #{order.orderId}</span>
              <span className="order-date">
                {new Date(order.createdAt).toLocaleString("vi-VN")}
              </span>
              <span
                className="order-status"
                style={{
                  backgroundColor: statusColors[order.status] || "#999",
                }}
              >
                {order.status ? order.status.toUpperCase() : "UNKNOWN"}
              </span>
            </div>

            <div className="order-products">
              {order.orderItems &&
                order.orderItems.map((item, idx) => (
                  <div key={idx} className="order-product">
                    <div className="product-info">
                      <img
                        src={getImageUrl(item.imageUrl)}
                        alt={item.productName}
                        className="order-img-thumb"
                        onError={(e) => {
                          e.target.src = DEFAULT_IMAGE;
                        }}
                      />
                      <div className="product-details">
                        <span className="product-name">{item.productName}</span>
                        <span className="product-spec">
                          Size: {item.size} | SL: {item.quantity}
                        </span>
                      </div>
                    </div>
                    <span className="product-price">
                      {item.price.toLocaleString()}₫
                    </span>
                  </div>
                ))}
            </div>

            <div className="order-footer-info">
              <div className="order-summary">
                <div className="order-actions">
                  {order.status === "pending" && (
                    <button
                      className="cancel-btn"
                      onClick={() => handleCancelOrder(order.orderId)}
                    >
                      Hủy đơn
                    </button>
                  )}
                  {order.status === "shipped" && (
                    <button
                      className="received-btn"
                      onClick={() => handleReceivedOrder(order.orderId)}
                    >
                      Đã nhận hàng
                    </button>
                  )}
                </div>
                <span className="total-price">
                  Tổng cộng:{" "}
                  <strong>{order.totalPrice.toLocaleString()}₫</strong>
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
