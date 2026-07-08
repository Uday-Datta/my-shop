"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

export default function HeroBanner() {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/banners?type=HERO")
      .then((res) => res.json())
      .then((data) => {
        setSlides(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (paused || slides.length === 0) return;
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, [paused, next, slides.length]);

  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    setTouchStart(null);
  };

  if (loading) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 animate-pulse min-h-[280px] md:min-h-[400px]" />
    );
  }

  if (slides.length === 0) return null;

  const slide = slides[current];

  return (
    <div
      className="relative overflow-hidden rounded-none md:rounded-2xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={`bg-gradient-to-br ${
          slide.gradient || "from-gray-700 to-gray-900"
        } transition-all duration-700`}
      >
        <div className="page-container">
          <div className="flex items-center justify-between min-h-[280px] md:min-h-[400px] py-10 md:py-16">
            <div className="flex-1 max-w-lg">
              {slide.badge && (
                <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  {slide.badge} {slide.badgebn && `· ${slide.badgebn}`}
                </span>
              )}

              <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-1">
                {slide.title}
              </h2>
              {slide.titlebn && (
                <p className="text-lg md:text-2xl font-medium text-white/80 mb-3">
                  {slide.titlebn}
                </p>
              )}
              {slide.subtitle && (
                <p className="text-white/70 text-sm md:text-base mb-1">
                  {slide.subtitle}
                </p>
              )}
              {slide.subtitlebn && (
                <p className="text-white/60 text-xs md:text-sm mb-8">
                  {slide.subtitlebn}
                </p>
              )}

              <Link
                href={slide.href}
                className="inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors text-sm md:text-base"
              >
                {slide.cta || "Shop Now"}
                {slide.ctabn && ` · ${slide.ctabn}`}
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

            {slide.emoji && (
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
            )}
          </div>
        </div>
      </div>

      {/* Prev/Next */}
      {slides.length > 1 && (
        <>
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
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {slides.map((_, i) => (
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
      )}
    </div>
  );
}
