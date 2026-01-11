import React from "react";
import "../../styles/Dashboard.css";

const Dashboard = () => {
  const stats = {
    dailyOrders: 25,
    revenue: 12500000,
    topProduct: "Váy xanh ngọc xinh yêu GLOWAY",
    lastUpdated: "12/01/2026 01:45",
  };

  return (
    <div className="dashboard-wrapper">
      <h2 className="dashboard-header">Statistics</h2>

      <div className="dashboard-grid">
        <div className="dashboard-box box-blue">
          <div className="box-content">
            <span className="box-label">ĐƠN HÀNG HÔM NAY</span>
            <span className="box-number">{stats.dailyOrders}</span>
          </div>
          <div className="box-tag">Đơn hàng mới</div>
        </div>
        <div className="dashboard-box box-dark">
          <div className="box-content">
            <span className="box-label">DOANH THU HÀNG NGÀY</span>
            <span className="box-number">
              {stats.revenue.toLocaleString()}₫
            </span>
          </div>
          <div className="box-tag">Tổng doanh thu</div>
        </div>
        <div className="dashboard-box box-pink">
          <div className="box-content">
            <span className="box-label">BÁN CHẠY NHẤT</span>
            <span className="box-product-name">{stats.topProduct}</span>
          </div>
          <div className="box-tag">Sản phẩm tiêu biểu</div>
        </div>
      </div>

      <p className="update-time">Cập nhật lần cuối: {stats.lastUpdated}</p>
    </div>
  );
};

export default Dashboard;
