import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../../styles/OrderDetail.module.css";
import axios from "axios";

const IMAGE_BASE_URL = "http://localhost:8080";
const DEFAULT_IMAGE = "https://via.placeholder.com/50?text=No+Img";

const STATUS_OPTIONS = [
  { value: "pending", label: "CHỜ XỬ LÝ" },
  { value: "confirmed", label: "ĐÃ XÁC NHẬN" },
  { value: "shipped", label: "ĐÃ GIAO HÀNG" },
  { value: "cancelled", label: "HỦY ĐƠN" },
  { value: "delivered", label: "ĐÃ HOÀN THÀNH" },
];

const statusColors = {
  pending: "#fbc02d",
  confirmed: "#4fc3f7",
  shipped: "#1976d2",
  cancelled: "#d32f2f",
  delivered: "green",
};

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const token = getToken();

      const response = await axios.get(
        `http://localhost:8080/api/orders/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrder(response.data);
    } catch (error) {
      console.error("Lỗi:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert("Phiên đăng nhập hết hạn hoặc bạn không có quyền Admin!");
        navigate("/login");
      } else {
        alert("Không tìm thấy đơn hàng!");
        navigate("/admin/orders");
      }
    } finally {
      setLoading(false);
    }
  };

  const isFinalStatus =
    order?.status?.toLowerCase() === "cancelled" ||
    order?.status?.toLowerCase() === "delivered";

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;

    if (
      newStatus === "cancelled" &&
      !window.confirm(
        "Bạn có chắc chắn muốn hủy đơn này? Hãy chủ động liên hệ khách nhé!"
      )
    ) {
      return;
    }

    try {
      setIsUpdating(true);
      const token = getToken();

      const response = await axios.put(
        `http://localhost:8080/api/orders/${orderId}/status`,
        null,
        {
          params: { status: newStatus },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOrder(response.data);
      alert("Cập nhật trạng thái thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setIsUpdating(false);
    }
  };

  const getFormattedTotal = () =>
    (order?.totalPrice || 0).toLocaleString() + "đ";

  const getImageUrl = (url) => {
    if (!url) return DEFAULT_IMAGE;
    if (url.startsWith("http")) return url;
    return `${IMAGE_BASE_URL}${url}`;
  };

  if (loading) return <div className={styles.loading}>Đang tải...</div>;
  if (!order) return null;

  return (
    <div className={styles["order-detail-container"]}>
      <div className={styles["header-actions"]}>
        <button className={styles["back-btn"]} onClick={() => navigate(-1)}>
          Back
        </button>
        <h2>Chi tiết đơn hàng: #{order.orderId}</h2>
      </div>

      <div className={styles["detail-grid"]}>
        <div className={styles["info-section"]}>
          <div className={styles["card"]}>
            <div className={styles["status-update-box"]}>
              <label>Cập nhật trạng thái đơn:</label>
              <select
                value={order.status?.toLowerCase()}
                onChange={handleStatusChange}
                disabled={isUpdating || isFinalStatus}
                className={styles["status-select"]}
                style={{
                  borderLeft: `5px solid ${
                    statusColors[order.status?.toLowerCase()]
                  }`,
                  cursor: isFinalStatus ? "not-allowed" : "pointer",
                  backgroundColor: isFinalStatus ? "#f5f5f5" : "#fff",
                }}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {isFinalStatus && (
                <p className={styles["status-lock-note"]}>
                  * Đơn hàng đã{" "}
                  {order.status?.toLowerCase() === "cancelled"
                    ? "bị hủy"
                    : "hoàn thành"}
                  , không thể thay đổi trạng thái.
                </p>
              )}
              {isUpdating && (
                <span className={styles["loader-text"]}> Đang xử lý...</span>
              )}
            </div>
          </div>

          <div className={styles["card"]}>
            <h3>THÔNG TIN ĐƠN HÀNG</h3>
            <p>
              <strong>Ngày đặt:</strong>{" "}
              {new Date(order.createdAt).toLocaleString("vi-VN")}
            </p>
            <p>
              <strong>Status:</strong>
              <span
                className={styles["status-badge"]}
                style={{
                  backgroundColor: statusColors[order.status?.toLowerCase()],
                }}
              >
                {order.status?.toUpperCase()}
              </span>
            </p>
            <p>
              <strong>Email:</strong> {order.email || "N/A"}
            </p>
            <p>
              <strong>Thanh toán:</strong> {order.paymentMethod || "COD"}
            </p>
          </div>

          <div className={styles["card"]}>
            <h3>THÔNG TIN GIAO HÀNG</h3>
            <p>
              <strong>SĐT:</strong> {order.phoneNumber || "N/A"}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {order.address || "N/A"}
            </p>
          </div>
        </div>

        <div className={styles["items-section"]}>
          <div className={styles["card"]}>
            <h3>Danh sách sản phẩm</h3>
            <table className={styles["product-table"]}>
              <thead>
                <tr>
                  <th>Ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Size</th>
                  <th>Đơn giá</th>
                  <th>SL</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems?.map((item, idx) => (
                  <tr key={idx}>
                    <td className={styles["td-img"]}>
                      <img
                        src={getImageUrl(item.imageUrl)}
                        alt=""
                        onError={(e) => (e.target.src = DEFAULT_IMAGE)}
                      />
                    </td>
                    <td className={styles["product-name-cell"]}>
                      {item.productName}
                    </td>
                    <td className={styles["text-center"]}>{item.size}</td>
                    <td className={styles["text-right"]}>
                      {item.price?.toLocaleString()}đ
                    </td>
                    <td className={styles["text-center"]}>{item.quantity}</td>
                    <td className={styles["text-right"]}>
                      {(item.price * item.quantity)?.toLocaleString()}đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles["order-summary"]}>
              <div className={styles["summary-row"]}>
                <span>Tổng giá trị đơn hàng:</span>
                <span className={styles["grand-total"]}>
                  {getFormattedTotal()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
