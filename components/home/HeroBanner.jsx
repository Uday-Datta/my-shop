"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

const SLIDES = [
  {
    id: 1,
    title: "New Arrivals",
    titlebn: "নতুন কালেকশন",
    subtitle: "Discover the latest fashion trends",
    subtitlebn: "সর্বশেষ ফ্যাশন ট্রেন্ড আবিষ্কার করুন",
    cta: "Shop Now",
    ctabn: "এখনই কিনুন",
    href: "/category/fashion",
    bg: "from-purple-600 to-indigo-700",
    emoji: "👗",
    badge: "New Season",
    badgebn: "নতুন সিজন",
  },
  {
    id: 2,
    title: "Electronics Sale",
    titlebn: "ইলেকট্রনিক্স সেল",
    subtitle: "Up to 40% off on top gadgets",
    subtitlebn: "সেরা গ্যাজেটে ৪০% পর্যন্ত ছাড়",
    cta: "Explore Deals",
    ctabn: "অফার দেখুন",
    href: "/category/electronics",
    bg: "from-blue-600 to-cyan-600",
    emoji: "📱",
    badge: "40% Off",
    badgebn: "৪০% ছাড়",
  },
  {
    id: 3,
    title: "Traditional Wear",
    titlebn: "ঐতিহ্যবাহী পোশাক",
    subtitle: "Celebrate culture with style",
    subtitlebn: "ঐতিহ্যকে স্টাইলে উদযাপন করুন",
    cta: "View Collection",
    ctabn: "কালেকশন দেখুন",
    href: "/category/traditional-wear",
    bg: "from-orange-500 to-rose-600",
    emoji: "🥻",
    badge: "Exclusive",
    badgebn: "এক্সক্লুসিভ",
  },
  {
    id: 4,
    title: "Sports & Fitness",
    titlebn: "স্পোর্টস ও ফিটনেস",
    subtitle: "Gear up for your best performance",
    subtitlebn: "সেরা পারফরম্যান্সের জন্য প্রস্তুত হন",
    cta: "Shop Sports",
    ctabn: "স্পোর্টস দেখুন",
    href: "/category/sports",
    bg: "from-green-500 to-emerald-600",
    emoji: "⚽",
    badge: "Best Sellers",
    badgebn: "বেস্ট সেলার",
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  // Auto-slide every 4 seconds
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, [paused, next]);

  // Touch swipe support
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
    setTouchStart(null);
  };

  const slide = SLIDES[current];

  return (
    <div
      className="relative overflow-hidden rounded-none md:rounded-2xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      <div
        className={`bg-gradient-to-br ${slide.bg} transition-all duration-700`}
      >
        <div className="page-container">
          <div className="flex items-center justify-between min-h-[280px] md:min-h-[400px] py-10 md:py-16">
            {/* Text content */}
            <div className="flex-1 max-w-lg">
              {/* Badge */}
              <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                {slide.badge} · {slide.badgebn}
              </span>

              {/* Title */}
              <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-1">
                {slide.title}
              </h2>
              <p className="text-lg md:text-2xl font-medium text-white/80 mb-3">
                {slide.titlebn}
              </p>

              {/* Subtitle */}
              <p className="text-white/70 text-sm md:text-base mb-1">
                {slide.subtitle}
              </p>
              <p className="text-white/60 text-xs md:text-sm mb-8">
                {slide.subtitlebn}
              </p>

              {/* CTA */}
              <Link
                href={slide.href}
                className="inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors text-sm md:text-base"
              >
                {slide.cta} · {slide.ctabn}
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

            {/* Emoji illustration */}
            <div className="hidden sm:flex items-center justify-center w-48 md:w-64 flex-shrink-0">
              <span
                className="text-8xl md:text-9xl select-none"
                style={{
                  filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.3))",
                  animation: "float 3s ease-in-out infinite",
                }}
              >
                {slide.emoji}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Prev/Next buttons */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
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
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
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
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? "w-6 h-2 bg-white"
                : "w-2 h-2 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
