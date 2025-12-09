import React, { useState } from "react";
import "../../styles/CategoryModalForm.css";

export default function CategoryFormModal({
  initialData,
  onClose,
  onSave,
  onDelete,
}) {
  const [form, setForm] = useState(
    initialData || {
      name: "",
      description: "",
    }
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>{initialData ? "Edit Category" : "Add Category"}</h3>

        <div className="form-group">
          <label>Category Name</label>
          <input name="name" value={form.name} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
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
