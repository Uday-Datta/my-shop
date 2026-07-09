"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductImageGallery({ images, productName }) {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState(null);

  const displayImages =
    images.length > 0 ? images : ["https://placehold.co/600x600?text=No+Image"];

  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && current < displayImages.length - 1)
        setCurrent(current + 1);
      if (diff < 0 && current > 0) setCurrent(current - 1);
    }
    setTouchStart(null);
  };

  return (
    <div>
      {/* Main image */}
      <div
        className="aspect-square bg-gray-100 dark:bg-gray-800 relative rounded-2xl overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={displayImages[current]}
          alt={productName}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          className="object-cover"
        />

        {/* Dot indicators — only if multiple images */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {displayImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`transition-all duration-200 rounded-full ${
                  i === current
                    ? "w-5 h-1.5 bg-white"
                    : "w-1.5 h-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail strip — only if multiple images */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto">
          {displayImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                i === current
                  ? "border-gray-900 dark:border-white"
                  : "border-transparent"
              }`}
            >
              <Image
                src={img}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
