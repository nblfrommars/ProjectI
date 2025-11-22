import { Link } from "react-router-dom";

const ProductCard = ({ product }) => (
  <Link
    to={`/product/${product.id}`}
    style={{ textDecoration: "none", color: "inherit" }}
  >
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "6px",
        padding: "10px",
        textAlign: "center",
      }}
    >
      <img
        src={product.image}
        alt={product.name}
        style={{ width: "100%", height: "200px", objectFit: "cover" }}
      />
      <h3>{product.name}</h3>
      <p>{product.price.toLocaleString()}₫</p>
    </div>
  </Link>
);

export default ProductCard;
