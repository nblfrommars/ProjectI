import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../../styles/Checkout.css";

const API_BASE_URL = "http://localhost:8080";

const Checkout = ({ cart, clearCart }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const buyNowItem = location.state?.buyNowItem;
  const cartFromStorage = JSON.parse(localStorage.getItem("cart") || "[]");

  const safeCart = buyNowItem
    ? [buyNowItem]
    : cart && cart.length > 0
    ? cart
    : cartFromStorage;

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  const [address, setAddress] = useState(user?.address || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const getPrice = (item) =>
    Number(item.productVariant?.product?.price || item.price || 0);

  const getQuantity = (item) => Number(item.quantity || 0);

  const getVariantId = (item) =>
    item.productVariant?.variantId || item.variantId;

  const getProductName = (item) =>
    item.productVariant?.product?.productName || item.productName;

  const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/80?text=No+Image";
    if (url.startsWith("http")) return url;
    return `${API_BASE_URL}${url}`;
  };
  const totalPrice = safeCart.reduce((sum, item) => {
    return sum + getPrice(item) * getQuantity(item);
  }, 0);

  const handleConfirm = async () => {
    if (!user) {
      alert("Vui lòng đăng nhập để đặt hàng!");
      navigate("/login");
      return;
    }

    if (!address.trim() || !phone.trim()) {
      alert("Vui lòng nhập đầy đủ thông tin giao hàng!");
      return;
    }

    const orderRequest = {
      userId: user.id || user.userId,
      phoneNumber: phone,
      address: address,
      paymentMethod: paymentMethod,
      items: safeCart.map((item) => ({
        variantId: getVariantId(item),
        quantity: getQuantity(item),
      })),
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/orders/create`,
        orderRequest,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200 || response.status === 201) {
        if (!buyNowItem) {
          try {
            await axios.delete(
              `${API_BASE_URL}/api/cart/clear/${user.id || user.userId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            clearCart?.();
            localStorage.removeItem("cart");
          } catch (clearError) {
            console.error("Lỗi khi xóa giỏ hàng:", clearError);
          }
        }
        alert("Đặt hàng thành công!");
        navigate("/orders");
      }
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      const errorMessage = error.response?.data?.message || "Đặt hàng thất bại";
      alert(errorMessage);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-left">
          <h3>{buyNowItem ? "Sản phẩm mua ngay" : "Danh sách sản phẩm"}</h3>
          <div className="checkout-items-list">
            {safeCart.map((item, index) => (
              <div className="checkout-item" key={index}>
                <img
                  src={getImageUrl(
                    item.productVariant?.product?.imageUrl || item.imageUrl
                  )}
                  alt={getProductName(item)}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/80";
                  }}
                />
                <div className="item-info">
                  <p className="item-name">{getProductName(item)}</p>
                  <p className="item-spec">
                    Size: {item.productVariant?.size || item.size} | SL:{" "}
                    {getQuantity(item)}
                  </p>
                  <p className="item-price">
                    {(getPrice(item) * getQuantity(item)).toLocaleString()}₫
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="checkout-right">
          <h3>Thông tin giao hàng</h3>
          <div className="summary-card">
            <div className="summary-row total">
              <span>Tổng thanh toán:</span>
              <span>{totalPrice.toLocaleString()}₫</span>
            </div>
          </div>

          <div className="checkout-form">
            <div className="form-group">
              <label>Địa chỉ nhận hàng</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Số điện thoại</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="payment-method">
              <h4>Phương thức thanh toán</h4>
              <div className="payment-options">
                <button
                  className={`method-btn ${
                    paymentMethod === "COD" ? "active" : ""
                  }`}
                  onClick={() => setPaymentMethod("COD")}
                >
                  {" "}
                  Tiền mặt (COD){" "}
                </button>
                <button
                  className={`method-btn ${
                    paymentMethod === "VNPAY" ? "active" : ""
                  }`}
                  onClick={() => setPaymentMethod("VNPAY")}
                >
                  {" "}
                  Thanh toán online{" "}
                </button>
              </div>
            </div>

            <button className="btn-confirm-order" onClick={handleConfirm}>
              XÁC NHẬN ĐẶT HÀNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
