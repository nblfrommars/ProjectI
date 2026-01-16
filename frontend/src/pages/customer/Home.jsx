import React, { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";
import "../../styles/Home.css";
import HomeLogo from "../../assets/HomeLogo.jpg";

const API_BASE_URL = "http://localhost:8080";

const StaticStars = ({ rating }) => {
  return (
    <div style={{ color: "#ffc107", fontSize: "18px" }}>
      {"★".repeat(rating)}
      {"☆".repeat(5 - rating)}
    </div>
  );
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const proRes = await fetch(`${API_BASE_URL}/api/products`);
        const proData = await proRes.json();
        setProducts(proData);
        const revRes = await fetch(`${API_BASE_URL}/api/order-reviews`);
        const revData = await revRes.json();
        setReviews(revData);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu từ server:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        Đang load dữ liệu...
      </div>
    );
  }

  return (
    <div>
      <div className="home-logo">
        <img
          src={HomeLogo}
          alt="Logo"
          style={{
            width: "calc(100% - 50px)",
            height: "auto",
            display: "block",
            margin: "0 10px",
          }}
        />
      </div>

      <div className="home-products">
        <h1 style={{ color: "#020101ff" }}>Đặc biệt cho mùa này</h1>
        <div className="home-products-grid">
          {Array.isArray(products) &&
            products.map((item) => (
              <ProductCard
                key={item.productId}
                product={item}
                baseUrl={API_BASE_URL}
              />
            ))}
        </div>
      </div>

      <div
        style={{
          padding: "40px 20px",
          backgroundColor: "#f9f9f9",
          marginTop: "50px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "30px",
              borderBottom: "2px solid #eee",
              paddingBottom: "10px",
            }}
          >
            <h2 style={{ margin: 0, color: "#333" }}>
              Khách hàng nói gì về Shop
            </h2>
          </div>

          {reviews.length === 0 ? (
            <p style={{ textAlign: "center", color: "#999" }}>
              Chưa có đánh giá nào cho shop.
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "20px",
              }}
            >
              {reviews.map((rev) => (
                <div
                  key={rev.reviewId}
                  style={{
                    backgroundColor: "#fff",
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                    border: "1px solid #efefef",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}
                  >
                    <strong style={{ fontSize: "14px", color: "#444" }}>
                      {rev.email}
                    </strong>
                    <span style={{ fontSize: "12px", color: "#999" }}>
                      {new Date(rev.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <StaticStars rating={rev.rating} />
                  <p
                    style={{
                      marginTop: "10px",
                      fontSize: "14px",
                      lineHeight: "1.5",
                      color: "#555",
                      fontStyle: rev.comment ? "normal" : "italic",
                    }}
                  >
                    {rev.comment || "Khách hàng không để lại bình luận."}
                  </p>
                  <div
                    style={{
                      marginTop: "10px",
                      fontSize: "12px",
                      color: "#d82dcd",
                      fontWeight: "bold",
                    }}
                  >
                    Đơn hàng #{rev.orderId}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
