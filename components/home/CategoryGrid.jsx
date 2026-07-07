"use client";

import Link from "next/link";
import { useCategories } from "@/lib/CategoriesContext";

export default function CategoryGrid() {
  const categories = useCategories();

  if (categories.length === 0) return null;

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-gray-900 dark:text-white text-xl md:text-2xl">
            Shop by Category
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            ক্যাটাগরি অনুযায়ী কেনাকাটা করুন
          </p>
        </div>
        <Link
          href="/category"
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1"
        >
          See all
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>

      {/* Category tiles */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {categories.map((cat, index) => {
          const colors = [
            "bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30",
            "bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30",
            "bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30",
            "bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30",
            "bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/30",
          ];

          return (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-200 hover:scale-105 ${
                colors[index % colors.length]
              }`}
            >
              <span className="text-3xl md:text-4xl">{cat.icon}</span>
              <div className="text-center">
                <p className="text-xs md:text-sm font-semibold text-gray-800 dark:text-gray-200 leading-tight">
                  {cat.name}
                </p>
                {cat.namebn && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">
                    {cat.namebn}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
