import { Link } from "react-router-dom";
import "../styles/ProductCard.css";

const ProductCard = ({ product }) => (
  <Link
    to={`/product/${product.id}`}
    style={{ textDecoration: "none", color: "inherit" }}
  >
    <div className="product-card">
      <img src={product.image} alt={product.name} />

      <div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-brand">GLOWAY</p>
      </div>
      <div className="divider"></div>
      <p className="product-price">{product.price.toLocaleString()}₫</p>
    </div>
  </Link>
);

export default ProductCard;
