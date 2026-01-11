import React, { useState } from "react";
import "../../styles/Finance.css";

const Finance = () => {
  const mockData = [
    { date: "2026-01-10", orderCount: 15, revenue: 5200000 },
    { date: "2026-01-11", orderCount: 22, revenue: 8450000 },
    { date: "2026-01-12", orderCount: 18, revenue: 6100000 },
  ];

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState(mockData);

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = data.reduce((sum, item) => sum + item.orderCount, 0);

  const handleFilter = () => {
    console.log("Lọc từ ngày:", startDate, "đến ngày:", endDate);
  };

  return (
    <div className="finance-container">
      <h2 className="finance-title">BÁO CÁO DOANH THU</h2>

      <div className="filter-section">
        <div className="filter-group">
          <label>Từ ngày:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>Đến ngày:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button className="btn-filter" onClick={handleFilter}>
          LỌC DỮ LIỆU
        </button>
        <button className="btn-export">XUẤT BÁO CÁO (EXCEL)</button>
      </div>

      <div className="summary-grid">
        <div className="summary-box box-black">
          <span className="label">TỔNG ĐƠN HÀNG</span>
          <span className="value">{totalOrders}</span>
        </div>
        <div className="summary-box box-pink">
          <span className="label">TỔNG DOANH THU</span>
          <span className="value">{totalRevenue.toLocaleString()}₫</span>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="finance-table">
          <thead>
            <tr>
              <th>NGÀY</th>
              <th>SỐ LƯỢNG ĐƠN</th>
              <th>DOANH THU NGÀY</th>
              <th>CHI TIẾT</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.date}</td>
                <td>{item.orderCount}</td>
                <td>{item.revenue.toLocaleString()}₫</td>
                <td>
                  <button className="btn-view">Xem đơn</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Finance;
