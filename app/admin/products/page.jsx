"use client";

import { useState, useEffect } from "react";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
  image: "",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
    };

    if (editingId) {
      await fetch(`/api/admin/products/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
    setLoading(false);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image: product.image || "",
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-gray-900 dark:text-white">Products</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {products.length} product{products.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setForm(EMPTY_FORM);
            setEditingId(null);
          }}
          className="btn-primary"
        >
          {showForm ? "Cancel" : "+ Add Product"}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="card p-6 mb-8">
          <h3 className="text-gray-900 dark:text-white mb-6">
            {editingId ? "Edit Product" : "New Product"}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            {[
              { label: "Name", key: "name", type: "text" },
              { label: "Category", key: "category", type: "text" },
              { label: "Price ($)", key: "price", type: "number" },
              { label: "Stock", key: "stock", type: "number" },
              { label: "Image URL", key: "image", type: "text" },
            ].map(({ label, key, type }) => (
              <div key={key}>
                <label className="label block mb-1.5">{label}</label>
                <input
                  type={type}
                  required={key !== "image"}
                  className="w-full"
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </div>
            ))}

            <div className="col-span-2">
              <label className="label block mb-1.5">Description</label>
              <textarea
                required
                rows={3}
                className="w-full"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div className="col-span-2 flex gap-3">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update Product"
                  : "Create Product"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setForm(EMPTY_FORM);
                  setEditingId(null);
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              <th className="text-left px-6 py-4">Name</th>
              <th className="text-left px-6 py-4">Category</th>
              <th className="text-left px-6 py-4">Price</th>
              <th className="text-left px-6 py-4">Stock</th>
              <th className="text-left px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 line-clamp-1">
                    {product.description}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span className="badge bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={
                      product.stock === 0
                        ? "text-red-500 dark:text-red-400 font-medium text-sm"
                        : "text-green-600 dark:text-green-400 font-medium text-sm"
                    }
                  >
                    {product.stock === 0
                      ? "Out of stock"
                      : `${product.stock} left`}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              No products yet.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary mt-4"
            >
              Add your first product
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
