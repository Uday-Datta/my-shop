"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function PromoBanner() {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    fetch("/api/banners?type=PROMO")
      .then((res) => res.json())
      .then((data) => setBanners(Array.isArray(data) ? data : []))
      .catch(() => setBanners([]));
  }, []);

  if (banners.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {banners.map((banner) => (
        <Link
          key={banner.id}
          href={banner.href}
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${
            banner.gradient || "from-gray-600 to-gray-800"
          } p-6 md:p-8 flex items-center justify-between group hover:shadow-lg transition-shadow`}
        >
          <div>
            {banner.cta && (
              <p className="text-white/80 text-sm font-medium mb-1">
                {banner.cta}
              </p>
            )}
            <h3 className="text-white text-xl md:text-2xl font-bold mb-1">
              {banner.title}
            </h3>
            {banner.titlebn && (
              <p className="text-white/80 text-sm mb-4">{banner.titlebn}</p>
            )}
            {banner.badge && (
              <span
                className={`inline-flex items-center gap-1 bg-white text-sm font-bold px-3 py-1.5 rounded-full`}
                style={{ color: "inherit" }}
              >
                {banner.badge}
              </span>
            )}
          </div>
          {banner.emoji && (
            <span className="text-6xl md:text-7xl group-hover:scale-110 transition-transform duration-300 select-none">
              {banner.emoji}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}
