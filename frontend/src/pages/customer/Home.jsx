import React, { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";
import "../../styles/Home.css";
import HomeLogo from "../../assets/HomeLogo.jpg";

const API_BASE_URL = "http://localhost:8080";
const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const proRes = await fetch(`${API_BASE_URL}/api/products`);
        const proData = await proRes.json();
        setProducts(proData);
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
        Đang load sản phẩm...
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
    </div>
  );
};

export default Home;
