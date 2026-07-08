"use client";

import { useState, useEffect } from "react";

const EMPTY_FORM = {
  name: "",
  namebn: "",
  slug: "",
  description: "",
  icon: "",
  parentId: "",
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Auto-generate slug from name
  const handleNameChange = (value) => {
    const slug = value
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    setForm({ ...form, name: value, slug });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      parentId: form.parentId || null,
    };

    if (editingId) {
      await fetch(`/api/admin/categories/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
    setLoading(false);
    fetchCategories();
  };

  const handleEdit = (cat) => {
    setForm({
      name: cat.name,
      namebn: cat.namebn || "",
      slug: cat.slug,
      description: cat.description || "",
      icon: cat.icon || "",
      parentId: cat.parentId || "",
    });
    setEditingId(cat.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (
      !confirm(
        "Delete this category? Products in it will become uncategorized."
      )
    )
      return;
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    fetchCategories();
  };

  const parentCategories = categories.filter((c) => !c.parentId);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-gray-900 dark:text-white">Categories</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {categories.length} categories total
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
          {showForm ? "Cancel" : "+ Add Category"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-6 mb-8">
          <h3 className="text-gray-900 dark:text-white mb-6">
            {editingId ? "Edit Category" : "New Category"}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="label block mb-1.5">Name (English)</label>
              <input
                type="text"
                required
                className="w-full"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
              />
            </div>

            <div>
              <label className="label block mb-1.5">Name (বাংলা)</label>
              <input
                type="text"
                className="w-full"
                value={form.namebn}
                onChange={(e) => setForm({ ...form, namebn: e.target.value })}
              />
            </div>

            <div>
              <label className="label block mb-1.5">
                Slug (auto-generated)
              </label>
              <input
                type="text"
                required
                className="w-full"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
              />
            </div>

            <div>
              <label className="label block mb-1.5">Icon (emoji)</label>
              <input
                type="text"
                placeholder="👗"
                className="w-full"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
              />
            </div>

            <div>
              <label className="label block mb-1.5">
                Parent Category (optional)
              </label>
              <select
                className="w-full"
                value={form.parentId}
                onChange={(e) => setForm({ ...form, parentId: e.target.value })}
              >
                <option value="">None (top-level category)</option>
                {parentCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label block mb-1.5">Description</label>
              <input
                type="text"
                className="w-full"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div className="col-span-2 flex gap-3">
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
                  ? "Update Category"
                  : "Create Category"}
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

      {/* Categories tree */}
      <div className="space-y-4">
        {parentCategories.map((cat) => (
          <div key={cat.id} className="card overflow-hidden">
            {/* Parent row */}
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cat.icon}</span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {cat.name}
                  </p>
                  {cat.namebn && (
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {cat.namebn}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    /{cat.slug} · {cat.children?.length || 0} subcategories
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(cat)}
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Children */}
            {cat.children?.length > 0 && (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {cat.children.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between px-6 py-3 pl-14"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{sub.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {sub.name}
                        </p>
                        {sub.namebn && (
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {sub.namebn}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          /{sub.slug}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(sub)}
                        className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(sub.id)}
                        className="btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
