import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/product/AddToCartButton";
import ReviewSection from "@/components/product/ReviewSection";
import ProductImageGallery from "@/components/product/ProductImageGallery";

export default async function ProductDetailPage({ params }) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { reviews: true, category: true },
  });

  if (!product) return notFound();

  const averageRating = product.reviews.length
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
      product.reviews.length
    : 0;

  return (
    <main className="page-container py-6 md:py-10">
      <div className="grid md:grid-cols-2 gap-6 md:gap-10">
        {/* Swipeable image gallery */}
        <ProductImageGallery
          images={product.image ? [product.image] : []}
          productName={product.name}
        />

        {/* Details */}
        <div>
          <p className="label">{product.category?.name || "Uncategorized"}</p>
          <h1 className="text-gray-900 dark:text-white mt-2">{product.name}</h1>

          {product.reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-3">
              <StarRatingStatic rating={Math.round(averageRating)} />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {averageRating.toFixed(1)} ({product.reviews.length} review
                {product.reviews.length !== 1 ? "s" : ""})
              </span>
            </div>
          )}

          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-6">
            ৳{product.price.toFixed(2)}
          </p>
          <p className="text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">
            {product.description}
          </p>
          <p
            className={`text-sm mt-4 font-medium ${
              product.stock === 0
                ? "text-red-500"
                : product.stock <= 5
                ? "text-yellow-600 dark:text-yellow-400"
                : "text-green-600 dark:text-green-400"
            }`}
          >
            {product.stock === 0
              ? "Out of stock"
              : product.stock <= 5
              ? `Only ${product.stock} left in stock`
              : `${product.stock} in stock`}
          </p>

          {/* Desktop add to cart */}
          <div className="mt-8 hidden md:block">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>

      <ReviewSection productId={product.id} />

      {/* Mobile floating add to cart bar */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 z-30 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-3 flex items-center gap-3">
        <div className="flex-1">
          <p className="text-xs text-gray-400 dark:text-gray-500">Price</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            ৳{product.price.toFixed(2)}
          </p>
        </div>
        <div className="flex-1">
          <AddToCartButton product={product} />
        </div>
      </div>
    </main>
  );
}

function StarRatingStatic({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className={`w-4 h-4 ${
            i < rating ? "fill-yellow-400" : "fill-gray-200 dark:fill-gray-700"
          }`}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}
