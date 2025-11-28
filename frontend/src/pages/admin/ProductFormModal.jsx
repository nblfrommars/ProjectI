import React, { useState } from "react";
import "../../styles/ProductModalForm.css";

export default function ProductFormModal({
  initialData,
  onClose,
  onSave,
  onDelete,
}) {
  const [form, setForm] = useState(
    initialData || {
      name: "",
      category: "",
      price: "",
      description: "",
      image: "",
      stock: 0,
    }
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Price</label>
          <input name="price" value={form.price} onChange={handleChange} />
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
          <label>Image URL</label>
          <input name="image" value={form.image} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Initial Stock</label>
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
          />
        </div>

        <div className="modal-actions">
          {/* Delete only appears when editing */}
          {initialData && (
            <button
              className="delete-btn"
              onClick={() => onDelete(initialData)}
            >
              Delete
            </button>
          )}

          <div className="right-actions">
            <button className="save-btn" onClick={() => onSave(form)}>
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
