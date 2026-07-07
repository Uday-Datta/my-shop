import Link from "next/link";

export default function PromoBanner() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Promo 1 */}
      <Link
        href="/category/fashion"
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 p-6 md:p-8 flex items-center justify-between group hover:shadow-lg transition-shadow"
      >
        <div>
          <p className="text-white/80 text-sm font-medium mb-1">
            Limited Time · সীমিত সময়
          </p>
          <h3 className="text-white text-xl md:text-2xl font-bold mb-1">
            Fashion Sale
          </h3>
          <p className="text-white/80 text-sm mb-4">ফ্যাশন সেল</p>
          <span className="inline-flex items-center gap-1 bg-white text-pink-600 text-xs font-bold px-3 py-1.5 rounded-full">
            Up to 50% Off · ৫০% পর্যন্ত ছাড়
          </span>
        </div>
        <span className="text-6xl md:text-7xl group-hover:scale-110 transition-transform duration-300 select-none">
          👗
        </span>
      </Link>

      {/* Promo 2 */}
      <Link
        href="/category/accessories"
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-6 md:p-8 flex items-center justify-between group hover:shadow-lg transition-shadow"
      >
        <div>
          <p className="text-white/80 text-sm font-medium mb-1">
            New Collection · নতুন কালেকশন
          </p>
          <h3 className="text-white text-xl md:text-2xl font-bold mb-1">
            Accessories
          </h3>
          <p className="text-white/80 text-sm mb-4">আনুষাঙ্গিক পণ্য</p>
          <span className="inline-flex items-center gap-1 bg-white text-amber-600 text-xs font-bold px-3 py-1.5 rounded-full">
            Shop Now · এখনই কিনুন
          </span>
        </div>
        <span className="text-6xl md:text-7xl group-hover:scale-110 transition-transform duration-300 select-none">
          👜
        </span>
      </Link>
    </div>
  );
}
