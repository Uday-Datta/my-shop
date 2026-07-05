"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useCategories } from "@/lib/CategoriesContext";

export default function MegaMenu() {
  const categories = useCategories();
  const [activeId, setActiveId] = useState(null);
  const timeoutRef = useRef(null);

  const handleMouseEnter = (id) => {
    clearTimeout(timeoutRef.current);
    setActiveId(id);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveId(null), 150);
  };

  const activeCategory = categories.find((c) => c.id === activeId);

  return (
    <div className="relative hidden md:flex items-center gap-1">
      {categories.map((cat) => (
        <div
          key={cat.id}
          onMouseEnter={() => handleMouseEnter(cat.id)}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            href={`/category/${cat.slug}`}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeId === cat.id
                ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
            {cat.children?.length > 0 && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`w-3 h-3 transition-transform duration-200 ${
                  activeId === cat.id ? "rotate-180" : ""
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
          </Link>
        </div>
      ))}

      {/* Mega dropdown */}
      {activeId && activeCategory?.children?.length > 0 && (
        <div
          onMouseEnter={() => handleMouseEnter(activeId)}
          onMouseLeave={handleMouseLeave}
          className="absolute top-full left-0 mt-1 w-[520px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 z-50 p-6"
        >
          {/* Dropdown header */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{activeCategory.icon}</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {activeCategory.name}
                </p>
                {activeCategory.namebn && (
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {activeCategory.namebn}
                  </p>
                )}
              </div>
            </div>
            <Link
              href={`/category/${activeCategory.slug}`}
              className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white underline underline-offset-2"
            >
              View all →
            </Link>
          </div>

          {/* Subcategory grid */}
          <div className="grid grid-cols-3 gap-2">
            {activeCategory.children.map((sub) => (
              <Link
                key={sub.id}
                href={`/category/${sub.slug}`}
                onClick={() => setActiveId(null)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">
                  {sub.icon}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
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
        </div>
      )}
    </div>
  );
}
