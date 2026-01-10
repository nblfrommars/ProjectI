import React, { useState } from "react";
import ProductFormModal from "./ProductFormModal";
import products from "../../mockdata/products";
import categories from "../../mockdata/categories";
import "../../styles/ManageInventory.css";
export default function ManageInventory() {
  const [inventory, setInventory] = useState(products);
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [catModalOpen, setCatModalOpen] = useState(false);
  const updateStock = (id, newStock) => {
    setInventory((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: newStock } : p))
    );
  };

  const saveProduct = (product) => {
    if (product.id) {
      setInventory((prev) =>
        prev.map((p) => (p.id === product.id ? product : p))
      );
    } else {
      const newProduct = {
        ...product,
        id: Date.now(),
      };
      setInventory((prev) => [...prev, newProduct]);
    }
    setModalOpen(false);
  };

  const deleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setInventory((prev) => prev.filter((p) => p.id !== id));
      setModalOpen(false);
    }
  };
  const inventoryWithCategory = inventory.map((item) => {
    const category = categories.find((c) => c.id === item.categoryId);
    return {
      ...item,
      categoryName: category ? category.name : "Unknown",
    };
  });

  return (
    <div>
      <h2>Inventory Management</h2>

      <button
        className="add-btn"
        onClick={() => {
          setEditingProduct(null);
          setModalOpen(true);
        }}
      >
        + Add Product
      </button>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Adjust</th>
            <th>Edit Product Info</th>
          </tr>
        </thead>

        <tbody>
          {inventoryWithCategory.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.categoryName}</td>
              <td>{item.stock}</td>

              <td>
                <button onClick={() => updateStock(item.id, item.stock + 1)}>
                  +
                </button>
                <button onClick={() => updateStock(item.id, item.stock - 1)}>
                  -
                </button>
              </td>

              <td>
                <button
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
