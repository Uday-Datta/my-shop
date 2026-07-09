"use client";

import { useState, useEffect } from "react";
import ImageUpload from "@/components/ui/ImageUpload";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  categoryId: "",
  stock: "",
  image: "",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
  };

  const fetchCategories = async () => {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      categoryId: form.categoryId || null,
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
      categoryId: product.categoryId || "",
      stock: product.stock,
      image: product.image || "",
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;

    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (!res.ok) {
      if (data.code === "HAS_ORDERS") {
        const archive = confirm(
          `${data.error}\n\nWould you like to set stock to 0 instead? This hides it from customers while keeping order history intact.`
        );
        if (archive) {
          const product = products.find((p) => p.id === id);
          await fetch(`/api/admin/products/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: product.name,
              description: product.description,
              price: product.price,
              stock: 0,
              categoryId: product.categoryId || null,
              image: product.image,
            }),
          });
          fetchProducts();
        }
      } else {
        alert(data.error || "Failed to delete product");
      }
      return;
    }

    fetchProducts();
  };

  const parentCategories = categories.filter((c) => !c.parentId);

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

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="label block mb-1.5">Name</label>
                <input
                  type="text"
                  required
                  className="w-full"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              {/* Category dropdown */}
              <div>
                <label className="label block mb-1.5">Category</label>
                <select
                  className="w-full"
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm({ ...form, categoryId: e.target.value })
                  }
                >
                  <option value="">Select a category</option>
                  {parentCategories.map((parent) => (
                    <optgroup
                      key={parent.id}
                      label={`${parent.icon || ""} ${parent.name}`}
                    >
                      <option value={parent.id}>
                        {parent.icon} {parent.name} (All)
                      </option>
                      {categories
                        .filter((c) => c.parentId === parent.id)
                        .map((sub) => (
                          <option key={sub.id} value={sub.id}>
                            {sub.icon} {sub.name}
                          </option>
                        ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="label block mb-1.5">Price (৳)</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  min="0"
                  className="w-full"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>

              {/* Stock */}
              <div>
                <label className="label block mb-1.5">Stock</label>
                <input
                  type="number"
                  required
                  min="0"
                  className="w-full"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                />
              </div>

              {/* Description */}
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

              {/* Image upload */}
              <div className="col-span-2">
                <label className="label block mb-1.5">Product Image</label>
                <ImageUpload
                  value={form.image}
                  onChange={(url) => setForm({ ...form, image: url })}
                />
              </div>

              {/* Action buttons */}
              <div className="col-span-2 flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center gap-2"
                >
                  {loading && (
                    <div className="w-4 h-4 border-2 border-white dark:border-gray-900 border-t-transparent rounded-full animate-spin" />
                  )}
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
            </div>
          </form>
        </div>
      )}

      {/* Products table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              <th className="text-left px-6 py-4">Product</th>
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
                {/* Product name + thumbnail */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover bg-gray-100 dark:bg-gray-800 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-400 text-xs">No img</span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 line-clamp-1">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="px-6 py-4">
                  <span className="badge bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    {product.category?.icon}{" "}
                    {product.category?.name || "Uncategorized"}
                  </span>
                </td>

                {/* Price */}
                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white text-sm">
                  ৳{product.price.toFixed(2)}
                </td>

                {/* Stock */}
                <td className="px-6 py-4">
                  <span
                    className={`text-sm font-medium ${
                      product.stock === 0
                        ? "text-red-500 dark:text-red-400"
                        : product.stock <= 5
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-green-600 dark:text-green-400"
                    }`}
                  >
                    {product.stock === 0
                      ? "Out of stock"
                      : `${product.stock} left`}
                  </span>
                </td>

                {/* Actions */}
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
