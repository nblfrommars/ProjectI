import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Checkout.css";

const Checkout = ({ cart, clearCart }) => {
  const navigate = useNavigate();

  const cartFromStorage = JSON.parse(localStorage.getItem("cart") || "[]");
  const safeCart = Array.isArray(cart) && cart.length ? cart : cartFromStorage;

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  const totalPrice = safeCart.reduce((sum, item) => {
    const qty = Number(item.qty ?? item.quantity) || 0;
    const price = Number(item.price) || 0;
    return sum + price * qty;
  }, 0);

  const handleConfirm = () => {
    if (!address.trim()) {
      alert("Vui lòng nhập địa chỉ nhận hàng!");
      return;
    }
    if (!phone.trim()) {
      alert("Vui lòng nhập số điện thoại!");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const email = user.email || "không xác định";

    alert(`Đặt hàng thành công! Email xác nhận đã gửi đến: ${email}`);

    clearCart?.();
    navigate("/");
  };

  if (!safeCart.length)
    return <p style={{ textAlign: "center" }}>Giỏ hàng đang trống.</p>;

  return (
    <div className="checkout-page">
      <div className="checkout-left">
        <h3>Giỏ hàng</h3>
        {safeCart.map((item) => {
          const price = Number(item.price) || 0;
          const qty = Number(item.qty) || 0;
          return (
            <div className="checkout-item" key={`${item.id}-${item.size}`}>
              <img src={item.image} alt={item.name} />
              <div className="item-info">
                <p className="item-name">{item.name}</p>
                <p>Size: {item.size}</p>
                <p>Số lượng: {qty}</p>
                <p>{(price * qty).toLocaleString()}₫</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="checkout-right">
        <h3>Đơn hàng</h3>
        <p>
          <strong>Tổng tiền: </strong>
          {totalPrice.toLocaleString()}₫
        </p>

        <label>Địa chỉ nhận hàng</label>
        <input
          type="text"
          placeholder="Nhập địa chỉ"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <label>Số điện thoại</label>
        <input
          type="text"
          placeholder="Nhập số điện thoại"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <label>Ghi chú đơn hàng</label>
        <textarea
          placeholder="Ghi chú"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button className="confirm-btn" onClick={handleConfirm}>
          Xác nhận đặt hàng
        </button>
      </div>
    </div>
  );
};

export default Checkout;
