import React, { useState } from "react";
import "../../styles/ProductModalForm.css";

export default function ProductFormModal({
  initialData,
  categories = [],
  onClose,
  onSave,
  onDelete,
}) {
  const [form, setForm] = useState(
    initialData || {
      name: "",
      categoryId: "",
      price: "",
      description: "",
      image: null,
      stock: 0,
    }
  );

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "categorySelect") {
      if (value === "add-new") {
        setIsAddingNew(true);
        setForm({ ...form, categoryId: "" });
      } else {
        setIsAddingNew(false);
        setForm({ ...form, categoryId: value });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSave = () => {
    const finalData = {
      ...form,
      newCategoryName: isAddingNew ? newCategoryName : null,
      categoryId: isAddingNew ? null : form.categoryId,
    };

    if (isAddingNew && !newCategoryName) {
      alert("Vui lòng nhập tên danh mục mới!");
      return;
    }
    if (!isAddingNew && !form.categoryId) {
      alert("Vui lòng chọn một danh mục!");
      return;
    }

    onSave(finalData);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>{initialData ? "Edit Product" : "Add Product"}</h3>

        <div className="form-group">
          <label>Product Name</label>
          <input name="name" value={form.name} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            name="categorySelect"
            value={isAddingNew ? "add-new" : form.categoryId}
            onChange={handleChange}
            className="category-select"
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
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
              placeholder="Nhập tên danh mục mới (vd: Quần Jean)"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              autoFocus
            />
          )}
        </div>

        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="VND"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Upload Image</label>
          <input
            type="file"
            onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
          />
          {form.image && (
            <p style={{ fontSize: "12px" }}>
              Selected: {form.image.name || "Current Image"}
            </p>
          )}
        </div>

        <div className="form-group">
          <label>Stock</label>
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
              onClick={() => onDelete(initialData)}
            >
              Delete
            </button>
          )}

          <div className="right-actions">
            <button className="save-btn" onClick={handleSave}>
              Save
            </button>
            <button className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
