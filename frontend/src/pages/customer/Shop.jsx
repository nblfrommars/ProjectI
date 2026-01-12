import React, { useState, useEffect } from "react";
import ProductCard from "../../components/ProductCard";
import ShopSidebar from "../../components/ShopSidebar";
import "../../styles/Shop.css";
import { useLocation } from "react-router-dom";
const API_BASE_URL = "http://localhost:8080";
export default function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get("search") || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await fetch(`${API_BASE_URL}/api/products`);
        const prodData = await prodRes.json();
        setProducts(prodData);

        const catRes = await fetch("http://localhost:8080/api/categories");
        const catData = await catRes.json();
        setCategories(catData);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu từ server:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory
      ? product.category && product.category.categoryId === selectedCategory
      : true;

    const matchesSearch = product.productName
      ? product.productName.toLowerCase().includes(keyword.toLowerCase())
      : false;

    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        Đang load sản phẩm...
      </div>
    );
  }

  return (
    <div className="shop-container">
      <ShopSidebar
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.productId}
              product={product}
              baseUrl={API_BASE_URL}
            />
          ))
        ) : (
          <div
            className="no-products"
            style={{ textAlign: "center", width: "100%", padding: "20px" }}
          >
            Không tìm thấy sản phẩm nào phù hợp.
          </div>
        )}
      </div>
    </div>
  );
}
