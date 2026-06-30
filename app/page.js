import ProductGrid from "@/components/product/ProductGrid";

export default function HomePage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Shop Our Products</h1>
      <ProductGrid />
    </main>
  );
}
