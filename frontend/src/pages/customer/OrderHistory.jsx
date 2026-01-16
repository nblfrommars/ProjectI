import React, { useEffect, useState } from "react";
import "../../styles/OrderHistory.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const IMAGE_BASE_URL = "http://localhost:8080";
const DEFAULT_IMAGE = "https://via.placeholder.com/80?text=No+Image";

const modalStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "450px",
    padding: "25px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    color: "#333",
  },
  textarea: {
    width: "100%",
    marginTop: "15px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    minHeight: "100px",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  btnGroup: { display: "flex", gap: "10px", marginTop: "20px" },
  btnCancel: {
    flex: 1,
    padding: "10px",
    backgroundColor: "#eee",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  btnSubmit: (color) => ({
    flex: 1,
    padding: "10px",
    backgroundColor: color,
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  }),
};

const StarRating = ({ rating, setRating }) => {
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          onClick={() => {
            console.log("Bạn đã chọn sao số:", s);
            setRating(s);
          }}
          style={{
            cursor: "pointer",
            fontSize: "35px",
            color: s <= rating ? "#ffc107" : "#e0e0e0",
            transition: "color 0.2s",
            userSelect: "none",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const ProductReviewModal = ({ isOpen, onClose, item, userId, token }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  if (!isOpen || !item) return null;

  const handleSubmit = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/reviews/add",
        {
          userId,
          orderItemId: item.orderItemId,
          rating,
          comment,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Cảm ơn đã đánh giá!");
      onClose();
    } catch (e) {
      alert(e.response?.data || "Lỗi khi đánh giá");
    }
  };

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.container}>
        <h3 style={{ margin: "0 0 10px" }}>Đánh giá sản phẩm</h3>
        <p style={{ fontSize: "14px", color: "#666" }}>
          {item.productName} (Size: {item.size})
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "20px 0",
          }}
        >
          <StarRating rating={rating} setRating={setRating} />
        </div>
        <textarea
          style={modalStyles.textarea}
          placeholder="Chất lượng sản phẩm thế nào?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div style={modalStyles.btnGroup}>
          <button style={modalStyles.btnCancel} onClick={onClose}>
            Hủy
          </button>
          <button
            style={modalStyles.btnSubmit("#1976d2")}
            onClick={handleSubmit}
          >
            Gửi đánh giá
          </button>
        </div>
      </div>
    </div>
  );
};

const OrderReviewModal = ({ isOpen, onClose, orderId, userId, token }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/order-reviews/add",
        {
          userId,
          orderId,
          rating,
          comment,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Cảm ơn đã đánh giá!");
      onClose();
    } catch (e) {
      alert(e.response?.data || "Lỗi khi đánh giá");
    }
  };

  return (
    <div style={modalStyles.overlay}>
      <div style={{ ...modalStyles.container, borderTop: "5px solid #fbc02d" }}>
        <h3 style={{ margin: "0 0 5px" }}>Đánh giá dịch vụ Shop</h3>
        <p style={{ fontSize: "12px", color: "#888" }}>
          Mã đơn hàng: #{orderId}
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "20px 0",
          }}
        >
          <p style={{ fontSize: "14px", marginBottom: "10px" }}>
            Bạn có hài lòng về dịch vụ của chúng tôi?
          </p>
          <StarRating rating={rating} setRating={setRating} />
        </div>
        <textarea
          style={modalStyles.textarea}
          placeholder="Góp ý cho shop... (Không bắt buộc)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div style={modalStyles.btnGroup}>
          <button style={modalStyles.btnCancel} onClick={onClose}>
            Bỏ qua
          </button>
          <button
            style={modalStyles.btnSubmit("#fbc02d")}
            onClick={handleSubmit}
          >
            Hoàn tất
          </button>
        </div>
      </div>
    </div>
  );
};

const statusColors = {
  pending: "#fbc02d",
  paid: "#f74fef",
  confirmed: "#4fc3f7",
  shipped: "#1976d2",
  delivered: "#388e3c",
  cancelled: "#d32f2f",
};

const OrderHistory = () => {
  const navigate = useNavigate();
  const [token] = useState(localStorage.getItem("token"));
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

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    if (!userId || !token) {
      setLoading(false);
      return;
    }
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8080/api/orders/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(response.data);
      } catch (error) {
        if (error.response?.status === 401) navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userId, token, navigate]);

  const getImageUrl = (url) =>
    url
      ? url.startsWith("http")
        ? url
        : `${IMAGE_BASE_URL}${url}`
      : DEFAULT_IMAGE;

  const filteredOrders = orders
    .filter((order) => filterStatus === "All" || order.status === filterStatus)
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

  const updateLocalOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Xác nhận hủy đơn?")) {
      try {
        await axios.put(
          `http://localhost:8080/api/orders/${orderId}/status`,
          null,
          {
            params: { status: "cancelled" },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        updateLocalOrderStatus(orderId, "cancelled");
      } catch (e) {
        alert("Không thể hủy đơn.");
      }
    }
  };

  const handleReceivedOrder = async (orderId) => {
    if (window.confirm("Xác nhận đã nhận được hàng?")) {
      try {
        await axios.put(
          `http://localhost:8080/api/orders/${orderId}/status`,
          null,
          {
            params: { status: "delivered" },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        updateLocalOrderStatus(orderId, "delivered");
      } catch (e) {
        alert("Có lỗi xảy ra.");
      }
    }
  };

  if (loading) return <div className="loading">Đang tải...</div>;

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
            <option value="paid">Đã thanh toán</option>
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
              {order.orderItems?.map((item, idx) => (
                <div key={idx} className="order-product">
                  <div className="product-info">
                    <img
                      src={getImageUrl(item.imageUrl)}
                      alt={item.productName}
                      className="order-img-thumb"
                    />
                    <div className="product-details">
                      <span className="product-name">{item.productName}</span>
                      <span className="product-spec">
                        Size: {item.size} | SL: {item.quantity}
                      </span>

                      {order.status === "delivered" && (
                        <button
                          style={{
                            border: "none",
                            background: "none",
                            color: "#1976d2",
                            cursor: "pointer",
                            fontSize: "12px",
                            padding: 0,
                            textDecoration: "underline",
                            marginTop: "5px",
                            textAlign: "left",
                          }}
                          onClick={() => setSelectedProduct(item)}
                        >
                          Đánh giá sản phẩm
                        </button>
                      )}
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

                  {order.status === "delivered" && (
                    <button
                      style={{
                        padding: "8px 15px",
                        backgroundColor: "#fff",
                        border: "1px solid #fb2df4",
                        color: "#fb2dea",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                      onClick={() => setSelectedOrderId(order.orderId)}
                    >
                      Đánh giá Shop
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

      <ProductReviewModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        item={selectedProduct}
        userId={userId}
        token={token}
      />

      <OrderReviewModal
        isOpen={!!selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
        orderId={selectedOrderId}
        userId={userId}
        token={token}
      />
    </div>
  );
};

export default OrderHistory;
