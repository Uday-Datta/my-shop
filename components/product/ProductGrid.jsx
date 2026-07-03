"use client";

import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";

const CATEGORIES = ["All", "Electronics", "Sports", "Home", "Accessories"];

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category !== "All") params.set("category", category);

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    };

    const debounce = setTimeout(fetchProducts, 300);
    return () => clearTimeout(debounce);
  }, [search, category]);

  return (
    <div>
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {/* Search */}
        <div className="relative flex-1">
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
            placeholder="Search products..."
            className="w-full pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                category === c
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-pulse"
            >
              <div className="aspect-square bg-gray-100 dark:bg-gray-800" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/3" />
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-3/4" />
                <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-full" />
                <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded w-1/4 mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-gray-900 dark:text-white mb-2">
            No products found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Try a different search term or category
          </p>
          <button
            onClick={() => {
              setSearch("");
              setCategory("All");
            }}
            className="btn-secondary mt-4 px-6"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">
            {products.length} product{products.length !== 1 ? "s" : ""} found
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p, index) => (
              <ProductCard key={p.id} product={p} priority={index === 0} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
