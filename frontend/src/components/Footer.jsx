import React from "react";

const Footer = () => {
  const columnTitles = [
    "THÔNG TIN LIÊN HỆ",
    "CHÍNH SÁCH & HỖ TRỢ",
    "TÌM HIỂU THÊM",
    "FOLLOW US ON INSTAGRAM",
  ];

  return (
    <footer
      style={{
        backgroundColor: "#142d38ff",
        color: "#ffffff",
        textAlign: "center",
        padding: "0.2rem 0.5rem",
        borderTop: "5px solid #ffffff33",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
          maxWidth: "1200px",
          margin: "0 auto",
          textAlign: "left",
        }}
      >
        <div style={{ margin: "1rem" }}>
          <h4
            style={{
              borderBottom: "3px solid #2371c0ff",
              display: "inline-block",
              paddingBottom: "0.3rem",
            }}
          >
            {columnTitles[0]}
          </h4>
          <p>Email: support@gloway.com</p>
          <p>Hotline: 0123 456 789</p>
          <p>Địa chỉ: 127 NEO Street, Kwangya.</p>
        </div>

        <div style={{ margin: "1rem" }}>
          <h4
            style={{
              borderBottom: "3px solid #2371c0ff",
              display: "inline-block",
              paddingBottom: "0.3rem",
            }}
          >
            {columnTitles[1]}
          </h4>
          <p>Chính sách đổi trả</p>
          <p>Hỗ trợ khách hàng</p>
          <p>Câu hỏi thường gặp</p>
        </div>

        <div style={{ margin: "1rem" }}>
          <h4
            style={{
              borderBottom: "3px solid #2371c0ff",
              display: "inline-block",
              paddingBottom: "0.3rem",
            }}
          >
            {columnTitles[2]}
          </h4>
          <p>Về chúng tôi</p>
          <p>Blog</p>
          <p>Điều khoản dịch vụ</p>
        </div>

        <div style={{ margin: "1rem" }}>
          <h4
            style={{
              borderBottom: "3px solid #2371c0ff",
              display: "inline-block",
              paddingBottom: "0.3rem",
            }}
          >
            {columnTitles[3]}
          </h4>
          <p>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#ffffff" }}
            >
              Instagram
            </a>
          </p>
        </div>
      </div>

      <div
        style={{
          height: "4px",
          background: "linear-gradient(to right, #00f0ff, #0080ff, #00f0ff)",
          marginTop: "1rem",
          borderRadius: "2px",
        }}
      />

      <div style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
        &copy; 2025 GLOWAY. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
