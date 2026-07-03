import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/product/AddToCartButton";

export default async function ProductDetailPage({ params }) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) return notFound();

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="aspect-square bg-gray-100 relative rounded-lg overflow-hidden">
          <Image
            src={product.image || "https://placehold.co/400x300?text=No+Image"}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            loading="eager"
            className="object-cover"
          />
        </div>

        <div>
          <p className="text-sm text-gray-500 uppercase">{product.category}</p>
          <h1 className="text-3xl font-bold mt-2">{product.name}</h1>
          <p className="text-2xl font-semibold mt-4">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-gray-600 mt-6">{product.description}</p>
          <p className="text-sm text-gray-500 mt-4">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>

          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </main>
  );
}
