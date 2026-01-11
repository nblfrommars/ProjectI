const ShopSidebar = ({ categories, selectedCategory, setSelectedCategory }) => {
  return (
    <aside
      style={{
        width: "220px",
        background: "#f197deff",
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <h3
        style={{ marginBottom: "15px", fontWeight: "600", textAlign: "center" }}
      >
        Categories
      </h3>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        <li
          onClick={() => setSelectedCategory(null)}
          style={{
            marginBottom: "10px",
            cursor: "pointer",
            fontWeight: selectedCategory === null ? "700" : "400",
            textAlign: "center",
            padding: "8px",
            borderBottom: "1px solid rgba(0,0,0,0.2)",
            borderRadius: "4px",
            transition: "0.2s",
          }}
          //chuyen chuot thi doi mau
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#d9a4f9")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          All
        </li>

        {categories.map((cat) => (
          <li
            key={cat.categoryId}
            onClick={() => setSelectedCategory(cat.categoryId)}
            style={{
              marginBottom: "10px",
              cursor: "pointer",
              fontWeight: selectedCategory === cat.categoryId ? "700" : "400",
              textAlign: "center",
              padding: "8px",
              borderBottom: "1px solid rgba(0,0,0,0.2)",
              borderRadius: "4px",
              transition: "0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#d9a4f9")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            {cat.categoryName}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default ShopSidebar;
