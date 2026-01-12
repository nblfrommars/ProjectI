import React, { useState, useEffect } from "react";
import ProductFormModal from "./ProductFormModal";
import "../../styles/ManageInventory.css";

const API_BASE_URL = "http://localhost:8080/api";
const IMAGE_BASE_URL = "http://localhost:8080";

export default function ManageInventory() {
  const [inventory, setInventory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch(`${API_BASE_URL}/products`),
        fetch(`${API_BASE_URL}/categories`),
      ]);
      const prodData = await prodRes.json();
      const catData = await catRes.json();
      setInventory(prodData);
      setCategories(catData);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const saveProduct = async (productData, imageFile) => {
    try {
      const formData = new FormData();
      formData.append(
        "product",
        new Blob([JSON.stringify(productData)], { type: "application/json" })
      );

      if (imageFile) {
        formData.append("image", imageFile);
      }

      let url = `${API_BASE_URL}/products`;
      let method = "POST";

      if (productData.productId) {
        url = `${API_BASE_URL}/products/${productData.productId}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method: method,
        body: formData,
      });

      if (response.ok) {
        alert("Lưu sản phẩm thành công!");
        fetchData();
        setModalOpen(false);
      } else {
        alert("Có lỗi xảy ra khi lưu!");
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        const res = await fetch(`${API_BASE_URL}/products/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setInventory((prev) => prev.filter((p) => p.productId !== id));
          setModalOpen(false);
        }
      } catch (error) {
        console.error("Lỗi khi xóa:", error);
      }
    }
  };

  if (loading)
    return <div style={{ padding: "20px" }}>Đang tải dữ liệu kho...</div>;

  return (
    <div className="manage-inventory">
      <h2>Quản lý kho hàng</h2>

      <button
        className="add-btn"
        onClick={() => {
          setEditingProduct(null);
          setModalOpen(true);
        }}
      >
        + Thêm sản phẩm
      </button>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Tên sản phẩm</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Chỉnh sửa</th>
          </tr>
        </thead>

        <tbody>
          {inventory.map((item) => (
            <tr key={item.productId}>
              <td>
                <img
                  src={
                    item.imageUrl
                      ? `${IMAGE_BASE_URL}${item.imageUrl}`
                      : "https://via.placeholder.com/50"
                  }
                  alt={item.productName}
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/50";
                  }}
                />
              </td>

              <td>{item.productName}</td>

              <td>{item.category?.categoryName || "N/A"}</td>

              <td>{item.stock}</td>

              <td>
                <button
                  className="edit-btn"
                  onClick={() => {
                    setEditingProduct(item);
                    setModalOpen(true);
                  }}
                >
                  Edit Product Info
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <ProductFormModal
          initialData={editingProduct}
          onClose={() => setModalOpen(false)}
          onSave={saveProduct}
          onDelete={deleteProduct}
          categories={categories}
        />
      )}
    </div>
  );
}
