import React, { useEffect, useState, useCallback } from "react";
import "../../styles/Finance.css";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Finance = () => {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1)
      .toISOString()
      .split("T")[0];
  });
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [summary, setSummary] = useState({ orderCount: 0, totalRevenue: 0 });
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFinanceData = useCallback(async () => {
    if (!startDate || !endDate) {
      alert("Vui lòng chọn đầy đủ khoảng thời gian");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: { startDate, endDate },
      };

      const [summaryRes, productRes] = await Promise.all([
        axios.get(`http://localhost:8080/api/statistics/range-summary`, config),
        axios.get(
          `http://localhost:8080/api/statistics/product-report`,
          config
        ),
      ]);

      setSummary({
        orderCount: summaryRes.data.orderCount || 0,
        totalRevenue: summaryRes.data.totalRevenue || 0,
      });
      setProductData(productRes.data || []);
    } catch (error) {
      console.error("Lỗi khi tải báo cáo tài chính:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert("Phiên đăng nhập hết hạn hoặc bạn không có quyền Admin!");
      } else {
        alert("Không thể tải dữ liệu báo cáo.");
      }
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const handleExportExcel = () => {
    if (productData.length === 0) {
      alert("Không có dữ liệu để xuất báo cáo!");
      return;
    }

    const headerInfo = [
      ["BÁO CÁO TÀI CHÍNH"],
      [`Thời gian: từ ${startDate} đến ${endDate}`],
      [`Số đơn hàng: ${summary.orderCount}`],
      [`Tổng doanh thu: ${Number(summary.totalRevenue).toLocaleString()} VNĐ`],
      [""],
      ["STT", "TÊN SẢN PHẨM", "DOANH SỐ", "DOANH THU (VNĐ)"],
    ];

    const tableData = productData.map((item, index) => [
      index + 1,
      item.productName,
      item.totalQuantity,
      item.totalRevenue,
    ]);

    const finalData = [...headerInfo, ...tableData];
    const worksheet = XLSX.utils.aoa_to_sheet(finalData);

    worksheet["!cols"] = [{ wch: 5 }, { wch: 30 }, { wch: 15 }, { wch: 20 }];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "BaoCaoTaiChinh");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(blob, `Bao-cao-tai-chinh-${startDate}-to-${endDate}.xlsx`);
  };

  return (
    <div className="finance-container">
      <h2 className="finance-title">Tình hình tài chính của cửa hàng</h2>

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
        <button
          className="btn-filter"
          onClick={fetchFinanceData}
          disabled={loading}
        >
          {loading ? "ĐANG TẢI..." : "LỌC DỮ LIỆU"}
        </button>
        <button className="btn-export" onClick={handleExportExcel}>
          XUẤT BÁO CÁO (EXCEL)
        </button>
      </div>

      <div className="summary-grid">
        <div className="summary-box box-black">
          <span className="label">TỔNG ĐƠN HÀNG</span>
          <span className="value">{summary.orderCount}</span>
        </div>
        <div className="summary-box box-pink">
          <span className="label">TỔNG DOANH THU</span>
          <span className="value">
            {(summary.totalRevenue || 0).toLocaleString()}₫
          </span>
        </div>
      </div>

      <div className="table-wrapper">
        <h3>BÁO CÁO CHI TIẾT THEO SẢN PHẨM</h3>
        <table className="finance-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>TÊN SẢN PHẨM</th>
              <th>SỐ LƯỢNG ĐÃ BÁN</th>
              <th>DOANH THU</th>
            </tr>
          </thead>
          <tbody>
            {productData.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  Không có dữ liệu bán hàng trong khoảng thời gian này.
                </td>
              </tr>
            ) : (
              productData.map((item, index) => (
                <tr key={index}>
                  <td style={{ textAlign: "center" }}>{index + 1}</td>
                  <td style={{ fontWeight: "bold" }}>{item.productName}</td>
                  <td style={{ textAlign: "center" }}>{item.totalQuantity}</td>
                  <td style={{ textAlign: "right" }}>
                    {(item.totalRevenue || 0).toLocaleString()}₫
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {productData.length > 0 && (
            <tfoot>
              <tr style={{ fontWeight: "bold", background: "#f9f9f9" }}>
                <td colSpan="2" style={{ textAlign: "center" }}>
                  TỔNG CỘNG
                </td>
                <td style={{ textAlign: "center" }}>
                  {productData.reduce(
                    (sum, item) => sum + item.totalQuantity,
                    0
                  )}
                </td>
                <td style={{ textAlign: "right" }}>
                  {summary.totalRevenue.toLocaleString()}₫
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

export default Finance;
