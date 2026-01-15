import React, { useState, useEffect } from "react";
import "../../styles/ProductModalForm.css";

const API_BASE_URL = "http://localhost:8080/api";
const FIXED_SIZES = ["S", "M", "L", "XL", "XXL"];

export default function ProductFormModal({
  initialData,
  categories = [],
  onClose,
  onSave,
  onDelete,
}) {
  const prepareVariants = (existingVariants) => {
    return FIXED_SIZES.map((size) => {
      const found = existingVariants?.find((v) => v.size === size);
      return found ? { ...found } : { size: size, stock: 0 };
    });
  };

  const [form, setForm] = useState({
    productId: initialData?.productId || null,
    productName: initialData?.productName || "",
    price: initialData?.price || "",
    des: initialData?.des || "",
    variants: prepareVariants(initialData?.variants),
    category: initialData?.category || { categoryId: "" },
    imageUrl: initialData?.imageUrl || "",
    image: null,
  });

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleStockChange = (index, value) => {
    const updatedVariants = [...form.variants];
    updatedVariants[index].stock = parseInt(value) || 0;
    setForm({ ...form, variants: updatedVariants });
  };

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
        imageUrl: form.imageUrl,
        category: { categoryId: finalCategoryId },
        variants: form.variants,
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
      <div className="modal-content admin-product-modal">
        <h3>{initialData ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</h3>

        <div className="form-row">
          <div className="form-group">
            <label>Tên sản phẩm</label>
            <input
              name="productName"
              value={form.productName}
              onChange={handleChange}
            />
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
        </div>

        <div className="form-group">
          <label>Danh mục</label>
          <select
            name="categorySelect"
            value={isAddingNew ? "add-new" : form.category.categoryId}
            onChange={handleChange}
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
            />
          )}
        </div>

        <div className="form-group">
          <label>Mô tả sản phẩm</label>
          <textarea
            name="des"
            value={form.des}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="variants-section">
          <label>Quản lý kho hàng (Số lượng tồn)</label>
          <table className="variant-table">
            <thead>
              <tr>
                <th>Size</th>
                <th>Số lượng trong kho</th>
              </tr>
            </thead>
            <tbody>
              {form.variants.map((v, index) => (
                <tr key={v.size}>
                  <td className="size-label">{v.size}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={v.stock}
                      onChange={(e) => handleStockChange(index, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="form-group">
          <label>Ảnh sản phẩm</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
          />
        </div>

        <div className="modal-actions">
          {initialData && (
            <button
              className="delete-btn"
              onClick={() => onDelete(initialData.productId)}
            >
              Xóa sản phẩm
            </button>
          )}
          <div className="right-actions">
            <button
              className="save-btn"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? "Đang xử lý..." : "Lưu sản phẩm"}
            </button>
            <button className="cancel-btn" onClick={onClose}>
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
