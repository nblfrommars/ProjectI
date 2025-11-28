import React, { useState } from "react";
import productsData from "../../mockdata/products";
import ProductCard from "../../components/ProductCard";
import categories from "../../mockdata/categories";
import ShopSidebar from "../../components/ShopSidebar";
import "../../styles/Shop.css";

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState(null); //chua chon gi thi auto null => all

  const filteredProducts = selectedCategory
    ? productsData.filter((p) => p.categoryId === selectedCategory)
    : productsData;

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
