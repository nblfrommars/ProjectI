import React, { useState } from "react";
import productsData from "../../mockdata/products";
import ProductCard from "../../components/ProductCard";
import "../../styles/Home.css";
import HomeLogo from "../../assets/HomeLogo.png";
const Home = () => {
  const [products] = useState(productsData);

  return (
    <div>
      {/* Logo + Slogan */}
      <div className="home-logo">
        <img
          src={HomeLogo}
          alt="Logo"
          style={{
            width: "calc(100% - 20px)",
            height: "auto",
            display: "block",
            margin: "0 10px",
          }}
        />
      </div>

      {/* san pham moi */}
      <div className="home-products">
        <h1 style={{ color: "#020101ff" }}>Đặc biệt cho mùa này</h1>
        <div className="home-products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
