import React, { useEffect, useState } from "react";
import "../../styles/Dashboard.css";
import axios from "axios";

const Dashboard = () => {
  const [stats, setStats] = useState({
    dailyOrders: 0,
    revenue: 0,
    topProduct: "Đang tải...",
    lastUpdated: "",
  });
  const [loading, setLoading] = useState(true);
  const fetchTodayStats = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/statistics/today"
      );
      const data = response.data;

      setStats({
        dailyOrders: data.orderCount,
        revenue: data.totalRevenue || 0,
        topProduct:
          data.bestSellingProducts.length > 0
            ? data.bestSellingProducts.join(", ")
            : "Chưa có đơn hàng",
        lastUpdated: new Date().toLocaleString("vi-VN"),
      });
    } catch (error) {
      console.error("Lỗi khi lấy thống kê Dashboard:", error);
      setStats((prev) => ({ ...prev, topProduct: "Lỗi tải dữ liệu" }));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTodayStats();
  }, []);

  return (
    <div className="dashboard-wrapper">
      <h2 className="dashboard-header">Statistics</h2>

      <div className="dashboard-grid">
        <div className="dashboard-box box-blue">
          <div className="box-content">
            <span className="box-label">ĐƠN HÀNG HÔM NAY</span>
            <span className="box-number">
              {loading ? "..." : stats.dailyOrders}
            </span>
          </div>
          <div className="box-tag">Đơn hàng mới</div>
        </div>
        <div className="dashboard-box box-dark">
          <div className="box-content">
            <span className="box-label">DOANH THU HÀNG NGÀY</span>
            <span className="box-number">
              {loading ? "..." : `${stats.revenue.toLocaleString()}₫`}
            </span>
          </div>
          <div className="box-tag">Tổng doanh thu</div>
        </div>
        <div className="dashboard-box box-pink">
          <div className="box-content">
            <span className="box-label">BÁN CHẠY NHẤT</span>
            <span className="box-product-name">
              {loading ? "Đang tải..." : stats.topProduct}
            </span>
          </div>
          <div className="box-tag">Sản phẩm tiêu biểu</div>
        </div>
      </div>

      <p className="update-time">
        {stats.lastUpdated
          ? `Cập nhật lần cuối: ${stats.lastUpdated}`
          : "Đang kết nối máy chủ..."}
      </p>
    </div>
  );
};

export default Dashboard;
