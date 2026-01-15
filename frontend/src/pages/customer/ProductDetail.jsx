import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/ProductDetail.css";

const API_BASE_URL = "http://localhost:8080";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedVariant, setSelectedVariant] = useState(null);

  const getFullImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/400";
    if (url.startsWith("http")) return url;
    return `${API_BASE_URL}${url}`;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products/${id}`);
        if (!res.ok) throw new Error("Không tìm thấy sản phẩm");

        const data = await res.json();
        setProduct(data);

        if (data.variants && data.variants.length > 0) {
          const available =
            data.variants.find((v) => v.stock > 0) || data.variants[0];
          setSelectedVariant(available);
        }
      } catch (err) {
        console.error("Lỗi fetch sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!selectedVariant || selectedVariant.stock <= 0) {
      alert("Size này đã hết hàng!");
      return;
    }

    if (!user || !token) {
      alert("Vui lòng đăng nhập để thêm vào giỏ hàng!");
      navigate("/login");
      return;
    }

    const cartItem = {
      userId: user.id || user.userId,
      variantId: selectedVariant.variantId,
      quantity: 1,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cartItem),
      });

      if (response.ok) {
        alert(`Đã thêm vào giỏ hàng size ${selectedVariant.size}!`);
      } else {
        const errorData = await response.json();
        alert("Lỗi: " + (errorData.message || "Không thể thêm vào giỏ hàng"));
      }
    } catch (err) {
      alert("Lỗi kết nối server");
    }
  };

  const handleBuyNow = () => {
    if (!selectedVariant || selectedVariant.stock <= 0) return;

    if (!user) {
      alert("Vui lòng đăng nhập để đặt hàng!");
      navigate("/login");
      return;
    }

    const itemToCheckout = {
      productVariant: {
        ...selectedVariant,
        product: {
          productId: product.productId,
          productName: product.productName,
          price: product.price,
          imageUrl: product.imageUrl,
        },
      },
      quantity: 1,
    };

    navigate("/checkout", { state: { buyNowItem: itemToCheckout } });
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (!product) return <div className="error">Sản phẩm không tồn tại!</div>;

  const isEntirelyOutOfStock = product.variants?.every((v) => v.stock === 0);

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
          <p className="description">{product.des || "Không có mô tả."}</p>

          <div className="status">
            Trạng thái:{" "}
            <span
              className={
                selectedVariant?.stock > 0 ? "in-stock" : "out-of-stock"
              }
            >
              {selectedVariant?.stock > 0
                ? `Còn hàng (Kho: ${selectedVariant.stock})`
                : "Hết hàng"}
            </span>
          </div>

          <p className="price">{product.price?.toLocaleString()}₫</p>

          <div className="size-selector">
            <span>Size:</span>
            <div className="size-buttons">
              {product.variants?.map((v) => (
                <button
                  key={v.variantId}
                  disabled={v.stock === 0}
                  onClick={() => setSelectedVariant(v)}
                  className={`size-btn ${
                    selectedVariant?.variantId === v.variantId ? "selected" : ""
                  } ${v.stock === 0 ? "disabled" : ""}`}
                >
                  {v.size}
                </button>
              ))}
            </div>
          </div>

          <div className="product-actions">
            <button
              className="add-to-cart"
              onClick={handleAddToCart}
              disabled={isEntirelyOutOfStock || selectedVariant?.stock <= 0}
            >
              Thêm vào giỏ hàng
            </button>

            <button
              className="buy-now-btn"
              onClick={handleBuyNow}
              disabled={isEntirelyOutOfStock || selectedVariant?.stock <= 0}
            >
              Đặt hàng ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
