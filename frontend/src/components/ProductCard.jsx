import { Link } from "react-router-dom";
import "../styles/ProductCard.css";

const ProductCard = ({ product, baseUrl }) => {
  const totalStock =
    product.variants?.reduce((sum, variant) => sum + variant.stock, 0) || 0;
  const isOutOfStock = totalStock === 0;
  const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/150";
    if (url.startsWith("http")) return url;
    return `${baseUrl}${url}`;
  };
  return (
    <Link
      to={`/product/${product.productId}`}
      style={{
        textDecoration: "none",
        color: "inherit",
        pointerEvents: isOutOfStock ? "none" : "auto",
      }}
    >
      <div className={`product-card ${isOutOfStock ? "out-of-stock" : ""}`}>
        {isOutOfStock && <div className="out-of-stock-label">HẾT HÀNG</div>}

        <img
          src={getImageUrl(product.imageUrl)}
          alt={product.productName}
          style={{ opacity: isOutOfStock ? 0.5 : 1 }}
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
