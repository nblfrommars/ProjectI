import React, { useState, useEffect } from "react";
import { getCart, saveCart } from "../../utils/cartStorage";
import { useNavigate } from "react-router-dom";
import "../../styles/Cart.css";

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    saveCart(newCart);
  };

  const changeQty = (id, size, amount) => {
    const updated = cart.map((item) => {
      if (item.id === id && item.size === size) {
        return { ...item, qty: Math.max(1, item.qty + amount) };
      }
      return item;
    });
    updateCart(updated);
  };

  const removeItem = (id, size) => {
    const updated = cart.filter(
      (item) => !(item.id === id && item.size === size)
    );
    updateCart(updated);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="cart-container">
      <h1>Giỏ hàng</h1>

      {cart.length === 0 ? (
        <p className="empty">Giỏ hàng đang trống.</p>
      ) : (
        <>
          <ul className="cart-list">
            {cart.map((item) => (
              <li key={`${item.id}-${item.size}`} className="cart-item">
                <div className="left">
                  <img src={item.image} alt={item.name} className="thumb" />
                  <div>
                    <p className="name">{item.name}</p>
                    <p className="size">Size: {item.size}</p>
                    <p className="price">{item.price.toLocaleString()}₫</p>
                  </div>
                </div>

                <div className="right">
                  <div className="qty">
                    <button onClick={() => changeQty(item.id, item.size, -1)}>
                      -
                    </button>
                    <span>{item.qty}</span>
                    <button onClick={() => changeQty(item.id, item.size, 1)}>
                      +
                    </button>
                  </div>
                  <button
                    className="remove"
                    onClick={() => removeItem(item.id, item.size)}
                  >
                    Xóa
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="summary">
            <div className="row">
              <span>Tạm tính:</span>
              <strong>{subtotal.toLocaleString()}₫</strong>
            </div>

            <button
              className="checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              Đặt Hàng
            </button>
          </div>
        </>
      )}
    </div>
  );
}
