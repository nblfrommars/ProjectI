import { Link } from "react-router-dom";
import "../styles/ProductCard.css";

const ProductCard = ({ product, baseUrl }) => {
  const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/150";
    if (url.startsWith("http")) return url;
    return `${baseUrl}${url}`;
  };
  return (
    <Link
      to={`/product/${product.productId}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="product-card">
        <img
          src={getImageUrl(product.imageUrl)}
          alt={product.productName}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/150";
          }}
        />

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
};

export default ProductCard;
