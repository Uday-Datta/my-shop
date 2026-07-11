import HeroBanner from "@/components/home/HeroBanner";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import PromoBanner from "@/components/home/PromoBanner";
import TrustBadges from "@/components/home/TrustBadges";
import ProductGrid from "@/components/product/ProductGrid";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div className="space-y-10 pb-10">
      {/* Hero Banner — full width, no padding */}
      <HeroBanner />

      <div className="page-container space-y-12">
        {/* Trust badges */}
        <TrustBadges />

        {/* Category grid */}
        <CategoryGrid />

        {/* Promo banners */}
        <PromoBanner />

        {/* Featured / New arrivals */}
        <FeaturedProducts />

        {/* Full product grid with search */}
        <div>
          <div className="mb-5">
            <h2 className="text-gray-900 dark:text-white text-xl md:text-2xl">
              All Products
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              সকল পণ্য
            </p>
          </div>
          <ProductGrid />
        </div>
      </div>
    </div>
  );
}
