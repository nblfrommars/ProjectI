import React, { useEffect, useState } from "react";
import styles from "../../styles/ManageOrder.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
const STATUS_OPTIONS = [
  { value: "pending", label: "Chờ xử lý" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "shipped", label: "Đã giao" },
  { value: "cancelled", label: "Hủy đơn" },
  { value: "delivered", label: "Hoàn thành" },
];

const statusColors = {
  pending: "#fbc02d",
  confirmed: "#4fc3f7",
  shipped: "#1976d2",
  delivered: "#388e3c",
  cancelled: "#d32f2f",
};

const ManageOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortOrder, setSortOrder] = useState("desc");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/api/orders`);
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Lỗi khi fetch đơn hàng:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    if (
      newStatus === "cancelled" &&
      !window.confirm("Bạn có chắc chắn muốn hủy đơn này?")
    ) {
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8080/api/orders/${orderId}/status`,
        null,
        { params: { status: newStatus } }
      );

      setOrders((prevOrders) =>
        prevOrders.map((o) => (o.orderId === orderId ? response.data : o))
      );
      alert("Cập nhật trạng thái thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Không thể cập nhật trạng thái.");
    }
  };

  const filteredOrders = orders
    .filter((order) => {
      const status = order.status?.toLowerCase();
      return filterStatus === "All" || status === filterStatus.toLowerCase();
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
  const handlePrintLabel = (order) => {
    const doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a5",
    });

    doc.setFontSize(16);
    doc.text("GLOWAY STORE - Ship Label", 10, 15);

    doc.setFontSize(10);
    doc.text(`Ma don hang: # ${order.orderId}`, 10, 25);
    doc.text(`Ngay in: ${new Date().toLocaleString("vi-VN")}`, 10, 30);
    doc.line(10, 32, 138, 32);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("TO (NGUOI NHAN):", 10, 40);

    doc.setFont("helvetica", "normal");
    doc.text(`Phone: ${order.phoneNumber || "N/A"}`, 10, 47);

    doc.setFont("helvetica", "normal");
    doc.text(`Address: ${order.address || "N/A"}`, 10, 54);

    const tableColumn = ["San pham", "Size", "SL", "Gia"];
    const tableRows = (order.orderItems || []).map((item) => [
      item.productName,
      item.size || "-",
      item.quantity,
      `${(item.price || 0).toLocaleString()}d`,
    ]);

    autoTable(doc, {
      startY: 70,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      headStyles: { fillColor: [0, 0, 0] },
      styles: { fontSize: 9 },
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(
      `TONG CONG: ${(order.totalPrice || 0).toLocaleString()} VND`,
      10,
      finalY
    );

    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Cam on ban da mua hang tai GLOWAY!", 10, finalY + 10);

    doc.save(`Label_Order_${order.orderId}.pdf`);
  };

  if (loading) return <div className={styles.loading}>Đang tải dữ liệu...</div>;

  return (
    <div className={styles["manage-order-container"]}>
      <h2>Quản Lý Đơn Hàng</h2>

      <div className={styles["order-filters"]}>
        <label>
          Lọc trạng thái:
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">Tất cả</option>
            <option value="pending">Chờ xử lý</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="shipping">Đang giao</option>
            <option value="delivered">Đã hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </label>

        <label>
          Sắp xếp:
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="desc">Mới nhất</option>
            <option value="asc">Cũ nhất</option>
          </select>
        </label>
      </div>

      <div className={styles["order-list"]}>
        {filteredOrders.length === 0 ? (
          <p>Không có đơn hàng nào</p>
        ) : (
          filteredOrders.map((order) => {
            const isFinalStatus =
              order.status?.toLowerCase() === "cancelled" ||
              order.status?.toLowerCase() === "delivered";

            return (
              <div key={order.orderId} className={styles["order-card"]}>
                <div className={styles["order-content"]}>
                  <div className={styles["order-header"]}>
                    <span>ID: #{order.orderId}</span>
                    <span>
                      Ngày:{" "}
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("vi-VN")
                        : "N/A"}
                    </span>
                    <span
                      className={styles["order-status"]}
                      style={{
                        backgroundColor:
                          statusColors[order.status?.toLowerCase()] || "#999",
                      }}
                    >
                      {order.status?.toUpperCase()}
                    </span>
                    <span>Khách: KH-{order.userId}</span>
                  </div>

                  <div className={styles["order-products"]}>
                    {order.orderItems?.map((item, idx) => (
                      <div key={idx} className={styles["order-product"]}>
                        <span>
                          {item.productName} <strong>x{item.quantity}</strong>
                        </span>
                        <span>{(item.price || 0).toLocaleString()}đ</span>
                      </div>
                    ))}
                  </div>

                  <div className={styles["order-total"]}>
                    Tổng: {(order.totalPrice || 0).toLocaleString()}₫
                  </div>
                </div>

                <div className={styles["order-actions"]}>
                  <span className={styles["action-titles"]}>
                    Thao tác nhanh
                  </span>

                  <select
                    className={styles["status-select-inline"]}
                    value={order.status?.toLowerCase()}
                    onChange={(e) =>
                      handleStatusChange(order.orderId, e.target.value)
                    }
                    disabled={isFinalStatus}
                    style={{
                      borderLeft: `4px solid ${
                        statusColors[order.status?.toLowerCase()]
                      }`,
                      cursor: isFinalStatus ? "not-allowed" : "pointer",
                      opacity: isFinalStatus ? 0.6 : 1,
                    }}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  <button onClick={() => handlePrintLabel(order)}>
                    Print Label
                  </button>
                  <button
                    onClick={() => navigate(`/admin/orders/${order.orderId}`)}
                  >
                    Chi tiết
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ManageOrder;
