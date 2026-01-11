import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/ProductDetail.css";
import { addToCart } from "../../utils/cartStorage";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState("M");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/products/${id}`);
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

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    addToCart({
      productId: product.productId,
      productName: product.productName,
      price: product.price,
      imageUrl: product.imageUrl,
      size: size,
      qty: 1,
    });

    alert(`Đã thêm ${product.productName} (size ${size}) vào giỏ!`);
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        Đang tải thông tin sản phẩm...
      </div>
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
          <img src={product.imageUrl} alt={product.productName} />
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
