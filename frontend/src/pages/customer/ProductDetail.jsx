import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/ProductDetail.css";

const API_BASE_URL = "http://localhost:8080";
const StaticStars = ({ rating }) => {
  return (
    <div style={{ color: "#ffc107", fontSize: "14px" }}>
      {"★".repeat(rating)}
      {"☆".repeat(5 - rating)}
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const getFullImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/400";
    if (url.startsWith("http")) return url;
    return `${API_BASE_URL}${url}`;
  };

  useEffect(() => {
    const fetchProductAndReviews = async () => {
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

        const revRes = await fetch(`${API_BASE_URL}/api/reviews/product/${id}`);
        if (revRes.ok) {
          const revData = await revRes.json();
          setReviews(revData);
        }
      } catch (err) {
        console.error("Lỗi:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductAndReviews();
  }, [id]);

  const getCurrentCartFromServer = async () => {
    if (!user || !token) return [];
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/cart/${user.id || user.userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) return await res.json();
    } catch (err) {
      console.error("Lỗi lấy giỏ hàng:", err);
    }
    return [];
  };

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

    try {
      const currentCart = await getCurrentCartFromServer();
      const existingItem = currentCart.find(
        (item) => item.productVariant?.variantId === selectedVariant.variantId
      );

      const currentQtyInCart = existingItem ? existingItem.quantity : 0;
      if (currentQtyInCart + 1 > selectedVariant.stock) {
        alert(`Số lượng size này trong giỏ của bạn đã hết trong kho).`);
        return;
      }

      const cartItem = {
        userId: user.id || user.userId,
        variantId: selectedVariant.variantId,
        quantity: 1,
      };

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
              {selectedVariant?.stock > 0 ? `Còn hàng` : "Hết hàng"}
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

      <div
        style={{
          marginTop: "50px",
          borderTop: "1px solid #eee",
          paddingTop: "30px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ margin: 0, fontSize: "20px" }}>Đánh giá sản phẩm</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ fontSize: "12px", color: "#888" }}>
              ({reviews.length} đánh giá)
            </div>
          </div>
        </div>

        {reviews.length === 0 ? (
          <p
            style={{
              color: "#999",
              fontStyle: "italic",
              textAlign: "center",
              padding: "20px",
            }}
          >
            Chưa có đánh giá nào cho sản phẩm này.
          </p>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {reviews.map((rev) => (
              <div
                key={rev.reviewId}
                style={{
                  borderBottom: "1px solid #f5f5f5",
                  paddingBottom: "15px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "5px",
                  }}
                >
                  <strong style={{ fontSize: "14px", color: "#333" }}>
                    {rev.email}
                  </strong>
                  <span style={{ fontSize: "12px", color: "#aaa" }}>
                    {new Date(rev.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "8px",
                  }}
                >
                  <StaticStars rating={rev.rating} />
                  <span
                    style={{
                      fontSize: "11px",
                      backgroundColor: "#f0f0f0",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      color: "#666",
                    }}
                  >
                    Size: {rev.size}
                  </span>
                </div>

                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    color: "#444",
                    lineHeight: "1.6",
                  }}
                >
                  {rev.comment || "Khách hàng không để lại bình luận."}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
