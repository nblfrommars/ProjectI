import React, { useState } from "react";
import productsData from "../../mockdata/products";
import ProductCard from "../../components/ProductCard";
import categories from "../../mockdata/categories";
import ShopSidebar from "../../components/ShopSidebar";
import "../../styles/Shop.css";
import { useLocation } from "react-router-dom";

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState(null); //chua chon gi thi auto null => all
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get("search") || "";
  const filteredProducts = productsData.filter((product) => {
    const matchesCategory = selectedCategory
      ? product.categoryId === selectedCategory
      : true;

    const matchesSearch = product.name
      .toLowerCase()
      .includes(keyword.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="shop-container">
      <ShopSidebar
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
