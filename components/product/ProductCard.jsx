import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ product, priority = false }) {
  const isOutOfStock = product.stock === 0;

  return (
    <Link
      href={`/products/${product.id}`}
      className={`group relative flex flex-col bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
        isOutOfStock ? "opacity-60" : ""
      }`}
    >
      {/* Image container */}
      <div className="relative aspect-square bg-gray-50 dark:bg-gray-800 overflow-hidden">
        <Image
          src={product.image || "https://placehold.co/400x400?text=No+Image"}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={priority}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Overlay badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isOutOfStock && (
            <span className="badge bg-gray-900 dark:bg-gray-700 text-white text-xs px-2.5 py-1">
              Out of Stock
            </span>
          )}
          {!isOutOfStock && product.stock <= 5 && (
            <span className="badge bg-red-500 text-white text-xs px-2.5 py-1">
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 dark:group-hover:bg-black/30 transition-colors duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
          <span className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            View Product
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Category */}
        <span className="label text-xs">{product.category}</span>

        {/* Name */}
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mt-1.5 leading-snug line-clamp-2 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price row */}
        <div className="flex items-center justify-between mt-auto pt-4">
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            ${product.price.toFixed(2)}
          </p>

          {/* Add to cart hint */}
          {!isOutOfStock && (
            <span className="text-xs text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
              + Add to cart
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
