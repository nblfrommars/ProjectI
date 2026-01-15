import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Cart.css";

const API_BASE_URL = "http://localhost:8080";

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const syncToLocalStorage = (cartData) => {
    localStorage.setItem("cart", JSON.stringify(cartData));
  };

  const fetchCart = async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/cart/${user.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 401 || res.status === 403) {
        alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      const data = await res.json();
      setCart(data);
      syncToLocalStorage(data);
    } catch (err) {
      console.error("Lỗi fetch giỏ hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const changeQty = async (cartId, currentQty, amount, stockAvailable) => {
    const newQty = currentQty + amount;
    if (newQty < 1) return;

    if (amount > 0 && newQty > stockAvailable) {
      alert(`Rất tiếc, size này đã không còn thêm cho bạn đặt mất rồi!.`);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/cart/update/${cartId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQty }),
      });

      if (res.ok) {
        const updatedCart = cart.map((item) =>
          item.cartId === cartId ? { ...item, quantity: newQty } : item
        );
        setCart(updatedCart);
        syncToLocalStorage(updatedCart);
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Không thể cập nhật số lượng.");
      }
    } catch (err) {
      console.error("Lỗi cập nhật số lượng:", err);
    }
  };

  const removeItem = async (cartId) => {
    if (!window.confirm("Bạn muốn xóa sản phẩm này khỏi giỏ hàng?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/cart/remove/${cartId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const updatedCart = cart.filter((item) => item.cartId !== cartId);
        setCart(updatedCart);
        syncToLocalStorage(updatedCart);
      } else {
        alert("Xóa sản phẩm thất bại.");
      }
    } catch (err) {
      console.error("Lỗi xóa sản phẩm:", err);
    }
  };

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + (item.productVariant?.product?.price || 0) * item.quantity,
    0
  );

  const handleGoToCheckout = () => {
    if (cart.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }
    syncToLocalStorage(cart);
    navigate("/checkout");
  };

  const getFullImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/80";
    if (url.startsWith("http")) return url;
    return `${API_BASE_URL}${url}`;
  };

  if (loading)
    return <div className="cart-container">Đang tải giỏ hàng...</div>;

  return (
    <div className="cart-container">
      <h1>Giỏ hàng của bạn</h1>

      {!user ? (
        <p className="empty">Vui lòng đăng nhập để xem giỏ hàng.</p>
      ) : cart.length === 0 ? (
        <p className="empty">Giỏ hàng của bạn đang trống. Mua sắm ngay!</p>
      ) : (
        <>
          <ul className="cart-list">
            {cart.map((item) => {
              const product = item.productVariant?.product;
              const variant = item.productVariant;

              return (
                <li key={item.cartId} className="cart-item">
                  <div className="left">
                    <img
                      src={getFullImageUrl(product?.imageUrl)}
                      alt={product?.productName}
                      className="thumb"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/80";
                      }}
                    />
                    <div>
                      <p className="name">{product?.productName}</p>
                      <p className="size">Size: {variant?.size}</p>
                      <p className="price">
                        {product?.price?.toLocaleString()}₫
                      </p>
                    </div>
                  </div>

                  <div className="right">
                    <div className="qty">
                      <button
                        onClick={() =>
                          changeQty(
                            item.cartId,
                            item.quantity,
                            -1,
                            variant?.stock
                          )
                        }
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          changeQty(
                            item.cartId,
                            item.quantity,
                            1,
                            variant?.stock
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="remove"
                      onClick={() => removeItem(item.cartId)}
                    >
                      Xóa
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="summary">
            <div className="row">
              <span>Tổng tiền:</span>
              <strong className="total-price">
                {subtotal.toLocaleString()}₫
              </strong>
            </div>
            <button className="checkout-btn" onClick={handleGoToCheckout}>
              Tiến hành thanh toán
            </button>
          </div>
        </>
      )}
    </div>
  );
}
