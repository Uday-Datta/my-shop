"use client";

import { useState, useEffect } from "react";

const GRADIENTS = [
  { value: "from-purple-600 to-indigo-700", label: "🟣 Purple" },
  { value: "from-blue-600 to-cyan-600", label: "🔵 Blue" },
  { value: "from-orange-500 to-rose-600", label: "🟠 Orange" },
  { value: "from-green-500 to-emerald-600", label: "🟢 Green" },
  { value: "from-pink-500 to-rose-600", label: "🩷 Pink" },
  { value: "from-amber-500 to-orange-600", label: "🟡 Amber" },
  { value: "from-red-500 to-pink-600", label: "🔴 Red" },
  { value: "from-teal-500 to-cyan-600", label: "🩵 Teal" },
];

const EMPTY_FORM = {
  title: "",
  titlebn: "",
  subtitle: "",
  subtitlebn: "",
  cta: "",
  ctabn: "",
  href: "/",
  gradient: "from-purple-600 to-indigo-700",
  emoji: "",
  badge: "",
  badgebn: "",
  type: "HERO",
  active: true,
  order: 0,
};

export default function AdminBannersPage() {
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchBanners = async () => {
    const res = await fetch("/api/admin/banners");
    const data = await res.json();
    setBanners(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      order: parseInt(form.order) || 0,
      active: form.active === true || form.active === "true",
    };

    if (editingId) {
      await fetch(`/api/admin/banners/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
    setLoading(false);
    fetchBanners();
  };

  const handleEdit = (banner) => {
    setForm({
      title: banner.title,
      titlebn: banner.titlebn || "",
      subtitle: banner.subtitle || "",
      subtitlebn: banner.subtitlebn || "",
      cta: banner.cta || "",
      ctabn: banner.ctabn || "",
      href: banner.href,
      gradient: banner.gradient || GRADIENTS[0].value,
      emoji: banner.emoji || "",
      badge: banner.badge || "",
      badgebn: banner.badgebn || "",
      type: banner.type,
      active: banner.active,
      order: banner.order,
    });
    setEditingId(banner.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this banner?")) return;
    await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
    fetchBanners();
  };

  const toggleActive = async (banner) => {
    await fetch(`/api/admin/banners/${banner.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...banner, active: !banner.active }),
    });
    fetchBanners();
  };

  const heroBanners = banners.filter((b) => b.type === "HERO");
  const promoBanners = banners.filter((b) => b.type === "PROMO");

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-gray-900 dark:text-white">Banners</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage hero sliders and promo banners
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
          {showForm ? "Cancel" : "+ Add Banner"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-6 mb-8">
          <h3 className="text-gray-900 dark:text-white mb-6">
            {editingId ? "Edit Banner" : "New Banner"}
          </h3>

          {/* Live preview */}
          <div
            className={`rounded-xl bg-gradient-to-br ${form.gradient} p-5 mb-6 flex items-center justify-between`}
          >
            <div>
              {form.badge && (
                <span className="inline-block bg-white/20 text-white text-xs px-2 py-1 rounded-full mb-2">
                  {form.badge}
                </span>
              )}
              <p className="text-white font-bold text-lg">
                {form.title || "Banner Title"}
              </p>
              {form.titlebn && (
                <p className="text-white/80 text-sm">{form.titlebn}</p>
              )}
              {form.subtitle && (
                <p className="text-white/70 text-xs mt-1">{form.subtitle}</p>
              )}
              {form.cta && (
                <span className="inline-block bg-white text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-lg mt-3">
                  {form.cta}
                </span>
              )}
            </div>
            {form.emoji && <span className="text-5xl">{form.emoji}</span>}
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            {/* Type */}
            <div className="col-span-2">
              <label className="label block mb-1.5">Banner Type</label>
              <div className="flex gap-3">
                {["HERO", "PROMO"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm({ ...form, type: t })}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      form.type === t
                        ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {t === "HERO" ? "🎯 Hero Slider" : "📢 Promo Banner"}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="label block mb-1.5">Title (English)</label>
              <input
                type="text"
                required
                className="w-full"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div>
              <label className="label block mb-1.5">Title (বাংলা)</label>
              <input
                type="text"
                className="w-full"
                value={form.titlebn}
                onChange={(e) => setForm({ ...form, titlebn: e.target.value })}
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="label block mb-1.5">Subtitle (English)</label>
              <input
                type="text"
                className="w-full"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              />
            </div>

            <div>
              <label className="label block mb-1.5">Subtitle (বাংলা)</label>
              <input
                type="text"
                className="w-full"
                value={form.subtitlebn}
                onChange={(e) =>
                  setForm({ ...form, subtitlebn: e.target.value })
                }
              />
            </div>

            {/* CTA */}
            <div>
              <label className="label block mb-1.5">
                Button Text (English)
              </label>
              <input
                type="text"
                placeholder="Shop Now"
                className="w-full"
                value={form.cta}
                onChange={(e) => setForm({ ...form, cta: e.target.value })}
              />
            </div>

            <div>
              <label className="label block mb-1.5">Button Text (বাংলা)</label>
              <input
                type="text"
                placeholder="এখনই কিনুন"
                className="w-full"
                value={form.ctabn}
                onChange={(e) => setForm({ ...form, ctabn: e.target.value })}
              />
            </div>

            {/* Badge */}
            <div>
              <label className="label block mb-1.5">Badge (English)</label>
              <input
                type="text"
                placeholder="New Season"
                className="w-full"
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
              />
            </div>

            <div>
              <label className="label block mb-1.5">Badge (বাংলা)</label>
              <input
                type="text"
                placeholder="নতুন সিজন"
                className="w-full"
                value={form.badgebn}
                onChange={(e) => setForm({ ...form, badgebn: e.target.value })}
              />
            </div>

            {/* Link */}
            <div>
              <label className="label block mb-1.5">Link URL</label>
              <input
                type="text"
                required
                placeholder="/category/fashion"
                className="w-full"
                value={form.href}
                onChange={(e) => setForm({ ...form, href: e.target.value })}
              />
            </div>

            {/* Emoji */}
            <div>
              <label className="label block mb-1.5">Emoji</label>
              <input
                type="text"
                placeholder="👗"
                className="w-full"
                value={form.emoji}
                onChange={(e) => setForm({ ...form, emoji: e.target.value })}
              />
            </div>

            {/* Gradient */}
            <div className="col-span-2">
              <label className="label block mb-1.5">Background Gradient</label>
              <div className="grid grid-cols-4 gap-2">
                {GRADIENTS.map((g) => (
                  <button
                    key={g.value}
                    type="button"
                    onClick={() => setForm({ ...form, gradient: g.value })}
                    className={`h-10 rounded-lg bg-gradient-to-br ${
                      g.value
                    } transition-all ${
                      form.gradient === g.value
                        ? "ring-2 ring-offset-2 ring-gray-900 dark:ring-white scale-105"
                        : "opacity-70 hover:opacity-100"
                    }`}
                    title={g.label}
                  />
                ))}
              </div>
            </div>

            {/* Order and Active */}
            <div>
              <label className="label block mb-1.5">Display Order</label>
              <input
                type="number"
                min="0"
                className="w-full"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: e.target.value })}
              />
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setForm({ ...form, active: !form.active })}
                  className={`w-11 h-6 rounded-full transition-colors ${
                    form.active
                      ? "bg-green-500"
                      : "bg-gray-300 dark:bg-gray-600"
                  } relative`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      form.active ? "translate-x-5" : ""
                    }`}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {form.active ? "Active" : "Inactive"}
                </span>
              </label>
            </div>

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
                  ? "Update Banner"
                  : "Create Banner"}
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

      {/* Hero Banners */}
      <div className="mb-8">
        <h3 className="text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          🎯 Hero Slider
          <span className="badge bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            {heroBanners.length} banners
          </span>
        </h3>
        <div className="space-y-3">
          {heroBanners.map((banner) => (
            <div key={banner.id} className="card overflow-hidden">
              <div className="flex items-center gap-4 p-4">
                {/* Color preview */}
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${banner.gradient} flex items-center justify-center text-2xl flex-shrink-0`}
                >
                  {banner.emoji || "🎯"}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {banner.title}
                    </p>
                    {banner.titlebn && (
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {banner.titlebn}
                      </p>
                    )}
                  </div>
                  {banner.subtitle && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {banner.subtitle}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    → {banner.href} · Order: {banner.order}
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  {/* Active toggle */}
                  <button
                    onClick={() => toggleActive(banner)}
                    className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                      banner.active
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {banner.active ? "Active" : "Inactive"}
                  </button>

                  <button
                    onClick={() => handleEdit(banner)}
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Promo Banners */}
      <div>
        <h3 className="text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          📢 Promo Banners
          <span className="badge bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            {promoBanners.length} banners
          </span>
        </h3>
        <div className="space-y-3">
          {promoBanners.map((banner) => (
            <div key={banner.id} className="card overflow-hidden">
              <div className="flex items-center gap-4 p-4">
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${banner.gradient} flex items-center justify-center text-2xl flex-shrink-0`}
                >
                  {banner.emoji || "📢"}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {banner.title}
                    </p>
                    {banner.titlebn && (
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {banner.titlebn}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    → {banner.href} · Order: {banner.order}
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    onClick={() => toggleActive(banner)}
                    className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                      banner.active
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {banner.active ? "Active" : "Inactive"}
                  </button>
                  <button
                    onClick={() => handleEdit(banner)}
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
