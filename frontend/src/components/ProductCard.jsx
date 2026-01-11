import { Link } from "react-router-dom";
import "../styles/ProductCard.css";

const ProductCard = ({ product }) => (
  <Link
    to={`/product/${product.productId}`}
    style={{ textDecoration: "none", color: "inherit" }}
  >
    <div className="product-card">
      <img src={product.imageUrl} alt={product.productName} />

      <div>
        <h3 className="product-name">{product.productName}</h3>
        <p className="product-brand">GLOWAY</p>
      </div>
      <div className="divider"></div>
      <p className="product-price">
        {product.price ? product.price.toLocaleString() : "0"}₫
      </p>
    </div>
  </Link>
);

export default ProductCard;
