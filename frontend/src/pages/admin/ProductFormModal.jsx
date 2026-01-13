import React, { useState, useEffect } from "react";
import "../../styles/ProductModalForm.css";

const API_BASE_URL = "http://localhost:8080/api";

export default function ProductFormModal({
  initialData,
  categories = [],
  onClose,
  onSave,
  onDelete,
}) {
  const [form, setForm] = useState({
    productId: initialData?.productId || null,
    productName: initialData?.productName || "",
    price: initialData?.price || "",
    des: initialData?.des || "",
    stock: initialData?.stock || 0,
    category: initialData?.category || { categoryId: "" },
    imageUrl: initialData?.imageUrl || "",
    image: null,
  });

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "categorySelect") {
      if (value === "add-new") {
        setIsAddingNew(true);
        setForm({ ...form, category: { categoryId: "" } });
      } else {
        setIsAddingNew(false);
        setForm({ ...form, category: { categoryId: value } });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSave = async () => {
    if (!form.productName) return alert("Vui lòng nhập tên sản phẩm!");
    if (!isAddingNew && !form.category.categoryId)
      return alert("Vui lòng chọn danh mục!");
    if (isAddingNew && !newCategoryName)
      return alert("Vui lòng nhập tên danh mục mới!");

    setIsSaving(true);
    try {
      let finalCategoryId = form.category.categoryId;

      if (isAddingNew) {
        const catRes = await fetch(`${API_BASE_URL}/categories`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ categoryName: newCategoryName }),
        });
        if (catRes.ok) {
          const newCat = await catRes.json();
          finalCategoryId = newCat.categoryId;
        } else {
          throw new Error("Không thể lưu danh mục mới");
        }
      }

      const productObject = {
        productId: form.productId,
        productName: form.productName,
        price: form.price,
        des: form.des,
        stock: form.stock,
        imageUrl: form.imageUrl,
        category: { categoryId: finalCategoryId },
      };

      onSave(productObject, form.image);
    } catch (error) {
      alert("Lỗi: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>{initialData ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</h3>

        <div className="form-group">
          <label>Tên sản phẩm</label>
          <input
            name="productName"
            value={form.productName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Danh mục</label>
          <select
            name="categorySelect"
            value={isAddingNew ? "add-new" : form.category.categoryId}
            onChange={handleChange}
            className="category-select"
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cat) => (
              <option key={cat.categoryId} value={cat.categoryId}>
                {cat.categoryName}
              </option>
            ))}
            <option
              value="add-new"
              style={{ color: "#318be5", fontWeight: "bold" }}
            >
              + Thêm danh mục mới...
            </option>
          </select>

          {isAddingNew && (
            <input
              style={{ marginTop: "10px", borderColor: "#318be5" }}
              placeholder="Nhập tên danh mục mới"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              autoFocus
            />
          )}
        </div>

        <div className="form-group">
          <label>Giá bán (VND)</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Mô tả sản phẩm</label>
          <textarea name="des" value={form.des} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Ảnh sản phẩm</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
          />
          {initialData?.imageUrl && !form.image && (
            <p style={{ fontSize: "11px" }}>
              Ảnh hiện tại: {initialData.imageUrl}
            </p>
          )}
        </div>

        <div className="form-group">
          <label>Số lượng kho</label>
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
          />
        </div>

        <div className="modal-actions">
          {initialData && (
            <button
              className="delete-btn"
              onClick={() => onDelete(initialData.productId)}
              disabled={isSaving}
            >
              Xóa
            </button>
          )}

          <div className="right-actions">
            <button
              className="save-btn"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Đang xử lý..." : "Lưu"}
            </button>
            <button
              className="cancel-btn"
              onClick={onClose}
              disabled={isSaving}
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
