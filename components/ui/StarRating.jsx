"use client";

import { useState } from "react";

export default function StarRating({
  rating = 0,
  max = 5,
  interactive = false,
  size = "md",
  onChange,
}) {
  const [hovered, setHovered] = useState(0);

  const sizes = {
    sm: "w-3.5 h-3.5",
    md: "w-5 h-5",
    lg: "w-7 h-7",
  };

  const active = hovered || rating;

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(max)].map((_, i) => {
        const value = i + 1;
        const filled = value <= active;

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(value)}
            onMouseEnter={() => interactive && setHovered(value)}
            onMouseLeave={() => interactive && setHovered(0)}
            className={`transition-all duration-100 ${
              interactive ? "cursor-pointer hover:scale-110" : "cursor-default"
            } disabled:cursor-default`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className={`${sizes[size]} transition-colors duration-100 ${
                filled
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-gray-200 dark:fill-gray-700 text-gray-200 dark:text-gray-700"
              }`}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
