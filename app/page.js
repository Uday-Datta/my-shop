import ProductGrid from "@/components/product/ProductGrid";

export default function HomePage() {
  return (
    <div className="page-container py-10">
      <div className="mb-8">
        <h1 className="text-gray-900 dark:text-white">Shop Our Products</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Discover our curated collection of quality products.
        </p>
      </div>
      <ProductGrid />
    </div>
  );
}
