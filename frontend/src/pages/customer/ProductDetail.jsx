import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/ProductDetail.css";
const API_BASE_URL = "http://localhost:8080";
const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState("M");

  const getFullImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/400";
    if (url.startsWith("http")) return url;
    return `${API_BASE_URL}${url}`;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products/${id}`);
        if (!res.ok) {
          throw new Error("Không tìm thấy sản phẩm");
        }
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Lỗi fetch sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      alert("Vui lòng đăng nhập để thêm vào giỏ hàng!");
      navigate("/login");
      return;
    }
    const userId = user.id || user.userId;
    const cartItem = {
      userId: user.id,
      productId: product.productId,
      quantity: 1,
      size: size,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartItem),
      });

      if (response.ok) {
        alert(`Đã thêm ${product.productName} (size ${size}) vào giỏ hàng!`);
      } else {
        const errorData = await response.json();
        alert("Lỗi: " + errorData.message);
      }
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ hàng:", err);
      alert("Không thể kết nối đến server");
    }
  };
  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>Đang tải...</div>
    );
  if (!product)
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        Sản phẩm không tồn tại!
      </div>
    );
  return (
    <div className="product-detail-container">
      <div className="product-detail-horizontal">
        <div className="product-detail-image">
          <img
            src={getFullImageUrl(product.imageUrl)}
            alt={product.productName}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400";
            }}
          />
        </div>

        <div className="product-detail-info">
          <h2>{product.productName}</h2>

          <p className="description">
            {product.des || "Không có mô tả cho sản phẩm này."}
          </p>

          <p className="price">
            {product.price ? product.price.toLocaleString() : "0"}₫
          </p>

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
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
