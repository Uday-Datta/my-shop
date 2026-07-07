import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/product/ProductCard";

export default async function FeaturedProducts() {
  const products = await prisma.product.findMany({
    take: 4,
    where: { stock: { gt: 0 } },
    orderBy: { createdAt: "desc" },
    include: {
      reviews: { select: { rating: true } },
      category: { select: { name: true, namebn: true, slug: true } },
    },
  });

  const productsWithRating = products.map((p) => ({
    ...p,
    averageRating: p.reviews.length
      ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
      : 0,
    reviewCount: p.reviews.length,
  }));

  if (productsWithRating.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-gray-900 dark:text-white text-xl md:text-2xl">
            New Arrivals
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            নতুন পণ্য সমূহ
          </p>
        </div>
        <Link
          href="/"
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1"
        >
          View all
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {productsWithRating.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            priority={index < 2}
          />
        ))}
      </div>
    </div>
  );
}
