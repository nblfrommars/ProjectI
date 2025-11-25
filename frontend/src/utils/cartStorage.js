export function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

export function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function addToCart(item) {
  const cart = getCart();
  //Kiem tra san pham da ton tai trong gio chua
  const existing = cart.find((p) => p.id === item.id && p.size === item.size);

  if (existing) {
    existing.qty += item.qty;
  } else {
    cart.push(item);
  }

  saveCart(cart);
}
