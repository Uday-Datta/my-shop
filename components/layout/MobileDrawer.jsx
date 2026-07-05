"use client";

import { useState } from "react";
import Link from "next/link";
import { useCategories } from "@/lib/CategoriesContext";

export default function MobileDrawer({ open, onClose }) {
  const categories = useCategories();
  const [expandedId, setExpandedId] = useState(null);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 z-50 md:hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            My Shop
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Categories */}
        <div className="flex-1 overflow-y-auto py-4">
          <p className="px-5 mb-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Categories
          </p>

          {categories.map((cat) => (
            <div key={cat.id}>
              {/* Parent category */}
              <button
                onClick={() =>
                  setExpandedId(expandedId === cat.id ? null : cat.id)
                }
                className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{cat.icon}</span>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {cat.name}
                    </p>
                    {cat.namebn && (
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {cat.namebn}
                      </p>
                    )}
                  </div>
                </div>
                {cat.children?.length > 0 && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      expandedId === cat.id ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </button>

              {/* Subcategories */}
              {expandedId === cat.id && cat.children?.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800/50">
                  <Link
                    href={`/category/${cat.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-2 px-12 py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    View all {cat.name}
                  </Link>
                  {cat.children.map((sub) => (
                    <Link
                      key={sub.id}
                      href={`/category/${sub.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-3 px-12 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span className="text-sm">{sub.icon}</span>
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {sub.name}
                        </p>
                        {sub.namebn && (
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {sub.namebn}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer links */}
        <div className="border-t border-gray-100 dark:border-gray-800 py-4 px-5 space-y-1">
          <Link
            href="/orders"
            onClick={onClose}
            className="flex items-center gap-3 py-2.5 text-sm text-gray-700 dark:text-gray-300"
          >
            <span>📦</span> My Orders
          </Link>
          <Link
            href="/cart"
            onClick={onClose}
            className="flex items-center gap-3 py-2.5 text-sm text-gray-700 dark:text-gray-300"
          >
            <span>🛒</span> My Cart
          </Link>
        </div>
      </div>
    </>
  );
}
