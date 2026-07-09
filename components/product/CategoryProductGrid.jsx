"use client";

import { useState, useEffect, useCallback } from "react";
import ProductCard from "./ProductCard";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export default function CategoryProductGrid({ categorySlug }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("category", categorySlug);
    if (search) params.set("search", search);
    if (sort) params.set("sort", sort);

    const res = await fetch(`/api/products?${params.toString()}`);
    let data = await res.json();

    if (priceRange.min) {
      data = data.filter((p) => p.price >= parseFloat(priceRange.min));
    }
    if (priceRange.max) {
      data = data.filter((p) => p.price <= parseFloat(priceRange.max));
    }

    if (sort === "rating") {
      data = data.sort((a, b) => b.averageRating - a.averageRating);
    }

    setProducts(data);
    setLoading(false);
  }, [categorySlug, search, sort, priceRange]);

  useEffect(() => {
    const debounce = setTimeout(fetchProducts, 300);
    return () => clearTimeout(debounce);
  }, [fetchProducts]);

  const clearFilters = () => {
    setSearch("");
    setSort("newest");
    setPriceRange({ min: "", max: "" });
  };

  const hasActiveFilters =
    search || sort !== "newest" || priceRange.min || priceRange.max;

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search in this category..."
            className="w-full pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
            filterOpen || priceRange.min || priceRange.max
              ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-transparent"
              : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
            />
          </svg>
          Filter
          {(priceRange.min || priceRange.max) && (
            <span className="w-2 h-2 bg-red-500 rounded-full" />
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Filter panel */}
      {filterOpen && (
        <div className="card p-5 mb-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            Price Range
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="label block mb-1.5">Min (৳)</label>
              <input
                type="number"
                placeholder="0"
                className="w-full"
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, min: e.target.value })
                }
              />
            </div>
            <span className="text-gray-400 mt-5">—</span>
            <div className="flex-1">
              <label className="label block mb-1.5">Max (৳)</label>
              <input
                type="number"
                placeholder="Any"
                className="w-full"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, max: e.target.value })
                }
              />
            </div>
            <button
              onClick={() => setPriceRange({ min: "", max: "" })}
              className="btn-secondary mt-5 px-3 py-2 text-xs"
            >
              Reset
            </button>
          </div>

          <div className="flex gap-2 flex-wrap mt-3">
            {[
              { label: "Under ৳500", min: "", max: "500" },
              { label: "৳500–1000", min: "500", max: "1000" },
              { label: "৳1000–5000", min: "1000", max: "5000" },
              { label: "Over ৳5000", min: "5000", max: "" },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() =>
                  setPriceRange({ min: preset.min, max: preset.max })
                }
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  priceRange.min === preset.min && priceRange.max === preset.max
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {!loading && (
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
          {products.length} product{products.length !== 1 ? "s" : ""} found
          {search && ` for "${search}"`}
        </p>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-pulse"
            >
              <div className="aspect-square bg-gray-100 dark:bg-gray-800" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/3" />
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-3/4" />
                <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded w-1/4 mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 card">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-gray-900 dark:text-white mb-2">
            No products found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            Try adjusting your search or filters
          </p>
          <button onClick={clearFilters} className="btn-primary px-6">
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={index < 4}
            />
          ))}
        </div>
      )}
    </div>
  );
}
