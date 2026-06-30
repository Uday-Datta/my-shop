import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="aspect-square bg-gray-100 relative">
        <Image
          src={product.image || "https://placehold.co/400x300?text=No+Image"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform"
        />
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-500 uppercase">{product.category}</p>
        <h3 className="font-semibold mt-1">{product.name}</h3>
        <p className="text-lg font-bold mt-2">${product.price.toFixed(2)}</p>
      </div>
    </Link>
  );
}
