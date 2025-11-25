import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import products from "../../mockdata/products";
import "../../styles/ProductDetail.css";
import { addToCart } from "../../utils/cartStorage";

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [size, setSize] = useState("M");

  if (!product) return <p>Product not found</p>;

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: size,
      qty: 1,
    });

    alert(`Đã thêm ${product.name} (size ${size}) vào giỏ!`);
  };

  return (
    <div className="product-detail-container">
      <div className="product-detail-horizontal">
        <div className="product-detail-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-detail-info">
          <h2>{product.name}</h2>
          <p className="description">
            {product.description || "No description available."}
          </p>
          <p className="price">{product.price.toLocaleString()}₫</p>

          <div className="size-selector">
            <span style={{ marginRight: "10px" }}>Size:</span>
            {["S", "M", "L", "XL", "XXL"].map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`size-btn ${size === s ? "selected" : ""}`}
              >
                {s}
              </button>
            ))}
          </div>

          <button className="add-to-cart" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
