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
        height: "350px",
        width: "200px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <img
        src={product.image}
        alt={product.name}
        style={{ width: "100%", height: "200px", objectFit: "cover" }}
      />

      <h3
        style={{
          fontSize: "16px",
          height: "40px",
          lineHeight: "20px",
          margin: "10px 0 5px 0",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {product.name}
      </h3>

      <p
        style={{
          height: "24px",
          lineHeight: "24px",
          margin: 0,
          fontWeight: "600",
          color: "#1a73e8",
        }}
      >
        {product.price.toLocaleString()}₫
      </p>
    </div>
  </Link>
);

export default ProductCard;
